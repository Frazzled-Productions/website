import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roast Conductor privacy policy | Frazzled Productions",
  description:
    "How the Roast Conductor app for iPhone, iPad and Apple Watch handles your data: no account, no tracking, menus stay on your devices unless you share one with Cook together, and RevenueCat manages the one-time unlock.",
};

const contactEmail = "hello@frazzledproductions.com";
const privacyEmail = "privacy@frazzledproductions.com";

export default function RoastConductorPrivacyPage() {
  return (
    <article className="rc-prose">
      <h1
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
      >
        Roast Conductor privacy policy
      </h1>
      <p>Effective 23 October 2026</p>
      <p>
        <strong>Changes:</strong> on 11 October 2026 we added how the app handles
        reminders, widgets, the Apple Watch app and your region. None of these sends
        data to us, and nothing else changed. On 17 October 2026 we added how to
        complain to us about how we use your data. Later the same day we made the
        policy more precise: the device identifier RevenueCat receives, the copy the
        widget and Apple Watch app keep after the app is deleted, how a recipe page is
        fetched and what an import saves, and saving a plan picture to Photos. On 23
        October 2026 we added Cook together, which shares a menu you choose with the
        people you invite through your own iCloud account.
      </p>

      <p className="text-lg">
        <strong>In short:</strong> Roast Conductor has no accounts, no adverts, no
        analytics tools and no tracking. Your menus and plans stay on your devices. If
        you choose Cook together, the menu you share is kept in your iCloud account and
        shared, through Apple&apos;s iCloud, with the people you invite. We never see
        it. Nothing you make in the app is sent to us. Apart from fetching a recipe page
        when you paste its link, and a menu you choose to share with Cook together
        (which goes only to your own iCloud), the only data the app sends off your
        device is about your one-time purchase: our payment partner RevenueCat processes it under an
        anonymous ID, with the technical details listed below, so the unlock works and
        can be restored.
      </p>

      <h2>Who we are</h2>
      <p>
        Roast Conductor is made by Frazzled Productions Ltd, a company registered in
        England and Wales (company number 17258540), registered office 71-75 Shelton
        Street, Covent Garden, London, WC2H 9JQ. We are the data controller for the
        app. Contact us about anything in this policy at{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>

      <h2>What stays on your devices</h2>
      <p>
        Everything you make in the app is stored only on your iPhone or iPad, except a
        menu you share with Cook together, described below, and is never sent to us:
      </p>
      <ul>
        <li>your menus, dishes, steps, serving times, plans and any helpers&apos; names you add</li>
        <li>your settings, such as oven type, temperature unit and preheat time</li>
        <li>
          cook mode alarms, notifications and the Live Activity, which are scheduled
          and shown by iOS on your device
        </li>
        <li>
          reminders, such as fridge, day-before and leftovers reminders, which are
          local notifications created and scheduled on your device, not sent from a
          server
        </li>
        <li>
          the data the widgets show, which they read from a copy the app keeps on
          the same device
        </li>
      </ul>
      <p>
        <strong>Apple Watch.</strong> If you use the Apple Watch app, your iPhone
        sends your current cook and upcoming dinners to your paired Apple Watch using
        Apple&apos;s WatchConnectivity, where the watch app keeps a copy to show you,
        and the watch sends back the steps you mark done. This goes between your own
        devices; nothing is sent to us.
      </p>
      <p>
        <strong>Your region.</strong> The app chooses the UK or US edition (for
        example °C or °F, kilograms or pounds) from your device&apos;s region setting,
        read on the device. The US and Canada get the US edition; Canada follows
        Health Canada&apos;s guidance. It does not use your location and does not
        send your region to us.
      </p>
      <p>
        We do not run any servers for the app and you do not create an account.
        Deleting the app deletes this data, apart from a small copy of your next
        dinner and any cook in progress that the widget and Apple Watch app keep in
        your device&apos;s keychain (iOS&apos;s secure storage), which iOS does not
        remove when an app is deleted. It never leaves your devices. If you back up
        your iPhone or iPad to iCloud or a computer, Apple includes app data in that
        backup under Apple&apos;s own terms.
      </p>

      <h2>Cooking together (iCloud sharing)</h2>
      <p>
        When you share a menu live with Cook together, Roast Conductor stores it in
        your iCloud account using Apple&apos;s CloudKit and shares it with the people
        you invite: the menu&apos;s name, dishes, steps and times, the dishes&apos;
        ingredients and recipe links, how many you are cooking for, the jobs for the day
        before, your helpers&apos; names and your own name as you give it, which steps
        were ticked Done, when and
        by whom, and who each person says they are in the plan and when their device
        last checked in. Anyone you invite can read and change the plan. People you
        invite can also see your name and contact as iCloud shows it on the invite.
      </p>
      <p>
        The plan itself (dishes, steps, times, names and who ticked what) is stored in
        iCloud&apos;s encrypted fields, which Apple says it cannot read. The menu&apos;s name
        is shown on the invite, so iCloud holds it unencrypted, along with technical
        details such as record IDs and when changes were made.
      </p>
      <p>
        We run no server for this and cannot read it; Apple stores it under its own
        terms and privacy policy. Stop sharing (or delete the menu) to remove the plan
        from everyone else&apos;s devices and from your iCloud: it removes everyone at
        once. A copy someone saves to their
        own menus stays on their device after you stop sharing. Deleting the app does
        not remove a shared plan from iCloud: stop sharing first. Anyone can leave a
        plan shared with them; leaving removes only their access, and the steps they
        ticked stay in your copy of the plan until you stop sharing. If you sign out of
        iCloud, plans shared with you are removed from this device.
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
          iOS version, device model, country and IP address, and the identifier iOS
          gives the app on your device (not your advertising identifier)
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
        link, or by pasting the method itself. When you do:
      </p>
      <ul>
        <li>
          for a link, your device fetches that public web page directly from the
          website you linked to, much as Safari would; the request names Roast
          Conductor as the app asking
        </li>
        <li>
          the page (or the method you pasted) is read on your device, using
          on-device Apple Intelligence where it is available, and nothing about it is
          sent to us or to any AI service
        </li>
        <li>
          the app saves only the dish, its steps, its ingredients list, how many it
          serves and the link, never the full page
        </li>
      </ul>

      <h2>What we do not do</h2>
      <ul>
        <li>No accounts or sign-in (Cook together uses your own iCloud account).</li>
        <li>No analytics or advertising tools in the app, and no tracking.</li>
        <li>We never sell your data, and we share it only with the people you choose.</li>
        <li>No access to your contacts, location, camera or microphone.</li>
        <li>
          The app never reads your photos. It only saves a plan picture to Photos
          when you choose Save Image.
        </li>
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
