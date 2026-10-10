import type { Metadata } from "next";
import Link from "next/link";

// A recipe we wrote ourselves, so App Review and testers can try Roast Conductor's
// "From a recipe link" import against a stable page we control. The visible method and
// the schema.org JSON-LD are built from the same lists, so they cannot drift apart.

const pageURL = "https://frazzledproductions.com/roast-conductor/sample-recipe";
const recipeName = "Crisp roast potatoes";
const recipeYield = "Serves 4";

const ingredients = [
  "1.2kg floury potatoes",
  "5 tbsp vegetable oil or beef dripping",
  "1 tbsp semolina or plain flour",
  "Sea salt",
];

const method = [
  "Heat the oven to 220°C (200°C fan, gas 7).",
  "Peel the potatoes and cut them into even pieces about the size of an egg.",
  "Put the potatoes in a large pan of cold salted water, bring to the boil and parboil for 8 to 10 minutes, until the edges are soft.",
  "Meanwhile, pour the oil into a large roasting tin and heat it in the oven for 10 minutes.",
  "Drain the potatoes and leave them in the colander for 2 minutes to dry. Shake the colander to rough up the edges, then sprinkle over the semolina.",
  "Carefully tip the potatoes into the hot oil and turn them to coat. Roast at 220°C (200°C fan, gas 7) for 45 to 50 minutes, turning halfway, until golden and crisp.",
  "Leave to stand for 2 minutes, season with sea salt and serve hot.",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Recipe",
  name: recipeName,
  description:
    "A sample recipe from Frazzled Productions for trying recipe links in Roast Conductor.",
  url: pageURL,
  author: { "@type": "Organization", name: "Frazzled Productions" },
  recipeYield,
  prepTime: "PT15M",
  cookTime: "PT1H",
  totalTime: "PT1H15M",
  recipeCategory: "Side dish",
  recipeCuisine: "British",
  recipeIngredient: ingredients,
  recipeInstructions: method.map((text, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    text,
  })),
};

export const metadata: Metadata = {
  title: "Sample recipe: crisp roast potatoes | Roast Conductor",
  description:
    "A sample recipe for trying recipe links in Roast Conductor: crisp roast potatoes, serves 4.",
};

export default function RoastConductorSampleRecipePage() {
  return (
    <article className="rc-prose">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <p
        className="text-xs tracking-widest uppercase mb-3"
        style={{ fontFamily: "var(--font-orbitron)", color: "var(--pink)" }}
      >
        Sample recipe
      </p>
      <h1
        className="text-4xl md:text-5xl font-bold mb-6"
        style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
      >
        Crisp roast potatoes
      </h1>
      <p className="text-lg">
        This is a sample recipe for trying recipe links in{" "}
        <Link href="/roast-conductor">Roast Conductor</Link>. Copy this page&apos;s
        address, then in the app add a dish and choose{" "}
        <strong>From a recipe link</strong>. Roast Conductor reads the method,
        turns it into timed steps for you to check, and fits them into your plan.
      </p>
      <p>
        {recipeYield}. Preparation 15 minutes, cooking about 1 hour.
      </p>

      <h2>Ingredients</h2>
      <ul>
        {ingredients.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>Method</h2>
      <ol>
        {method.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <p>
        Ovens vary, so check the potatoes towards the end of the roasting time and
        give them a few minutes more if they need it.
      </p>
    </article>
  );
}
