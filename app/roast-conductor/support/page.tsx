import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Roast Conductor support | Frazzled Productions",
  description:
    "Help with Roast Conductor: alarms on silent and in Focus, reminders, the Apple Watch and iPad, the US edition, restoring your purchase, what is free and what the unlock adds, and how timings are worked out.",
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
        Roast Conductor plans a Sunday roast, Christmas dinner or Thanksgiving
        backwards from the time you want to eat. It warns you when two dishes need different oven
        temperatures at the same time and suggests a fix, then runs cook mode: an
        alarm for every step and a Live Activity on your Lock Screen.
      </p>
      <p>
        Cannot find your answer below? Email{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Telling us your iPhone
        or iPad model and iOS version helps us help you.
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
        <li>preheating, your oven type, hob rings, and editing any step&apos;s time and temperature</li>
        <li>unlimited saved menus, each with up to four dishes</li>
        <li>widgets, Siri and Shortcuts, and the iPad layout</li>
        <li>the built-in starters and puddings, each planned to be ready when it is served</li>
        <li>tips, the Day before list, fridge and leftovers reminders</li>
        <li>sharing the plan as a picture, PDF or text</li>
        <li>the Christmas and Easter themes</li>
      </ul>
      <p>
        The one-time unlock (£2.99 in the UK) is for bigger and more personal meals:
      </p>
      <ul>
        <li>more than four dishes in a menu, for a full Christmas dinner or Thanksgiving</li>
        <li>building dishes from recipe links or a pasted method</li>
        <li>your own custom dishes</li>
        <li>up to three ovens, each with its own name</li>
        <li>the air fryer and microwave, planned alongside the oven</li>
        <li>reverse sear and slow roast methods</li>
        <li>make-ahead sides, started the day before</li>
        <li>choosing when each course is served, moving any dish to the starter or pudding, and sharing jobs out among your helpers</li>
        <li>cooking for any number of guests, and a shopping list</li>
        <li>the Apple Watch app</li>
      </ul>
      <p>
        It is a single purchase, not a subscription. Paid features we add later join
        the same unlock, so you never pay twice.
      </p>

      <h3>Where do the cooking times come from?</h3>
      <p>
        Every built-in timing comes from published UK guidance: food hygiene advice
        from the Food Standards Agency, and well-established UK cookery references for
        times and temperatures. In the US edition, turkey and ham timings follow USDA
        guidance. Joint times are worked out from the weight you enter.
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

      <h3>My oven runs hot or cool. Can I allow for that?</h3>
      <p>
        Yes. From the <strong>More</strong> button on the home screen, open{" "}
        <strong>Your kitchen</strong> and tell it how far out your oven runs. The plan
        still shows the temperature the food needs, and also where to set your dial
        to get it. An oven thermometer is the easiest way to find out.
      </p>

      <h3>Why do air fryer and microwave timings vary?</h3>
      <p>
        Air fryers and microwaves differ a lot between models: size, power and how
        full the basket is all change how long food takes. Roast Conductor&apos;s times
        are a starting point, so check the food as it cooks and adjust a step&apos;s
        time once you know your appliance. Set your air fryer&apos;s size and whether
        you have a microwave in <strong>Your kitchen</strong> (part of the unlock).
      </p>

      <h3>Can I try recipe links?</h3>
      <p>
        Yes. Try recipe links with our{" "}
        <Link href="/roast-conductor/sample-recipe">sample recipe</Link> for crisp
        roast potatoes. Copy the page&apos;s address, then in the menu editor add a
        dish and choose <strong>From a recipe link</strong>. Roast Conductor reads the
        method and shows each step with its time and temperature for you to check
        before it joins your plan. Building dishes from recipe links is part of the
        one-time unlock.
      </p>

      <h3>Dinner is running late. What do I do?</h3>
      <p>
        In cook mode, tap <strong>Running late</strong>. Every step that has not
        started moves back, and resting time absorbs small delays first so the meat
        is not left waiting.
      </p>

      <h3>What does &ldquo;Not done yet&rdquo; do?</h3>
      <p>
        When cook mode reaches a check step, such as checking the joint is cooked
        through, tap <strong>Not done yet</strong> if it needs longer. Choose a few
        more minutes and you will see what changes before you confirm: the steps
        still to come move with it, and so does your dinner time if it has to. Check
        again when the extra time is up.
      </p>

      <h3>What are make-ahead dishes and the Day before list?</h3>
      <p>
        With the unlock, sides such as roast potatoes, Yorkshires and gravy can be
        made ahead: most of the work happens the day before, so there is less to do
        on the day. The <strong>Day before</strong> list, open from the menu editor and
        the plan, gathers everything a menu needs doing before the day itself, such
        as make-ahead jobs and moving a frozen turkey to the fridge to defrost. The
        list itself is free.
      </p>

      <h3>How do courses and helpers work?</h3>
      <p>
        Starters and puddings are free. Add one from the Starters or Puddings section
        when you add a dish, and each course is planned to be ready when it is served.
        The unlock lets you choose when each course is served, move any dish to the
        starter or pudding, and add your helpers to a menu and share the jobs out
        among them, so each person has their own list. Sharing the plan as a picture,
        PDF or text is free for everyone.
      </p>

      <h3>What reminders does the app send, and how do I turn them off?</h3>
      <p>
        Besides the alarms in cook mode, Roast Conductor can send a few reminders as
        ordinary notifications:
      </p>
      <ul>
        <li>
          fridge reminders, when a long fridge step is coming up, such as moving a
          frozen turkey to the fridge to defrost days ahead
        </li>
        <li>a reminder for the day-before jobs on a menu&apos;s Day before list</li>
        <li>
          a leftovers reminder after dinner, saying when to get the leftovers into
          the fridge
        </li>
      </ul>
      <p>
        They are scheduled on your iPhone or iPad, not sent from a server, and only
        if you allow notifications. To stop the leftovers reminder, turn off{" "}
        <strong>Leftovers reminder</strong> in <strong>Your kitchen</strong>. To stop
        all of them, open the Settings app, tap <strong>Notifications</strong>, then
        Roast Conductor, and turn notifications off. Cook mode alarms are separate and
        keep working.
      </p>

      <h3>Does Roast Conductor need an account or collect my data?</h3>
      <p>
        No account is needed. Your menus and plans stay on your iPhone or iPad (and
        your Apple Watch, if you use it). Apart from fetching a recipe page when you
        paste its link, the only data that leaves your devices is about your
        purchase, so it can be restored.
        The <Link href="/roast-conductor/privacy">privacy policy</Link> has the details.
      </p>

      <h3>Which devices does it work on?</h3>
      <p>
        iPhone and iPad with iOS or iPadOS 26.1 or later. The Live Activity appears on
        the iPhone Lock Screen and, on iPhones that have it, in the Dynamic Island.
        The Apple Watch app needs watchOS 26 and a paired iPhone.
      </p>

      <h3>How does the Apple Watch app work?</h3>
      <p>
        The Apple Watch app is part of the one-time unlock. It works alongside your
        iPhone, which does the planning: while you cook, the watch shows the step
        under way with a countdown and what comes next, and you can tap{" "}
        <strong>Done</strong> on your wrist to mark a step done on your iPhone too.
        When nothing is cooking, it shows when to start your next dinner. The step
        alarms are your iPhone&apos;s, which Apple Watch shows when they ring. Keep your
        iPhone nearby so the two stay in step.
      </p>

      <h3>Does it work on iPad?</h3>
      <p>
        Yes. On iPad the plan and cook mode spread across the bigger screen, and the
        step alarms ring just as they do on iPhone. iPad does not show Live
        Activities, so there is no Lock Screen view of what is next; keep the app
        open on the cook screen, or check the alarms as they ring. Your purchase works
        on both if you use the same Apple Account (tap{" "}
        <strong>Restore purchases</strong> on the second device), but menus are not
        synced between devices.
      </p>

      <h3>Why does the app use °F and pounds (or °C and kilograms)?</h3>
      <p>
        Roast Conductor follows your device&apos;s region. With the region set to the
        United States you get the US edition: °F, weights in pounds, US cuts and
        names, conventional oven by default and a Thanksgiving menu. Everywhere else
        you get the UK edition, in °C and kilograms. You can switch between °C and °F
        and change your oven type from the <strong>More</strong> button on the home
        screen. Weights follow the region, which you can change in the Settings app
        under <strong>General</strong>, then <strong>Language &amp; Region</strong>.
      </p>

      <h3>My menus have disappeared. What do I do?</h3>
      <p>
        Your menus are saved only on the iPhone or iPad you made them on, and are not
        synced between devices. On a new device they come across only if you set it
        up from an iCloud or computer backup of the old one. If menus have gone from
        the same device, make sure Roast Conductor is up to date in the App Store,
        then email us before deleting the app, as deleting it removes your menus for
        good.
      </p>

      <h2>Contact</h2>
      <p>
        Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Roast Conductor
        is made by Frazzled Productions Ltd, an independent software studio in London.
      </p>
    </article>
  );
}
