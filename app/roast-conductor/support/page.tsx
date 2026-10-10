import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Roast Conductor support | Frazzled Productions",
  description:
    "Help with Roast Conductor: alarms on silent and in Focus, restoring your purchase, what is free and what the unlock adds, and how timings are worked out.",
};

const contactEmail = "hello@frazzledproductions.com";

export default function RoastConductorSupportPage() {
  return (
    <article className="rc-prose">
      <h1
        className="text-4xl md:text-5xl font-bold mb-6"
        style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
      >
        Roast Conductor support
      </h1>
      <p className="text-lg">
        Roast Conductor plans a Sunday roast or Christmas dinner backwards from the
        time you want to eat. It warns you when two dishes need different oven
        temperatures at the same time and suggests a fix, then runs cook mode: an
        alarm for every step and a Live Activity on your Lock Screen.
      </p>
      <p>
        Cannot find your answer below? Email{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Telling us your iPhone
        model and iOS version helps us help you.
      </p>

      <h2>Frequently asked questions</h2>

      <h3>Will the alarms ring when my phone is on silent or in a Focus?</h3>
      <p>
        Yes, if you allow alarms. When you first start cooking, Roast Conductor asks
        to schedule alarms. These are system alarms, like the ones in the Clock app,
        so they sound through silent mode and Focus. If you said no, open the
        Settings app, find Roast Conductor and turn alarms on.
      </p>
      <p>
        Without alarm permission the app falls back to notifications instead. Those
        follow your silent switch and Focus settings, so you might not hear them. Keep
        your iPhone charged and nearby while you cook.
      </p>

      <h3>How do I restore my purchase on a new iPhone?</h3>
      <p>
        On the home screen, tap the <strong>More</strong> button (the circle with
        three dots, top right), then <strong>Restore purchases</strong>. Use the same
        Apple Account you bought the unlock with. Family Sharing is supported, so
        members of your family group get the unlock too.
      </p>

      <h3>What is free, and what does the unlock add?</h3>
      <p>
        Free covers a complete Sunday roast from start to finish:
      </p>
      <ul>
        <li>the planner, oven clash warnings and suggested fixes, and running late</li>
        <li>cook mode alarms and the Live Activity</li>
        <li>every built-in dish and cut of meat, with its doneness checks</li>
        <li>preheating, your oven type, and editing any step&apos;s time and temperature</li>
        <li>unlimited saved menus, each with up to four dishes</li>
        <li>seasonal themes</li>
      </ul>
      <p>
        The one-time unlock (£2.99 in the UK) is for bigger and more personal meals:
      </p>
      <ul>
        <li>more than four dishes in a menu, for a full Christmas dinner</li>
        <li>your own custom dishes</li>
        <li>building dishes from recipe links</li>
        <li>more than one oven, and limits on hob rings</li>
        <li>reverse sear and slow roast methods</li>
      </ul>
      <p>
        It is a single purchase, not a subscription. Paid features we add later join
        the same unlock, so you never pay twice.
      </p>

      <h3>Where do the cooking times come from?</h3>
      <p>
        Every built-in timing comes from published UK guidance: food hygiene advice
        from the Food Standards Agency, and well-established UK cookery references for
        times and temperatures. Joint times are worked out from the weight you enter.
      </p>
      <p>
        <strong>The times are a guide, not a promise.</strong> Ovens, joints and
        tins all vary. Always check food is cooked before serving: poultry, pork
        and rolled joints should be steaming hot all the way through,
        with no pink meat and with clear juices. A meat thermometer in the thickest
        part is the most reliable check. Roast Conductor adds a check step to every
        meat dish as a reminder.
      </p>

      <h3>Can I change a time or temperature?</h3>
      <p>
        Yes. In the menu editor, open a dish to change any step&apos;s time or
        temperature. From the <strong>More</strong> button on the home screen you can
        also set your oven type (fan, conventional or gas), choose °C or °F, and set
        how long your oven takes to preheat.
      </p>

      <h3>Dinner is running late. What do I do?</h3>
      <p>
        In cook mode, tap <strong>Running late</strong>. Every step that has not
        started moves back, and resting time absorbs small delays first so the meat
        is not left waiting.
      </p>

      <h3>Does Roast Conductor need an account or collect my data?</h3>
      <p>
        No account is needed. Your menus and plans stay on your iPhone. The only data
        that leaves the device is the record of your purchase, so it can be restored.
        The <Link href="/roast-conductor/privacy">privacy policy</Link> has the details.
      </p>

      <h3>Which devices does it work on?</h3>
      <p>
        iPhone with iOS 26.1 or later. The Live Activity appears on the Lock Screen
        and, on iPhones that have it, in the Dynamic Island.
      </p>

      <h2>Contact</h2>
      <p>
        Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Roast Conductor
        is made by Frazzled Productions Ltd, an independent software studio in London.
      </p>
    </article>
  );
}
