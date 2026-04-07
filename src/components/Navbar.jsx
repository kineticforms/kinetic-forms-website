import { ArrowRight } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
          <span className="text-white font-bold text-xs">K.</span>
        </div>
        <span className="font-semibold tracking-tight text-sm">
          Kinetic Forms
        </span>
      </div>
      <a
        href="mailto:hello@kineticforms.ai"
        className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:-translate-y-0.5 transition-all duration-300"
      >
        Get in Touch <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </nav>
  );
}
