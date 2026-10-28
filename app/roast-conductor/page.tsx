import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Roast Conductor | Frazzled Productions",
  description:
    "Plan a Sunday roast, Christmas dinner or Thanksgiving backwards from the time you want to eat, with one-oven clash fixes, alarms that ring through silent mode, widgets, Siri and an Apple Watch app.",
};

const features = [
  {
    title: "Planned backwards from serving time",
    body: "Pick your dishes, enter the weight of the joint and set the time you want to eat. Roast Conductor works out when every step starts, from preheating the oven to dishing up, including jobs the day before and defrosting a frozen turkey.",
  },
  {
    title: "One oven, no clashes",
    body: "When two dishes need different oven temperatures at once, it warns you and suggests a fix, such as cooking the Yorkshire puddings while the meat rests. If your oven runs hot or cool, tell it once and it shows where to set the dial.",
  },
  {
    title: "Alarms that ring on silent",
    body: "Cook mode turns every step into an alarm that sounds through silent mode and Focus, with a Live Activity on the Lock Screen and in the Dynamic Island showing what to do now and what comes next.",
  },
  {
    title: "Running late? Not done yet?",
    body: "One tap moves every step that has not started. If the joint is not done at its check, give it a few more minutes and the plan moves with it.",
  },
  {
    title: "Christmas, Easter and Thanksgiving",
    body: "Christmas and Easter themes for your menus and the Live Activity, a Christmas app icon, and ready-made Christmas dinner, Easter lunch and Burns Night supper menus. In the US, a Thanksgiving menu with °F, pounds and US cuts.",
  },
  {
    title: "A hand in the kitchen",
    body: "Short tips on the steps that matter, a Day before list with a reminder, fridge reminders for defrosting days ahead, and a reminder after dinner to put the leftovers away.",
  },
  {
    title: "Share the plan",
    body: "Send the timings as a picture, a printable PDF or plain text, so everyone helping knows what happens when.",
  },
  {
    title: "Widgets, Siri, iPad and Apple Watch",
    body: "Home Screen and Lock Screen widgets show your next dinner. Ask Siri what is next. On iPad, the plan and cook mode spread across the bigger screen, and the Apple Watch app shows the step under way.",
  },
];

const free = [
  "Menus of up to four dishes, as many as you like",
  "The planner, oven clash fixes and running late",
  "Cook mode alarms and the Live Activity",
  "Widgets, Siri and Shortcuts, and the iPad layout",
  "Starters and puddings, each served on time",
  "Tips, the Day before list and reminders",
  "Sharing the plan as a picture, PDF or text",
  "The Christmas and Easter themes",
];

const unlock = [
  "Unlimited dishes, for a full Christmas dinner or Thanksgiving",
  "Recipes from links: paste a link or the method, read on your device, then you check every step",
  "Your own custom dishes",
  "Up to three ovens, each with its own name",
  "The air fryer and microwave, planned alongside the oven",
  "Reverse sear and slow roast",
  "Make-ahead sides, started the day before",
  "Choosing when each course is served, moving any dish to the starter or pudding, and sharing jobs out among your helpers",
  "Cooking for any number of guests, and a shopping list from your recipes",
  "The Apple Watch app: the step under way, a countdown and Done from your wrist",
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
        <a
          href="https://apps.apple.com/app/id6821368790"
          className="text-xs tracking-widest px-3 py-1 rounded-full border"
          style={{
            fontFamily: "var(--font-orbitron)",
            color: "var(--cyan)",
            borderColor: "var(--cyan)",
          }}
        >
          On the App Store
        </a>
      </div>
      <p
        className="text-lg md:text-xl leading-relaxed mb-12"
        style={{ color: "var(--text-muted)" }}
      >
        Everything hot on the table at the same time, with one oven. An iPhone and
        iPad app that plans your Sunday roast, Christmas dinner or Thanksgiving
        backwards from the time you want to eat, then calls out each step as you cook.
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
        <p>Free, with every built-in dish and cut of meat:</p>
        <ul>
          {free.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>A single £2.99 purchase adds:</p>
        <ul>
          {unlock.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>No subscription, no account and no adverts.</p>
        <p>
          Timings come from published UK guidance (USDA guidance in the US edition)
          and are a guide: every meat dish ends with a reminder to check it is cooked
          through.
        </p>
        <p>
          Roast Conductor needs an iPhone or iPad with iOS or iPadOS 26.1 or later;
          the Apple Watch app works alongside your iPhone. Questions? See{" "}
          <Link href="/roast-conductor/support">support</Link>. How the app treats
          your data is in the <Link href="/roast-conductor/privacy">privacy policy</Link>.
        </p>
      </div>
    </>
  );
}
