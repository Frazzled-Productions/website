import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Roast Conductor | Frazzled Productions",
  description:
    "Plan a Sunday roast or Christmas dinner backwards from the time you want to eat, with one-oven clash warnings and alarms that ring through silent mode.",
};

const features = [
  {
    title: "Planned backwards from serving time",
    body: "Pick your dishes and the time you want to eat. Roast Conductor works out when each step starts, from the joint going in to the gravy, including jobs the day before.",
  },
  {
    title: "One oven, no clashes",
    body: "It spots when two dishes need different oven temperatures at once and suggests a fix, such as cooking the Yorkshire puddings while the meat rests.",
  },
  {
    title: "Alarms that ring on silent",
    body: "Cook mode turns every step into a system alarm, with a Live Activity on the Lock Screen showing what is happening now and what is next.",
  },
  {
    title: "Running late? One tap",
    body: "Shift every step that has not started yet. Resting time soaks up small delays first.",
  },
];

export default function RoastConductorPage() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1
          className="text-4xl md:text-5xl font-bold"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
        >
          Roast Conductor
        </h1>
        <span
          className="text-xs tracking-widest px-3 py-1 rounded-full border"
          style={{
            fontFamily: "var(--font-orbitron)",
            color: "var(--cyan)",
            borderColor: "var(--cyan)",
          }}
        >
          Coming soon
        </span>
      </div>
      <p
        className="text-lg md:text-xl leading-relaxed mb-12"
        style={{ color: "var(--text-muted)" }}
      >
        Everything hot on the table at the same time, with one oven. An iPhone app
        that plans your Sunday roast or Christmas dinner backwards from the time you
        want to eat, then calls out each step as you cook.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 mb-16">
        {features.map((feature) => (
          <div key={feature.title} className="project-card p-6 rounded-lg">
            <h2
              className="text-lg font-bold mb-2"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
            >
              {feature.title}
            </h2>
            <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {feature.body}
            </p>
          </div>
        ))}
      </div>

      <div className="rc-prose">
        <h2>Free, with a one-time unlock</h2>
        <p>
          The planner, the alarms, the Live Activity and every built-in dish and cut
          are free, for menus of up to four dishes. A single £2.99 purchase removes
          the limit for big meals like a full Christmas dinner and adds your own
          dishes. No subscription, no account and no adverts.
        </p>
        <p>
          Roast Conductor needs an iPhone with iOS 26.1 or later. Questions? See{" "}
          <Link href="/roast-conductor/support">support</Link>. How the app treats
          your data is in the <Link href="/roast-conductor/privacy">privacy policy</Link>.
        </p>
      </div>
    </>
  );
}
