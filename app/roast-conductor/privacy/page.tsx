import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roast Conductor privacy policy | Frazzled Productions",
  description:
    "How the Roast Conductor iPhone app handles your data: no account, no tracking, menus stay on your iPhone, and RevenueCat manages the one-time unlock.",
};

const contactEmail = "hello@frazzledproductions.com";

export default function RoastConductorPrivacyPage() {
  return (
    <article className="rc-prose">
      <h1
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
      >
        Roast Conductor privacy policy
      </h1>
      <p>Effective 10 October 2026</p>

      <p className="text-lg">
        <strong>In short:</strong> Roast Conductor has no accounts, no adverts, no
        analytics tools and no tracking. Your menus and plans stay on your iPhone.
        The only data that leaves your device is the record of your one-time
        purchase, which our payment partner RevenueCat processes under an anonymous
        ID so the unlock works and can be restored.
      </p>

      <h2>Who we are</h2>
      <p>
        Roast Conductor is made by Frazzled Productions Ltd, a company registered in
        England and Wales (company number 17258540), registered office 71-75 Shelton
        Street, Covent Garden, London, WC2H 9JQ. We are the data controller for the
        app. Contact us about anything in this policy at{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>

      <h2>What stays on your iPhone</h2>
      <p>
        Everything you make in the app is stored only on your iPhone and is never
        sent to us:
      </p>
      <ul>
        <li>your menus, dishes, steps, serving times and plans</li>
        <li>your settings, such as oven type, temperature unit and preheat time</li>
        <li>
          cook mode alarms, notifications and the Live Activity, which are scheduled
          and shown by iOS on your device
        </li>
      </ul>
      <p>
        We do not run any servers for the app and you do not create an account.
        Deleting the app deletes this data. If you back up your iPhone to iCloud or a
        computer, Apple includes app data in that backup under Apple&apos;s own terms.
      </p>

      <h2>Your purchase (RevenueCat)</h2>
      <p>
        Roast Conductor offers a one-time unlock bought through the App Store. Apple
        handles the payment; we never see your name, Apple Account or card details.
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
        <li>an anonymous app user ID created by the app (it is not your name, email or Apple Account)</li>
        <li>
          your purchase history for this app: what was bought, when, the price and
          currency, and the App Store transaction record
        </li>
        <li>
          technical details needed to deliver the service, such as the app version,
          iOS version, device model, country and IP address
        </li>
      </ul>
      <p>
        We use this to provide the unlock (to make the app work) and to see how many
        unlocks are sold (analytics). It is not linked to your identity, is not
        used for advertising and is not used to track you across other apps or
        websites. Read{" "}
        <a
          href="https://www.revenuecat.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          RevenueCat&apos;s privacy policy
        </a>{" "}
        for how RevenueCat handles data. RevenueCat is based in the United States, so
        this data may be processed there, under the safeguards described in its
        policy.
      </p>
      <p>
        Our legal bases under UK and EU data protection law are performing our
        contract with you (providing the unlock you bought) and our legitimate
        interest in understanding sales of the app. We keep purchase records for as
        long as they are needed to let you restore your purchase and to meet our
        accounting obligations.
      </p>

      <h2>Importing a recipe from a link</h2>
      <p>
        With the unlock, you can build a dish from a recipe web page by pasting its
        link. When you do:
      </p>
      <ul>
        <li>
          your iPhone fetches that public web page directly from the website you
          linked to, the same way Safari would, so that website sees an ordinary
          request from your device
        </li>
        <li>
          the page is read on your iPhone, using on-device Apple Intelligence where
          it is available, and nothing about it is sent to us or to any AI service
        </li>
        <li>
          the app saves only the dish, its steps, its ingredients list and the link,
          never the full page
        </li>
      </ul>

      <h2>What we do not do</h2>
      <ul>
        <li>No accounts or sign-in.</li>
        <li>No analytics or advertising tools in the app, and no tracking.</li>
        <li>No selling or sharing of your data.</li>
        <li>No access to your contacts, location, photos, camera or microphone.</li>
      </ul>
      <p>
        If you have chosen in iOS Settings to share analytics with app developers,
        Apple may send us anonymous crash reports and usage statistics. That is
        controlled by Apple and you can turn it off in Settings, under Privacy and
        Security, then Analytics and Improvements.
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right to ask for a copy of personal data we hold about you, to
        have it corrected or deleted, and to object to how it is used. Because the
        purchase record is anonymous, we may need your help to find it (for example,
        the date you bought the unlock). Email{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a> and we will respond
        within one month. You can also complain to the UK Information
        Commissioner&apos;s Office at{" "}
        <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
          ico.org.uk
        </a>
        .
      </p>

      <h2>Children</h2>
      <p>
        Roast Conductor is a general cooking app and does not knowingly collect
        personal data from anyone, including children.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If the app starts handling data differently, we will update this page and
        its effective date before the change reaches the App Store.
      </p>

      <h2>This website</h2>
      <p>
        This policy covers the Roast Conductor app. The Frazzled Productions website
        counts page visits with Vercel Web Analytics, which does not use cookies.
      </p>
    </article>
  );
}
