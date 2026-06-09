import { Typewriter } from "./components/Typewriter";
import { HorizonGrid } from "./components/HorizonGrid";
import { TrackedLink } from "./components/TrackedLink";
import { SupportButton } from "./components/SupportButton";

export default function Home() {
  // Donation mechanism (issue #7). The Ko-fi page URL lives in an env var, so the
  // Support section only renders once a destination is configured. This keeps a dead
  // link off the live site and lets it go live by setting KOFI_URL in Vercel.
  const kofiUrl = process.env.KOFI_URL;

  return (
    <main style={{ fontFamily: "var(--font-inter)" }}>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        <h1
          className="neon-flicker text-4xl tracking-wide sm:text-5xl sm:tracking-widest md:text-7xl lg:text-8xl font-black uppercase mb-6 leading-tight relative z-10"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--text)" }}
        >
          Frazzled
          <br />
          Productions
        </h1>
        <div className="relative z-10">
          <Typewriter text="Software for the fun of it." />
        </div>
        <div className="horizon-grid-container">
          <HorizonGrid />
        </div>
      </section>

      <hr className="divider mx-6 md:mx-auto md:max-w-3xl" />

      {/* About */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <h2
          className="text-xs tracking-widest uppercase mb-8"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--pink)" }}
        >
          About
        </h2>
        <p
          className="text-lg md:text-xl leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          Frazzled Productions is an independent software studio based in London.
          We build digital products (apps, tools, and platforms) with a focus on
          craft and longevity. Currently shipping Poké Memory, with more in the works.
        </p>
      </section>

      <hr className="divider mx-6 md:mx-auto md:max-w-3xl" />

      {/* Projects */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <h2
          className="text-xs tracking-widest uppercase mb-8"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--pink)" }}
        >
          Projects
        </h2>
        <TrackedLink
          href="https://pokememory.com"
          event="pokememory_click"
          className="project-card block p-8 rounded-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
            >
              Poké Memory
            </h3>
            <span
              className="text-xs tracking-widest px-3 py-1 rounded-full border"
              style={{
                fontFamily: "var(--font-orbitron)",
                color: "var(--cyan)",
                borderColor: "var(--cyan)",
              }}
            >
              Live
            </span>
          </div>
          <p style={{ color: "var(--text-muted)" }} className="leading-relaxed">
            A spaced repetition app for Pokémon fans. Learn and remember Pokémon
            details using science-backed memory techniques.
          </p>
        </TrackedLink>
      </section>

      {kofiUrl && (
        <>
          <hr className="divider mx-6 md:mx-auto md:max-w-3xl" />

          {/* Support */}
          <section className="max-w-3xl mx-auto px-6 py-24">
            <h2
              className="text-xs tracking-widest uppercase mb-8"
              style={{ fontFamily: "var(--font-orbitron)", color: "var(--pink)" }}
            >
              Support
            </h2>
            <p
              className="text-lg md:text-xl leading-relaxed mb-8"
              style={{ color: "var(--text-muted)" }}
            >
              Frazzled Productions is independent and self-funded. If something we
              have made brightened your day, you can chip in to help cover running
              costs and keep us building. Entirely optional, with no perks or strings.
            </p>
            <SupportButton kofiUrl={kofiUrl} />
          </section>
        </>
      )}

      <hr className="divider mx-6 md:mx-auto md:max-w-3xl" />

      {/* Contact */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <h2
          className="text-xs tracking-widest uppercase mb-8"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--pink)" }}
        >
          Contact
        </h2>
        <a
          href="mailto:hello@frazzledproductions.com"
          className="gradient-text text-xl md:text-2xl font-medium transition-opacity hover:opacity-80"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          hello@frazzledproductions.com
        </a>
      </section>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-6 py-12 border-t border-[#7b2fff]/20">
        <p
          className="text-xs leading-relaxed"
          style={{ color: "rgba(123, 47, 255, 0.5)" }}
        >
          FRAZZLED PRODUCTIONS LTD &nbsp;|&nbsp; Company No. 17258540 &nbsp;|&nbsp; 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ
        </p>
      </footer>

    </main>
  );
}
