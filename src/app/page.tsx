import Canvas from '../components/Canvas';

export default function Page() {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-[#0a0a0f]">
      {/* Left 70% Canvas */}
      <div className="w-[70%] h-full border-r border-gray-800">
        <Canvas />
      </div>

      {/* Right 30% Chat / Info Panel placeholder */}
      <div className="w-[30%] h-full flex flex-col items-center justify-center text-gray-500 glass-panel">
        <p>Chat Panel Placeholder</p>
      </div>
    </main>
  );
}