'use client';

import React, { useMemo, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';

import BaseNode from './BaseNode';
import ProposalNode from './ProposalNode';
import InspectPanel from './InspectPanel';
import { useStore } from '../lib/store';
import { completedFranceNodes, completedFranceEdges } from '../lib/seed-data';

const nodeTypes = { base: BaseNode, proposal: ProposalNode };

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, setNodes, setEdges, setInspectOpen, setReactFlowInstance } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setNodes(completedFranceNodes);
        setEdges(completedFranceEdges);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-full canvas-background relative">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setInspectOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded shadow-lg transition-colors text-sm font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Inspect
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#333" gap={16} size={1} />
        <Controls className="bg-gray-800 border-gray-700 fill-gray-300" />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case 'base': return '#1a1a24';
              default: return '#eee';
            }
          }}
          maskColor="rgba(10, 10, 15, 0.7)"
          style={{ backgroundColor: '#12121a' }}
        />
      </ReactFlow>
      <InspectPanel />
    </div>
  );
}
