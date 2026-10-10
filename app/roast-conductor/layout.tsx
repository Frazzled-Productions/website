import Link from "next/link";

// Shared frame for the Roast Conductor pages (product, support, privacy). App Store
// Connect links to the support and privacy pages directly, so each one needs a way
// back to the others and to the studio home page.
export default function RoastConductorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ fontFamily: "var(--font-inter)" }}>
      <header className="max-w-3xl mx-auto px-6 pt-10 pb-4">
        <Link
          href="/"
          className="text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--pink)" }}
        >
          Frazzled Productions
        </Link>
        <nav
          aria-label="Roast Conductor"
          className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <Link href="/roast-conductor" className="rc-nav-link">Roast Conductor</Link>
          <Link href="/roast-conductor/support" className="rc-nav-link">Support</Link>
          <Link href="/roast-conductor/privacy" className="rc-nav-link">Privacy policy</Link>
        </nav>
      </header>

      <hr className="divider mx-6 md:mx-auto md:max-w-3xl" />

      <main className="max-w-3xl mx-auto px-6 py-16">{children}</main>

      <footer className="max-w-3xl mx-auto px-6 py-12 border-t border-[#7b2fff]/20">
        <p
          className="text-xs leading-relaxed"
          style={{ color: "rgba(123, 47, 255, 0.5)" }}
        >
          FRAZZLED PRODUCTIONS LTD &nbsp;|&nbsp; Company No. 17258540 &nbsp;|&nbsp; 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ
        </p>
      </footer>
    </div>
  );
}
