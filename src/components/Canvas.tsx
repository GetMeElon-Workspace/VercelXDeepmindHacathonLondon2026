'use client';

import React, { useMemo, useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  applyNodeChanges, 
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';

import BaseNode from './BaseNode';
import { initialNodes, initialEdges } from '../lib/seed-data';

export default function Canvas() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const nodeTypes = useMemo(() => ({ base: BaseNode }), []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

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