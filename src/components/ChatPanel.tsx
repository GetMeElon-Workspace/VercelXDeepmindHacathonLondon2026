'use client';

import React, { useState } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { NodeProposalSchema } from '@/lib/schema';
import { useStore } from '@/lib/store';

export default function ChatPanel() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([]);
  const addProposalNodes = useStore((state) => state.addProposalNodes);
  const getBaseModelContext = useStore((state) => state.getBaseModelContext);

  const { submit, object, isLoading } = useObject({
    api: '/api/generate',
    schema: NodeProposalSchema,
    onFinish: ({ object }: { object: any }) => {
      if (object?.proposals) {
        addProposalNodes(object.proposals);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: input }]);

    submit({
      prompt: input,
      baseModelContext: getBaseModelContext(),
    });
    setInput('');
  };

  return (
    <div className="chat-panel flex flex-col h-full bg-[#0a0a0f] border-l border-white/10 w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Simple message log */}
        <div className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-2">
          Chat History
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className="bg-amber-500/10 border border-amber-500/20 text-white/90 rounded-lg p-3 text-sm self-end">
            <span className="text-amber-500 font-bold mr-2">You:</span>
            {msg.content}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-amber-400">
            <div className="animate-pulse">●</div>
            <div className="text-sm">Gemini is analyzing and proposing nodes...</div>
          </div>
        )}
        {object?.proposals && object.proposals.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="text-sm text-white/80">
              Generated {object.proposals.length} new proposals.
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-black/20">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Branch this model for France..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-white/20"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 px-3 rounded-lg bg-amber-500 text-black font-bold text-xs disabled:opacity-50 transition-opacity"
          >
            {isLoading ? '...' : '→'}
          </button>
        </form>
      </div>
    </div>
  );
}
