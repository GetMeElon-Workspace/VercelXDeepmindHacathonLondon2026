'use client';

import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';

import BaseNode from './BaseNode';
import ProposalNode from './ProposalNode';
import { useStore } from '../lib/store';

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useStore();

  const nodeTypes = useMemo(() => ({ base: BaseNode, proposal: ProposalNode }), []);

  return (
    <div className="w-full h-full bg-[#0a0a0f]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
    </div>
  );
}
