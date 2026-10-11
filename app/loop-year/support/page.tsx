import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Loop Year support | Frazzled Productions",
  description:
    "Help with Loop Year: where the weather comes from, days with no record, restoring your purchase, the daily reminder and where your blankets are kept.",
};

const contactEmail = "hello@frazzledproductions.com";

export default function LoopYearSupportPage() {
  return (
    <article className="rc-prose">
      <h1
        className="text-4xl md:text-5xl font-bold mb-6"
        style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
      >
        Loop Year support
      </h1>
      <p className="text-lg">
        Loop Year is a daily companion for crochet and knitted temperature
        blankets: it looks up each day&apos;s weather where you live and tells you
        which colour tonight&apos;s row should be.
      </p>
      <p>
        Cannot find your answer below? Email{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Telling us your iPhone
        model and iOS version helps us help you.
      </p>

      <h2>Frequently asked questions</h2>

      <h3>Where does the weather come from?</h3>
      <p>
        From Apple Weather, for the place you chose when you set up your blanket.
        Apple Weather&apos;s records start in August 2021, so for days before
        that (a birth-year blanket, for example) Loop Year uses records from
        Meteostat, an open archive of weather station data, taken from a station
        near your place.
      </p>

      <h3>Why does a day say &ldquo;No record for this day&rdquo;?</h3>
      <p>
        The weather records had nothing for that day, or Loop Year has not been
        able to fetch it yet (for example, while your iPhone was offline). Gaps
        are most common in older years, when a weather station may have missed
        some days. Loop Year never makes up a temperature: it shows the gap and
        asks for the weather again each time it opens.
      </p>
      <p>
        You can colour the row by hand instead. On <strong>Tonight</strong>, tap
        the row and pick the colour you used. On <strong>Blanket</strong>, touch
        the day, then tap <strong>Pick a colour</strong>. You can also change a
        colour the weather chose, if you used a different yarn.
      </p>

      <h3>How do I restore my purchase on a new iPhone?</h3>
      <p>
        On <strong>Tonight</strong>, tap the gear to open{" "}
        <strong>Blanket settings</strong>, then tap{" "}
        <strong>Restore purchases</strong>. Use the same Apple Account you bought
        the unlock with. The unlock is a single purchase, not a subscription.
      </p>

      <h3>Can Loop Year remind me to do tonight&apos;s row?</h3>
      <p>
        Yes. Open <strong>Blanket settings</strong> (the gear on{" "}
        <strong>Tonight</strong>), turn on the daily reminder and choose a time.
        Loop Year asks for permission to send notifications only at that point.
        If you said no, open the Settings app, find Loop Year and allow
        notifications.
      </p>

      <h3>Do I need an account? Where are my blankets kept?</h3>
      <p>
        No account is needed. Your blankets, colours and settings stay on your
        iPhone and are never sent to us. Deleting the app deletes them. The{" "}
        <Link href="/loop-year/privacy">privacy policy</Link> has the details.
      </p>

      <h3>Which devices does it work on?</h3>
      <p>iPhone with iOS 26 or later.</p>

      <h2>Contact</h2>
      <p>
        Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Loop Year is
        made by Frazzled Productions Ltd, an independent software studio in London.
      </p>
    </article>
  );
}
