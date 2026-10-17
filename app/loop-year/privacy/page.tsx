import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loop Year privacy policy | Frazzled Productions",
  description:
    "How the Loop Year iPhone app handles your data: no account, no tracking, blankets stay on your iPhone, weather comes from Apple Weather and Meteostat, and RevenueCat manages the one-time unlock.",
};

const contactEmail = "hello@frazzledproductions.com";
const privacyEmail = "privacy@frazzledproductions.com";

export default function LoopYearPrivacyPage() {
  return (
    <article className="rc-prose">
      <h1
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
      >
        Loop Year privacy policy
      </h1>
      <p>Effective 17 October 2026</p>

      <p className="text-lg">
        <strong>In short:</strong> Loop Year has no accounts, no adverts, no
        analytics tools and no tracking. Your blankets stay on your iPhone. To
        look up the weather, the app sends the place you chose to Apple Weather
        (and, for days before August 2021, a weather station number and a year
        to Meteostat). The record of your one-time purchase is processed by our
        payment partner RevenueCat under an anonymous ID, so the unlock works and
        can be restored. We never see your location, and the app never asks for
        it.
      </p>

      <h2>Who we are</h2>
      <p>
        Loop Year is made by Frazzled Productions Ltd, a company registered in
        England and Wales (company number 17258540), registered office 71-75
        Shelton Street, Covent Garden, London, WC2H 9JQ. We are the data
        controller for the app. Contact us about anything in this policy at{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>

      <h2>What stays on your iPhone</h2>
      <p>
        Everything you make in the app is stored only on your iPhone and is never
        sent to us:
      </p>
      <ul>
        <li>
          your blankets: the place and its map position, the start date, your
          colours and temperature bands, the colour of each day&apos;s row, the
          rows you have ticked off and any colours you set by hand
        </li>
        <li>the measurements you enter in the yarn and length planner</li>
        <li>
          your settings, such as the temperature unit and the evening reminder
          time
        </li>
        <li>
          older weather records downloaded from Meteostat, kept in the app&apos;s
          cache so they are not downloaded again
        </li>
      </ul>
      <p>
        We do not run any servers for the app and you do not create an account.
        Deleting the app deletes this data. If you back up your iPhone to iCloud
        or a computer, Apple includes app data in that backup under Apple&apos;s
        own terms.
      </p>

      <h2>Finding your place</h2>
      <p>
        You choose a town by typing its name. The search uses Apple Maps, so
        what you type is sent to Apple to suggest matching places and to find
        the chosen place&apos;s map position and time zone. Apple handles this
        under the{" "}
        <a
          href="https://www.apple.com/legal/privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apple Privacy Policy
        </a>
        . The app does not use your iPhone&apos;s location and never asks for
        permission to.
      </p>

      <h2>Looking up the weather</h2>
      <p>
        Each row&apos;s colour comes from that day&apos;s temperature at the place
        you chose. To get it:
      </p>
      <ul>
        <li>
          <strong>Apple Weather (WeatherKit).</strong> For days from 1 August
          2021 onwards, your iPhone sends Apple the map position of the place
          you chose (not your own location) and the dates needed, and Apple
          returns the temperatures. This request goes from your iPhone to Apple;
          it does not pass through us. Apple handles it under the Apple Privacy
          Policy.
        </li>
        <li>
          <strong>Meteostat.</strong> For blankets with days before 1 August
          2021, such as a birth-year blanket, the app picks the nearest weather
          stations on your iPhone, from a list built into the app. It then
          downloads that station&apos;s records for the year from
          data.meteostat.net. The request contains only the station&apos;s
          number and the year, never your place or its map position. Like any
          web request, it also carries your device&apos;s IP address, which
          Meteostat logs in anonymised form under its{" "}
          <a
            href="https://meteostat.net/en/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            privacy policy
          </a>
          .
        </li>
      </ul>
      <p>
        For days from Apple Weather, the app keeps each day&apos;s colour, not
        the temperature. Nothing about your blanket is sent to us.
      </p>

      <h2>The evening reminder</h2>
      <p>
        The reminder is off until you turn it on, and the app asks for
        permission to send notifications only at that point. Reminders are
        scheduled by iOS on your iPhone; no notification server is involved and
        nothing is sent to us.
      </p>

      <h2>Your purchase (RevenueCat)</h2>
      <p>
        Loop Year offers a one-time unlock bought through the App Store. Apple
        handles the payment; we never see your name, Apple Account or card
        details.
      </p>
      <p>
        To confirm the unlock and let you restore it, the app uses{" "}
        <a href="https://www.revenuecat.com" target="_blank" rel="noopener noreferrer">
          RevenueCat
        </a>{" "}
        (RevenueCat, Inc.), which processes the data on our behalf. RevenueCat
        receives:
      </p>
      <ul>
        <li>
          an anonymous app user ID created by the app (it is not your name,
          email or Apple Account)
        </li>
        <li>
          your purchase history for this app: what was bought, when, the price
          and currency, and the App Store transaction record
        </li>
        <li>
          technical details needed to deliver the service, such as the app
          version, iOS version, device model, country and IP address
        </li>
      </ul>
      <p>
        We use this to provide the unlock (to make the app work) and to see how
        many unlocks are sold (analytics). It is not linked to your identity, is
        not used for advertising and is not used to track you across other apps
        or websites. Read{" "}
        <a
          href="https://www.revenuecat.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          RevenueCat&apos;s privacy policy
        </a>{" "}
        for how RevenueCat handles data. RevenueCat is based in the United
        States, so this data may be processed there, under the safeguards
        described in its policy.
      </p>
      <p>
        Our legal bases under UK and EU data protection law are performing our
        contract with you (providing the unlock you bought) and our legitimate
        interest in understanding sales of the app. We keep purchase records for
        as long as they are needed to let you restore your purchase and to meet
        our accounting obligations.
      </p>

      <h2>What we do not do</h2>
      <ul>
        <li>No accounts or sign-in.</li>
        <li>No analytics or advertising tools in the app, and no tracking.</li>
        <li>No selling or sharing of your data.</li>
        <li>
          No access to your location, contacts, photos, camera or microphone.
        </li>
      </ul>
      <p>
        If you have chosen in iOS Settings to share analytics with app
        developers, Apple may send us anonymous crash reports and usage
        statistics. That is controlled by Apple and you can turn it off in
        Settings, under Privacy and Security, then Analytics and Improvements.
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right to ask for a copy of personal data we hold about you,
        to have it corrected or deleted, and to object to how it is used.
        Because the purchase record is anonymous, we may need your help to find
        it (for example, the date you bought the unlock). Email{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a> and we will respond
        within one month. If you are unhappy with how we use your data, email{" "}
        <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>. We will
        acknowledge your complaint within 30 days and try to resolve it. You can
        also complain to the UK Information Commissioner&apos;s Office at{" "}
        <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
          ico.org.uk
        </a>
        .
      </p>

      <h2>Children</h2>
      <p>
        Loop Year is a general crafting app and does not knowingly collect
        personal data from anyone, including children.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If the app starts handling data differently, we will update this page
        and its effective date before the change reaches the App Store.
      </p>

      <h2>This website</h2>
      <p>
        This policy covers the Loop Year app. The Frazzled Productions website
        counts page visits with Vercel Web Analytics, which does not use
        cookies.
      </p>
    </article>
  );
}
