import type { FaqGroup, FaqItem } from "@/types";

export const faqGroups: FaqGroup[] = [
  {
    id: "requests",
    title: "Table requests",
    icon: "table_restaurant",
    items: [
      {
        q: "Is a table request a confirmed booking?",
        a: "No. A request tells us the restaurant, date, time and party size you want. We pass it to the restaurant or help you book through its own system, and nothing is confirmed until you receive a confirmation from the restaurant itself. If you need certainty now, use the restaurant's booking link on its page.",
      },
      {
        q: "How quickly do you reply?",
        a: "We reply to every request by email within one working day with a reference number and what happens next. Requests for the same day are better placed directly with the restaurant.",
      },
      {
        q: "Does it cost anything to request a table?",
        a: "No. TableTalk does not charge diners. Any deposit or prepayment is taken by the restaurant or its booking provider under the restaurant's own terms, which we summarise on each listing.",
      },
      {
        q: "Can I request a table for more than 12 people?",
        a: "The form takes up to 12 guests. For larger groups, describe the party in the notes and we will route the request to the restaurant's events or private dining team, where one exists.",
      },
      {
        q: "What if I need to cancel?",
        a: "Reply to your confirmation email or use the contact form with your reference. If the restaurant has already confirmed the booking, its own cancellation terms apply; several listed restaurants charge a fee for cancellations inside 48 or 72 hours.",
      },
    ],
  },
  {
    id: "listings",
    title: "Listings and accuracy",
    icon: "fact_check",
    items: [
      {
        q: "Where do the hours, prices and awards come from?",
        a: "From the restaurant's own website, checked on the date shown on each listing, and from the awarding bodies or official announcements for Michelin and James Beard recognition. Each award on the site carries a year and a link to its source.",
      },
      {
        q: "Why do some listings say 'to be confirmed'?",
        a: "When a fact could not be verified against the restaurant's own site, or two sources disagree, we say so rather than guess. Hours are the most common example: restaurants change them seasonally and do not always update every channel.",
      },
      {
        q: "Are the photographs of the restaurants?",
        a: "No. The photography on this site is licensed editorial imagery and is illustrative. We do not use restaurants' own photographs without permission, and each restaurant page says so.",
      },
      {
        q: "Do you publish ratings or reviews?",
        a: "Not yet. We will only show ratings or reviews once we can verify them, so there are no star ratings, review counts or testimonials on the site today.",
      },
      {
        q: "How do I report a mistake?",
        a: "Use the contact form and choose 'A listing correction'. Include the restaurant name and what is wrong, with a link if you have one. Corrections are checked against the restaurant's own site before the listing changes.",
      },
    ],
  },
  {
    id: "dining",
    title: "Dining out in the UK and US",
    icon: "restaurant",
    items: [
      {
        q: "Do UK restaurant prices include tax and service?",
        a: "UK menu prices include VAT. Most restaurants add a discretionary service charge, usually 12.5% in London, which you may ask to remove. US menu prices exclude sales tax, and a tip of 18% to 20% is expected unless the restaurant states that service is included.",
      },
      {
        q: "What does 'tasting menu only' mean?",
        a: "The restaurant serves one fixed sequence of courses at one price per person, usually for the whole table, with no à la carte choice. Dietary needs can normally be accommodated if you tell the restaurant when booking.",
      },
      {
        q: "What is a Tock prepaid reservation?",
        a: "Some restaurants sell their seats as tickets through Tock. You pay the menu price when you book, and the ticket is usually non-refundable but transferable to another guest. The restaurant's Tock page shows the exact terms.",
      },
      {
        q: "Are there dress codes?",
        a: "A few classic dining rooms keep one. The Ritz Restaurant asks for a jacket and tie; others ask for smart casual and discourage sportswear. Where a restaurant publishes a dress code, it is shown on its listing.",
      },
    ],
  },
  {
    id: "restaurants",
    title: "For restaurants",
    icon: "storefront",
    items: [
      {
        q: "How do I list my restaurant?",
        a: "Use the 'List your restaurant' form. We will check your hours, menus and any awards against your website and the awarding bodies before publishing, and you can ask for a correction at any time.",
      },
      {
        q: "Does TableTalk take a commission?",
        a: "Commercial terms for restaurants have not been finalised and will be published here before any restaurant is charged. Listings created from public information are free.",
      },
      {
        q: "Will you link to our own booking system?",
        a: "Yes. Every listing links to the restaurant's own website and, where one is public, its booking page on Tock, Resy, SevenRooms or OpenTable. Table requests sent through TableTalk are forwarded to the restaurant's chosen contact.",
      },
    ],
  },
];

export const allFaqs: FaqItem[] = faqGroups.flatMap((g) => g.items);

/** Short set used on the home page and request page. */
export const homeFaqs: FaqItem[] = [faqGroups[0].items[0], faqGroups[0].items[1], faqGroups[1].items[0], faqGroups[1].items[2], faqGroups[2].items[0]];
