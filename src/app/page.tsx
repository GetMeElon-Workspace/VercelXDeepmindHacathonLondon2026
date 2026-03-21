import Canvas from '@/components/Canvas'
import ChatPanel from '@/components/ChatPanel'

export default function Home() {
  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* Canvas Area - 70% width */}
      <section className="flex-grow h-full border-r border-slate-800/50 bg-[#0a0a0f] relative">
         <Canvas />
      </section>

      {/* Chat Area - 30% width */}
      <aside className="w-[380px] h-full flex flex-col bg-slate-900/50 border-l border-slate-800">
         <ChatPanel />
      </aside>
    </main>
  )
}
