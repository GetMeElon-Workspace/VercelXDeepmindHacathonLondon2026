import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { BaseNodeData } from '../lib/seed-data';

export default function BaseNode({ data, isConnectable }: NodeProps<BaseNodeData>) {
  const badgeColors = {
    calc: 'bg-blue-900 text-blue-200 border-blue-700',
    physics: 'bg-purple-900 text-purple-200 border-purple-700',
    financial: 'bg-emerald-900 text-emerald-200 border-emerald-700',
  };

  const badgeClass = badgeColors[data.type] || 'bg-gray-700 text-gray-200 border-gray-600';

  return (
    <div className="w-64 rounded-xl border border-gray-800 bg-[#12121a]/90 backdrop-blur-md shadow-lg transition-transform hover:scale-[1.02] hover:border-gray-600 hover:shadow-xl overflow-hidden text-sm node-animate-enter">
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-gray-500 border-2 border-[#12121a]" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-[#1a1a24]/50">
        <div className="font-semibold text-gray-100">{data.label}</div>
        <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
          {data.type}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        {data.data.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-xs">
            <span className="text-gray-400">{item.label}</span>
            <span className="text-gray-100 font-mono">{item.value}</span>
          </div>
        ))}
      </div>

      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-3 h-3 bg-gray-500 border-2 border-[#12121a]" />
    </div>
  );
}