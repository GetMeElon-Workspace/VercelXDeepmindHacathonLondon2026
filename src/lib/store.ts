import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow';
import { Proposal } from './schema';
import { v4 as uuidv4 } from 'uuid';
import { initialNodes, initialEdges } from './seed-data';
import dagre from 'dagre';


interface AppState {
  nodes: Node[];
  edges: Edge[];
  isInspectOpen: boolean;
  addProposalNodes: (proposals: Proposal[]) => void;
  acceptNode: (id: string) => void;
  rejectNode: (id: string) => void;
  autoLayout: () => void;
  getBaseModelContext: () => any;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setInspectOpen: (open: boolean) => void;
  reactFlowInstance: any | null;
  setReactFlowInstance: (instance: any) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
}

export const useStore = create<AppState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  isInspectOpen: false,
  reactFlowInstance: null,

  setReactFlowInstance: (reactFlowInstance) => set({ reactFlowInstance }),

  addProposalNodes: (proposals) => {
    const newNodes: Node[] = proposals.map((p) => {
      return {
        id: p.id || uuidv4(),
        type: 'proposal',
        position: { x: 0, y: 0 }, // Position will be handled by autoLayout
        data: { 
          ...p,
          status: 'pending'
        },
      };
    });
    
    set((state) => ({ nodes: [...state.nodes, ...newNodes] }));
    get().autoLayout();
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
      // If the node is financial or related to feedstock, it should flow INTO the parent
      const isInbound = node.data.type === 'financial' || node.data.label?.toLowerCase().includes('feedstock') || node.data.title?.toLowerCase().includes('feedstock');
      
      const newEdges = parentNode
        ? [
            ...state.edges,
            {
              id: `e-${parentNode.id}-${id}`,
              source: isInbound ? id : parentNode.id,
              target: isInbound ? parentNode.id : id,
              animated: true,
            },
          ]
        : state.edges;

      return { nodes: updatedNodes, edges: newEdges };
    });
    
    get().autoLayout();
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

  autoLayout: () => {
    const { nodes, edges, reactFlowInstance } = get();
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'LR' }); // Left to Right layout

    const nodeWidth = 320;
    const nodeHeight = 150;

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
    });

    set({ nodes: layoutedNodes });

    if (reactFlowInstance) {
      window.requestAnimationFrame(() => {
        reactFlowInstance.fitView({ duration: 800, padding: 0.2 });
      });
    }
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
