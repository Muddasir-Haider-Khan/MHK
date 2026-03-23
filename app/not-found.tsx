import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center relative z-10">
        <p className="text-sm uppercase tracking-widest text-gray-500 mb-6 font-mono">
          Error 404
        </p>
        <h1 className="text-8xl md:text-[12rem] font-display font-bold leading-none mb-4 text-white">
          4<span className="gradient-text-animated">0</span>4
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-md mx-auto">
          This page doesn&apos;t exist. Maybe it was moved, or maybe it was never here.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors hover-magnetic"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
