import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useStore } from '../lib/store';
import { Proposal } from '../lib/schema';

// React Flow passes the node's internal `id` as a top-level prop.
// The `data` prop receives the data object defined when adding the node.
type ProposalNodeData = Proposal & { status?: string, exiting?: boolean };

export default function ProposalNode({ id, data, isConnectable }: NodeProps<ProposalNodeData>) {
  const { acceptNode, rejectNode } = useStore();

  const badgeColors: Record<string, string> = {
    calc: 'bg-blue-900 text-blue-200 border-blue-700',
    physics: 'bg-purple-900 text-purple-200 border-purple-700',
    financial: 'bg-emerald-900 text-emerald-200 border-emerald-700',
  };

  const badgeClass = badgeColors[data.type] || 'bg-gray-700 text-gray-200 border-gray-600';

  return (
    <div className={`w-80 rounded-xl border-2 border-dashed border-yellow-600 glass-panel pending-node shadow-[0_0_15px_rgba(202,138,4,0.2)] transition-all hover:scale-[1.02] overflow-hidden text-sm relative node-animate-enter ${data.exiting ? 'node-animate-exit' : ''}`}>
      <Handle 
        type="target" 
        position={Position.Left} 
        isConnectable={isConnectable} 
        className="w-3 h-3 bg-yellow-500 border-2 border-[#12121a]" 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-yellow-800/50 bg-[#1a1a24]/80">
        <div className="font-semibold text-yellow-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          {data.title}
        </div>
        <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
          {data.type}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4 bg-[#12121a]/95">
        
        {/* Data Rows */}
        {data.data && data.data.length > 0 && (
          <div className="space-y-2">
            {data.data.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-xs bg-[#1a1a24] p-2 rounded-md border border-gray-800">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-gray-100 font-mono font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Rationale */}
        {data.rationale && (
          <div className="text-xs text-gray-300 italic border-l-2 border-yellow-600/50 pl-2 py-1">
            "{data.rationale}"
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-800">
          <button
            onClick={() => acceptNode(id)}
            className="flex-1 bg-green-900/30 hover:bg-green-800/50 text-green-400 border border-green-800 hover:border-green-600 transition-colors py-1.5 rounded-md font-medium flex items-center justify-center gap-1"
            title="Accept Proposal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Accept
          </button>
          <button
            onClick={() => rejectNode(id)}
            className="flex-1 bg-red-900/30 hover:bg-red-800/50 text-red-400 border border-red-800 hover:border-red-600 transition-colors py-1.5 rounded-md font-medium flex items-center justify-center gap-1"
            title="Reject Proposal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject
          </button>
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        isConnectable={isConnectable} 
        className="w-3 h-3 bg-yellow-500 border-2 border-[#12121a]" 
      />
    </div>
  );
}
