import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy | Frazzled Productions",
  description:
    "How the Frazzled Productions website handles your data: hosting and Cloudflare Web Analytics, daily click totals for two links, and the optional Ko-fi support panel.",
};

const contactEmail = "hello@frazzledproductions.com";

// The privacy notice for this website only. Each app has its own policy
// (/roast-conductor/privacy, /loop-year/privacy, pokememory.com, koinori.com).
// If the site starts sending anything new to a third party, update this page in
// the same PR.
export default function PrivacyPage() {
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
      </header>

      <hr className="divider mx-6 md:mx-auto md:max-w-3xl" />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <article className="rc-prose">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
          >
            Website privacy notice
          </h1>
          {/* The cutover PR replaces this placeholder with the cutover date (task 5.1). */}
          <p>Effective [cutover date, set by the cutover PR]</p>

          <p className="text-lg">
            <strong>In short:</strong> this website has no accounts, no sign-up
            forms, no adverts and no cookies. We count page visits with
            Cloudflare Web Analytics, which does not collect personal data, and
            keep a daily total of clicks on two links. If you choose to support
            us through Ko-fi, Ko-fi handles that, not us.
          </p>

          <h2>Who we are</h2>
          <p>
            This website is run by Frazzled Productions Ltd, a company registered
            in England and Wales (company number 17258540), registered office
            71-75 Shelton Street, Covent Garden, London, WC2H 9JQ. We are the data
            controller for this website. Contact us about anything in this notice
            at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
          </p>
          <p>
            This notice covers frazzledproductions.com only. Our apps have their
            own privacy policies, linked from each app&apos;s page.
          </p>

          <h2>Hosting and visit statistics</h2>
          <p>
            The site is hosted by{" "}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare, Inc.
            </a>{" "}
            Like any web host, Cloudflare processes your IP address briefly to
            deliver pages to you and to protect the site from abuse, using its
            network of data centres around the world.
          </p>
          <p>
            We use{" "}
            <a
              href="https://www.cloudflare.com/web-analytics/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare Web Analytics
            </a>{" "}
            to see how many people visit and which pages they read. Cloudflare
            says it does not collect or use visitors&apos; personal data and does
            not log the part of an address after a question mark. Cloudflare
            keeps the full measurements for 7 days and a sample after that. We
            only ever see totals.
          </p>

          <h2>Link clicks</h2>
          <p>
            When you click the link to Poké Memory or the &quot;Support the
            studio&quot; button, the site adds one to that day&apos;s total for
            that link. The total is kept by us in a Cloudflare database stored in
            the European Union. It holds the date, the link&apos;s name and the
            number, nothing else: no IP address, no device details, no page
            address and no time of day. We keep the totals for as long as they
            help us see how the site is used. It counts clicks, not visitors.
          </p>

          <h2>Supporting us on Ko-fi</h2>
          <p>
            If the site shows a &quot;Support the studio&quot; button and you
            click it, a panel from{" "}
            <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer">
              Ko-fi
            </a>{" "}
            (Ko-fi Labs Limited) opens on the page. Nothing loads from Ko-fi
            until you click. Anything you enter there, such as your name, email,
            message or payment, goes to Ko-fi and its payment providers, not to
            this website. Ko-fi handles it under its{" "}
            <a
              href="https://more.ko-fi.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              privacy policy
            </a>
            , and Ko-fi may set its own cookies inside that panel. If you
            support us, our Ko-fi account shows us what Ko-fi passes on, such as
            your name and any message you leave, and we use it only to thank you
            and to keep the financial records the law requires.
          </p>

          <h2>Our legal basis</h2>
          <p>
            Visit statistics and link counts rely on our legitimate interest in
            understanding, in aggregate, how the site is used. Handling a
            donation relies on doing what you asked us to do and on our legal
            duty to keep financial records.
          </p>

          <h2>Emailing us</h2>
          <p>
            If you email us, we use your message and address to reply, and keep
            them only as long as the conversation needs. Our email is provided by
            Google Workspace.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask for a copy of personal data we hold about you, or ask us
            to correct or delete it, or to stop using it. Email{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a> and we will
            respond within one month. You can also complain to the UK Information
            Commissioner&apos;s Office at{" "}
            <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
              ico.org.uk
            </a>
            .
          </p>

          <h2>Changes to this notice</h2>
          <p>
            If the website starts handling data differently, we will update this
            page and its effective date at the same time.
          </p>
        </article>
      </main>

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
