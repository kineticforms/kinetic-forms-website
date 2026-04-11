import { ArrowRight } from "lucide-react";
import CanvasWave from "./components/CanvasWave";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TypewriterHeading from "./components/TypewriterHeading";
import PillarCards from "./components/PillarCards";

const PILLARS = [
  {
    title: "Velocity",
    description:
      "The world is now moving faster than anyone ever thought possible. You need to move with it. We can help.",
  },
  {
    title: "Personality",
    description:
      "Every experience should feel personal and deeply human. Delight is not an afterthought. It's core to everything we build.",
  },
  {
    title: "Precision",
    description:
      "Always sweat the small stuff. Our edge is our attention to detail. We're not done until every pixel is perfect, every transition is seamless, and every interaction is perfectly resolved.",
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Particle background */}
      <div className="fixed top-[10vh] md:top-0 left-0 w-full h-[80vh] pointer-events-none overflow-hidden z-0">
        <CanvasWave />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/20 to-zinc-50 pointer-events-none" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-28 md:pt-32 pb-16 md:pb-24 px-5 md:px-6 max-w-6xl mx-auto space-y-16 md:space-y-24">
        {/* Hero — fills mobile viewport, spaced across the screen */}
        <div className="min-h-[calc(100svh-7rem)] md:min-h-0 flex flex-col justify-between md:justify-center md:gap-0">
          <div className="flex-1 flex flex-col justify-center gap-10 md:gap-0 md:flex-none md:space-y-6 -mt-12 md:mt-0">
            <TypewriterHeading />
            <div className="max-w-2xl">
              <p className="text-zinc-500 text-base md:text-lg leading-relaxed">
                Kinetic Forms is an AI-native product studio built for velocity. We blend relentless momentum with considered, human-centric details — creating digital experiences that feel alive, intuitive, and forward-leaning by design.
              </p>
            </div>
            <div className="md:pt-6">
              <a
                href="mailto:hello@kineticforms.ai"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-black text-white text-xs md:text-sm font-semibold uppercase tracking-wider rounded-full hover:-translate-y-0.5 transition-all duration-300"
              >
                Get in Touch <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
            </div>
          </div>

          {/* Scroll hint — mobile only */}
          <div className="flex md:hidden flex-col items-center pb-4">
            <svg width="20" height="32" viewBox="0 0 20 32" fill="none" className="text-zinc-400 animate-[pulse_2.5s_ease-in-out_infinite]">
              <path d="M10 6 L10 24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <path d="M5 19 L10 25 L15 19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Brand Pillars */}
        <div className="space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-medium tracking-tight border-b border-zinc-200 pb-3 md:pb-4">
            What We Bring
          </h2>
          <PillarCards pillars={PILLARS} />
        </div>

        {/* Hero Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="aspect-[3/2] md:aspect-square bg-zinc-900 rounded-2xl md:rounded-3xl flex items-center justify-center p-8 md:p-12 group overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative w-[160px] h-[160px] md:w-[280px] md:h-[280px] border border-white/10 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
              <div className="w-1/2 h-0.5 bg-white rotate-45 translate-x-[10%]" />
              <div className="w-1/2 h-0.5 bg-white -rotate-45 translate-x-[10%]" />
              <div className="absolute w-0.5 h-1/2 bg-white -translate-x-[20%]" />
            </div>
          </div>
          <div className="aspect-auto md:aspect-square bg-white border border-zinc-200 rounded-2xl md:rounded-3xl p-7 md:p-12 flex flex-col justify-between hover:border-zinc-300 transition-colors">
            <div className="space-y-5 md:space-y-6">
              <div className="h-1 w-12 bg-black" />
              <h4 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight">
                Products
                <br />
                In Motion
              </h4>
              <div className="text-zinc-500 text-base md:text-base max-w-sm space-y-3">
                <p>
                  We're building software products across AI productivity,
                  creative tools, and niche markets that are ripe for
                  reinvention.
                </p>
                <p>
                  More coming soon. If you're curious about what we're working
                  on, reach out.
                </p>
              </div>
            </div>
            <a
              href="mailto:hello@kineticforms.ai"
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-black hover:gap-3 transition-all mt-8 md:mt-0"
            >
              Say Hello <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
