import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow';
import { Proposal } from './schema';
import { v4 as uuidv4 } from 'uuid';
import { initialNodes, initialEdges } from './seed-data';

interface AppState {
  nodes: Node[];
  edges: Edge[];
  isInspectOpen: boolean;
  addProposalNodes: (proposals: Proposal[]) => void;
  acceptNode: (id: string) => void;
  rejectNode: (id: string) => void;
  getBaseModelContext: () => any;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setInspectOpen: (open: boolean) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
}

export const useStore = create<AppState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  isInspectOpen: false,

  addProposalNodes: (proposals) => {
    const { nodes: existingNodes } = get();
    // Position new proposals below the existing graph to avoid overlaps
    const maxY = existingNodes.reduce((max, n) => Math.max(max, n.position.y), 0);
    const baseY = maxY + 180;

    const newNodes: Node[] = proposals.map((p, index) => ({
      id: p.id || uuidv4(),
      type: 'proposal',
      position: { x: 150 + index * 320, y: baseY + index * 80 },
      data: { 
        ...p,
        status: 'pending'
      },
    }));
    set((state) => ({ nodes: [...state.nodes, ...newNodes] }));
  },

  acceptNode: (id) => {
    set((state) => {
      const node = state.nodes.find((n) => n.id === id);
      if (!node) return state;

      // Map proposal data fields to BaseNode-compatible fields
      const acceptedData = {
        ...node.data,
        label: node.data.title || node.data.label, // Proposals use 'title', BaseNode uses 'label'
        status: 'active',
      };

      const updatedNodes = state.nodes.map((n) =>
        n.id === id ? { ...n, data: acceptedData, type: 'base' } : n
      );

      // Find the best parent node to connect from:
      // 1. Prefer a base node of the same type (calc→calc, physics→physics)
      // 2. Fall back to any base/active node
      const baseNodes = state.nodes.filter(
        (n) => n.id !== id && n.type === 'base' && n.data.status !== 'pending'
      );

      let parentNode = baseNodes.find((n) => n.data.type === node.data.type);
      if (!parentNode && baseNodes.length > 0) {
        // Fall back to the rightmost base node (end of the chain)
        parentNode = baseNodes.reduce((best, n) =>
          n.position.x > best.position.x ? n : best
        , baseNodes[0]);
      }

      // Create an edge from the parent to the accepted node
      const newEdges = parentNode
        ? [
            ...state.edges,
            {
              id: `e-${parentNode.id}-${id}`,
              source: parentNode.id,
              target: id,
              animated: true,
            },
          ]
        : state.edges;

      return { nodes: updatedNodes, edges: newEdges };
    });
  },

  rejectNode: (id) => {
    // Set exiting state first to trigger animation
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, exiting: true } } : n
      ),
    }));
    
    // Remove after animation completes
    setTimeout(() => {
      set((state) => ({
        nodes: state.nodes.filter((n) => n.id !== id),
      }));
    }, 300);
  },

  getBaseModelContext: () => {
    const { nodes, edges } = get();
    return {
      activeNodes: nodes.filter((n) => n.data.status === 'active'),
      edges: edges,
    };
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setInspectOpen: (open) => set({ isInspectOpen: open }),
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(connection, state.edges),
    }));
  },
}));
