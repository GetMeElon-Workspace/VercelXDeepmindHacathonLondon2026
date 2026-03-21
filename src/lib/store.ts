import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow';
import { Proposal } from './schema';
import { v4 as uuidv4 } from 'uuid';
import { initialNodes, initialEdges } from './seed-data';

interface AppState {
  nodes: Node[];
  edges: Edge[];
  addProposalNodes: (proposals: Proposal[]) => void;
  acceptNode: (id: string) => void;
  rejectNode: (id: string) => void;
  getBaseModelContext: () => any;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
}

export const useStore = create<AppState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,

  addProposalNodes: (proposals) => {
    const newNodes: Node[] = proposals.map((p, index) => ({
      id: p.id || uuidv4(),
      type: 'proposal',
      position: { x: 400 + index * 250, y: 100 + index * 50 },
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

      const updatedNodes = state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, status: 'active' }, type: 'base' } : n
      );

      // Create a default edge to a parent if possible, or just merge
      // For the hackathon demo, we might just mark it active.
      // A more complex logic would find the most relevant parent.
      return { nodes: updatedNodes };
    });
  },

  rejectNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
    }));
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
