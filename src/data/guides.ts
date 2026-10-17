import type { Guide } from "@/types";

const PUBLISHED = "2026-10-17";

export const guides: Guide[] = [
  {
    slug: "how-to-book-a-michelin-starred-restaurant",
    title: "How to book a Michelin-starred restaurant",
    excerpt: "Release windows, deposits, sister-venue fallbacks and the walk-in seats most people forget about.",
    readMinutes: 7,
    image: "menuHands",
    category: "Booking",
    publishedOn: PUBLISHED,
    updatedOn: PUBLISHED,
    sections: [
      {
        heading: "Know the release window",
        paragraphs: [
          "Most starred restaurants do not keep an open diary. They release tables a fixed number of days or months ahead, often at a set time of day. Gymkhana in London opens its book two months ahead (three for its private vaults). Lei in New York releases a limited number of reservations 14 days ahead at 9 am Eastern. Tasting-menu restaurants on Tock typically drop a whole month at once.",
          "Find the rule on the restaurant's own site or booking page, put the release date in your calendar, and be ready at the minute it opens. On TableTalk the rule is listed under Booking rules on each restaurant page.",
        ],
      },
      {
        heading: "Expect to hold the table with a card",
        paragraphs: [
          "At this level a card is almost always taken at booking. Three patterns are common: a card held with a fee for late cancellation (Bonheur by Matt Abé charges £165 for cancellations inside 72 hours); a per-person deposit taken off the bill; or full prepayment as a Tock ticket, which is normally non-refundable but transferable.",
          "Read the terms before you confirm, and keep the confirmation email. The terms are the restaurant's, not ours; we summarise what is published so you are not surprised.",
        ],
      },
      {
        heading: "Use the sister restaurants and the bar",
        paragraphs: [
          "When the diary is full, groups often suggest their other restaurants. Gymkhana's booking page points to Ambassadors Clubhouse and Trishna. St. JOHN runs Bread and Wine in Spitalfields and a Marylebone dining room alongside Smithfield.",
          "Walk-in seats are the other route. Lei keeps most of its 28 seats for walk-ins every night. Kalaya keeps a few bar seats. Arriving at opening time on a weekday is the most reliable way to use them.",
        ],
      },
      {
        heading: "Groups need a human",
        paragraphs: [
          "Online booking usually stops somewhere between four and twelve guests. Above that you are dealing with an events or private dining team by email, often with a set menu and a minimum spend. Lei asks groups of five or more to use its contact form; Kalaya takes 13 to 22 by email; St. JOHN offers a feasting menu for eight or more.",
        ],
        bullets: ["Book the private room, not a long table, if the conversation matters.", "Agree the menu and deposit in writing.", "Confirm dietary needs for the whole party a week ahead."],
      },
      {
        heading: "What a TableTalk request does",
        paragraphs: [
          "A request through this site is not a booking. We reply within one working day with a reference and the quickest route to the table, whether that is the restaurant's own system, its events team or a walk-in plan. The restaurant confirms the booking; we never pretend to.",
        ],
      },
    ],
  },
  {
    slug: "tasting-menus-explained",
    title: "Tasting menus explained: time, price and what you are agreeing to",
    excerpt: "What a tasting menu costs, how long it takes, whether the whole table must take it, and how pairings are sold.",
    readMinutes: 6,
    image: "dishDark2",
    category: "Dining",
    publishedOn: PUBLISHED,
    updatedOn: PUBLISHED,
    sections: [
      {
        heading: "One price, one sequence",
        paragraphs: [
          "A tasting menu is a fixed series of courses at a fixed price per person. The restaurant decides the order and the dishes; you decide the drinks. Published prices among restaurants on this site run from £195 and £225 for the two menus at Bonheur by Matt Abé to £215 and £235 for The Ritz's five- and seven-course Epicurean menus.",
          "Some restaurants, such as Feld in Chicago, do not publish the price on their website at all; it appears on Tock when you book. We say so on the listing rather than guessing.",
        ],
      },
      {
        heading: "The whole table, usually",
        paragraphs: [
          "Most kitchens serve the tasting menu to the whole table so courses land together. Bonheur asks that each guest dines from the same menu; The Ritz says its tasting menus must be taken by the entire table. Kalaya goes further and requires its family-style Taste of Kalaya for larger parties and for all Friday and Saturday dinner tables except the bar.",
        ],
      },
      {
        heading: "How long it takes",
        paragraphs: [
          "Allow two and a half to three and a half hours for a long menu. Restaurants often restrict tasting menus to earlier sittings so the kitchen can finish; The Ritz serves its tasting menus in narrower windows than the à la carte. If you have a train or a sitter, say so when booking.",
        ],
      },
      {
        heading: "Pairings and supplements",
        paragraphs: [
          "Wine pairings are sold per person at tiers; The Ritz lists three levels. Feld sells alcoholic and non-alcoholic pairings in advance with the reservation and does not allow corkage. Fixed-price cartes sometimes carry supplements on luxury dishes: Bonheur's £165 carte lists £20 supplements on some courses.",
        ],
        bullets: ["Ask for the non-alcoholic pairing if one exists; it is usually made in-house.", "Tell the restaurant about allergies at booking, not at the table.", "Check whether service is included; in the UK a discretionary 12.5% is normally added."],
      },
    ],
  },
  {
    slug: "deposits-cancellations-and-no-shows",
    title: "Deposits, cancellations and no-show fees",
    excerpt: "The three ways restaurants protect a table, what you can get back, and how to cancel without a fee.",
    readMinutes: 5,
    image: "tableLinen",
    category: "Booking",
    publishedOn: PUBLISHED,
    updatedOn: PUBLISHED,
    sections: [
      {
        heading: "Why restaurants charge",
        paragraphs: [
          "A 20-seat tasting-menu restaurant that loses a table of four on a Saturday loses a fifth of its night. Deposits and no-show fees exist because of that arithmetic, and small, chef-owned rooms rely on them most.",
        ],
      },
      {
        heading: "The three models",
        paragraphs: ["Restaurants on this site use one of three approaches, and the listing says which."],
        bullets: [
          "Card on file with a late-cancellation fee: nothing is taken unless you cancel late or do not arrive. Bonheur charges £165 for cancellations with less than 72 hours' notice.",
          "Deposit per person: taken at booking and deducted from the bill; refundable up to a stated cut-off.",
          "Prepaid ticket: the full menu price is paid at booking through Tock. Usually non-refundable, usually transferable to another guest.",
        ],
      },
      {
        heading: "How to cancel cleanly",
        paragraphs: [
          "Cancel through the same channel you booked in, as early as you can, and keep the confirmation. If you booked through a request on TableTalk, call our booking line or use the contact form with the reference and we will tell the restaurant the same day. The restaurant's own terms still decide whether a fee applies.",
        ],
      },
      {
        heading: "What the law says",
        paragraphs: [
          "In the UK, a cancellation fee must be a genuine estimate of the restaurant's loss and must be disclosed before you book. In the US, terms are set by the booking platform's agreement and the restaurant's stated policy; prepaid tickets are treated like event tickets. In both countries, a restaurant that cancels on you should refund in full.",
        ],
      },
    ],
  },
  {
    slug: "dress-codes-fine-dining-london-new-york",
    title: "Dress codes at fine-dining restaurants in London and New York",
    excerpt: "Who still asks for a jacket, what 'smart casual' means in practice, and the rooms that do not care.",
    readMinutes: 4,
    image: "diningClassic",
    category: "Dining",
    publishedOn: PUBLISHED,
    updatedOn: PUBLISHED,
    sections: [
      {
        heading: "The formal few",
        paragraphs: [
          "Very few restaurants still enforce a formal code. The Ritz Restaurant in London is the clearest case: jacket and tie for gentlemen at lunch and dinner, no jeans or sportswear. The hotel publishes the rule on the restaurant page, and the dining room holds to it.",
        ],
      },
      {
        heading: "Smart casual, defined",
        paragraphs: [
          "Most high-end rooms say smart casual. In practice that means no sportswear, no shorts, no flip-flops; a collared shirt or a knit, dark trousers or a dress. Bonheur by Matt Abé spells out that sportswear is discouraged and that a reservation may not be honoured if the code is ignored.",
        ],
      },
      {
        heading: "Where nobody minds",
        paragraphs: [
          "Chef-owned rooms in New York, Chicago and Philadelphia are relaxed. Lei is a wine bar; Kalaya is a neighbourhood restaurant; Feld's guests sit around the kitchen. Wear what you would wear to a good dinner with friends.",
        ],
        bullets: ["Where a restaurant publishes a dress code, it appears on its TableTalk listing.", "If nothing is published, smart casual is always safe."],
      },
    ],
  },
  {
    slug: "chefs-table-counter-or-private-room",
    title: "Chef's table, counter or private room: which to book",
    excerpt: "The differences in price, booking method and experience, with examples from London, Chicago and New York.",
    readMinutes: 5,
    image: "chefsTable",
    category: "Dining",
    publishedOn: PUBLISHED,
    updatedOn: PUBLISHED,
    sections: [
      {
        heading: "The counter",
        paragraphs: [
          "Counter seats face the kitchen and are often the only seats in the room. Feld in Chicago seats 20 around a kitchen with nothing but the counter between cooks and guests. Counters suit solo diners and pairs, are booked like any other seat, and are the least expensive way to watch a kitchen work.",
        ],
      },
      {
        heading: "The chef's table",
        paragraphs: [
          "A chef's table is a separate, usually private, table inside or beside the kitchen, sold as a whole. Bonheur by Matt Abé's Petit Bonheur is £1,350 for the table, for up to six guests, including the Dream tasting menu, and is booked by enquiry rather than online. Expect a set menu, a longer evening and a conversation with the chef.",
        ],
      },
      {
        heading: "The private room",
        paragraphs: [
          "Private dining rooms seat from eight to thirty and come with their own menus and minimum spends. Gymkhana's two vaults seat ten each, one with its own wine cellar; its 42 room seats 16. St. JOHN Smithfield's private room seats 16. These are booked by email with a deposit, and the restaurant will usually ask you to choose a set menu in advance.",
        ],
        bullets: ["Counter: book online, best for one or two.", "Chef's table: enquire by email, priced per table.", "Private room: enquire by email, minimum spend, set menu."],
      },
    ],
  },
];

export function getGuide(slug: string): Guide {
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) throw new Error(`Unknown guide: ${slug}`);
  return guide;
}

export function findGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
