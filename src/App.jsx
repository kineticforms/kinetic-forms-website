import { Zap, Layers, Maximize, ArrowRight } from "lucide-react";
import CanvasWave from "./components/CanvasWave";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TypewriterHeading from "./components/TypewriterHeading";

const PILLARS = [
  {
    title: "Velocity",
    description:
      "The world is now moving faster than anyone ever thought possible. You need to move with it. We can help.",
    icon: Zap,
  },
  {
    title: "Personality",
    description:
      "Every experience should feel personal and deeply human. Delight is not an afterthought. It's core to everything we build.",
    icon: Layers,
  },
  {
    title: "Precision",
    description:
      "An uncompromising attention to detail, ensuring every pixel, transition, and micro-interaction is perfectly resolved.",
    icon: Maximize,
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Particle background */}
      <div className="fixed top-0 left-0 w-full h-[80vh] pointer-events-none overflow-hidden z-0">
        <CanvasWave />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/20 to-zinc-50 pointer-events-none" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto space-y-24">
        {/* Hero */}
        <div className="space-y-6">
          <TypewriterHeading />
          <div className="max-w-2xl space-y-4">
            <p className="text-zinc-500 text-lg leading-relaxed">
              Kinetic Forms is an AI-native software consultancy built for
              velocity. We blend relentless momentum with considered,
              human-centric details — creating digital experiences that feel
              alive, intuitive, and relentlessly forward-leaning.
            </p>
          </div>
          <div className="pt-6">
            <a
              href="mailto:hello@kineticforms.com"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white text-sm font-semibold uppercase tracking-wider rounded-full hover:-translate-y-0.5 transition-all duration-300"
            >
              Start a Project <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Brand Pillars */}
        <div className="space-y-8">
          <h2 className="text-2xl font-medium tracking-tight border-b border-zinc-200 pb-4">
            What We Bring
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PILLARS.map((pillar, i) => (
              <div
                key={i}
                className="p-8 border border-zinc-200 rounded-2xl bg-white hover:border-zinc-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                  <pillar.icon className="w-5 h-5 text-zinc-900" />
                </div>
                <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="aspect-square bg-zinc-900 rounded-3xl flex items-center justify-center p-12 group overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative w-full h-full border border-white/10 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
              <div className="w-1/2 h-0.5 bg-white rotate-45 translate-x-4" />
              <div className="w-1/2 h-0.5 bg-white -rotate-45 translate-x-4" />
              <div className="absolute w-0.5 h-1/2 bg-white -translate-x-8" />
            </div>
          </div>
          <div className="aspect-square bg-white border border-zinc-200 rounded-3xl p-12 flex flex-col justify-between hover:border-zinc-300 transition-colors">
            <div className="space-y-6">
              <div className="h-1 w-12 bg-black" />
              <h4 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">
                Built for
                <br />
                What's Next
              </h4>
              <div className="text-zinc-500 text-base max-w-sm space-y-3">
                <p>
                  A high-contrast, monochrome interface for an AI-native design
                  platform. Minimal and forward-leaning with precise typography,
                  generous whitespace, and stark black-on-white contrast.
                </p>
                <p>
                  Every element prioritizes clarity and velocity — no decorative
                  noise, no ambiguous hierarchy.
                </p>
              </div>
            </div>
            <a
              href="mailto:hello@kineticforms.com"
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-black hover:gap-3 transition-all"
            >
              Let's Talk <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
