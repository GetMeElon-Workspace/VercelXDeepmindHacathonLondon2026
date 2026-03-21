import Canvas from '@/components/Canvas'
import ChatPanel from '@/components/ChatPanel'

export default function Home() {
  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#0a0a0f]">
      {/* Canvas Area - 70% width */}
      <section className="w-[70%] h-full border-r border-slate-800/50 relative">
         <Canvas />
      </section>

      {/* Chat Area - 30% width */}
      <aside className="w-[30%] h-full flex flex-col bg-slate-900/50 border-l border-slate-800 glass-panel">
         <ChatPanel />
      </aside>
    </main>
  )
}
