'use client';

import React, { useState } from 'react';
import { useStore } from '../lib/store';

export default function InspectPanel() {
  const { isInspectOpen, setInspectOpen, nodes } = useStore();
  const [activeTab, setActiveTab] = useState<'full' | 'inputs'>('full');

  if (!isInspectOpen) return null;

  const baseNodes = nodes.filter(n => n.type === 'base');
  const proposalNodes = nodes.filter(n => n.type === 'proposal');

  // Build inputs table data
  // Combine base and proposal data
  const tableData: Record<string, { base: string, proposed: string, status: string }> = {};

  baseNodes.forEach(n => {
    const nodeLabel = n.data?.label || n.data?.title || n.id;
    n.data?.data?.forEach((d: any) => {
      const key = `${nodeLabel} - ${d.label}`;
      if (!tableData[key]) tableData[key] = { base: '-', proposed: '-', status: 'active' };
      tableData[key].base = d.value;
    });
  });

  proposalNodes.forEach(n => {
    const nodeLabel = n.data?.label || n.data?.title || n.id;
    n.data?.data?.forEach((d: any) => {
      const key = `${nodeLabel} - ${d.label}`;
      if (!tableData[key]) tableData[key] = { base: '-', proposed: '-', status: n.data.status || 'pending' };
      tableData[key].proposed = d.value;
      if (tableData[key].status === 'active') {
        tableData[key].status = n.data.status || 'pending';
      }
    });
  });

  const handleCopy = () => {
    const headers = "Parameter\tBase Value\tProposed Value\tStatus";
    const rows = Object.entries(tableData).map(([key, val]) => `${key}\t${val.base}\t${val.proposed}\t${val.status}`).join('\n');
    navigator.clipboard.writeText(`${headers}\n${rows}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity" 
        onClick={() => setInspectOpen(false)}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-[600px] max-w-full bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col text-sm text-slate-300 transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-lg font-semibold text-white">Inspect Model</h2>
          <button 
            onClick={() => setInspectOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-800/30">
          <button 
            className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'full' ? 'text-white border-b-2 border-amber-500 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
            onClick={() => setActiveTab('full')}
          >
            Full Model
          </button>
          <button 
            className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'inputs' ? 'text-white border-b-2 border-amber-500 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
            onClick={() => setActiveTab('inputs')}
          >
            Inputs Tab
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'full' ? (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-white font-medium mb-3 pb-1 border-b border-slate-700">Input Section (Base Model)</h3>
                {baseNodes.length === 0 && <p className="text-slate-500 italic">No base nodes.</p>}
                <div className="grid gap-3">
                  {baseNodes.map(n => (
                    <div key={n.id} className="bg-slate-800 p-3 rounded border border-slate-700">
                      <div className="font-medium text-white mb-2">{n.data?.label || n.data?.title || 'Unknown'} <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded ml-2">{n.data?.type || 'node'}</span></div>
                      <div className="grid grid-cols-2 gap-2">
                        {n.data?.data?.map((d: any, i: number) => (
                          <div key={i} className="flex justify-between text-xs bg-slate-900/50 p-1.5 rounded">
                            <span className="text-slate-400">{d.label}</span>
                            <span className="font-mono text-amber-100">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-3 pb-1 border-b border-slate-700">Output Section (AI Proposed)</h3>
                {proposalNodes.length === 0 && <p className="text-slate-500 italic">No proposals yet.</p>}
                <div className="grid gap-3">
                  {proposalNodes.map(n => (
                    <div key={n.id} className="bg-slate-800 p-3 rounded border border-amber-900/30">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium text-white">{n.data?.label || n.data?.title || 'Unknown'} <span className="text-xs text-amber-500/70 bg-amber-900/20 px-2 py-0.5 rounded ml-2">{n.data?.type || 'proposal'}</span></div>
                        <span className={`text-xs px-2 py-0.5 rounded ${n.data?.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-amber-900/30 text-amber-400'}`}>
                          {n.data?.status || 'pending'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {n.data?.data?.map((d: any, i: number) => (
                          <div key={i} className="flex justify-between text-xs bg-slate-900/50 p-1.5 rounded">
                            <span className="text-slate-400">{d.label}</span>
                            <span className="font-mono text-amber-100">{d.value}</span>
                          </div>
                        ))}
                      </div>
                      {n.data?.rationale && (
                        <div className="text-xs text-slate-400 bg-slate-900/30 p-2 rounded">
                          <span className="block font-medium text-slate-300 mb-1">Rationale:</span>
                          {n.data.rationale}
                        </div>
                      )}
                      {n.data?.sourceLinks?.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {n.data.sourceLinks.map((link: string, i: number) => (
                            <a key={i} href={link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 bg-blue-900/20 px-2 py-1 rounded-full truncate max-w-[200px]">
                              {link}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Input Assumptions</h3>
                <button 
                  onClick={handleCopy}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors border border-slate-600"
                >
                  Copy All
                </button>
              </div>
              <div className="overflow-x-auto border border-slate-700 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-300">
                    <tr>
                      <th className="p-3 font-medium border-b border-slate-700">Parameter</th>
                      <th className="p-3 font-medium border-b border-slate-700">Base Value</th>
                      <th className="p-3 font-medium border-b border-slate-700">Proposed Value</th>
                      <th className="p-3 font-medium border-b border-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 bg-slate-900/50">
                    {Object.entries(tableData).map(([key, val], i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 text-slate-300">{key}</td>
                        <td className="p-3 font-mono text-slate-400">{val.base}</td>
                        <td className={`p-3 font-mono ${val.proposed !== '-' && val.proposed !== val.base ? 'text-amber-400' : 'text-slate-400'}`}>{val.proposed}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                            val.status === 'active' ? 'bg-green-900/30 text-green-400' :
                            val.status === 'pending' ? 'bg-amber-900/30 text-amber-400' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {val.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {Object.keys(tableData).length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-500 italic">No data available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
