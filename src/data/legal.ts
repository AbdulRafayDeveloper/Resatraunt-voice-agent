import type { LegalSection } from "@/components/layout/LegalPage";
import { siteConfig } from "@/config/site";

export interface LegalDocument {
  title: string;
  description: string;
  path: string;
  /** ISO date of the last substantive change. */
  updatedOn: string;
  intro: string;
  sections: LegalSection[];
}

const UPDATED = "2026-10-17";
const TBC = "[to be confirmed]";
const phone = siteConfig.phone;

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  description: "What TableTalk collects through its forms, where it goes, how long it is kept, and the rights you have under UK GDPR and US state privacy laws.",
  path: "/privacy-policy",
  updatedOn: UPDATED,
  intro: "This policy explains what personal information TableTalk collects, why, where it goes and what you can ask us to do with it. It is written to be read, not skimmed. Where a detail is not yet settled before launch, it is marked as such rather than guessed.",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        `TableTalk is a dining guide and table-request service for restaurants in the United Kingdom and the United States, operated by ${siteConfig.legalName}. The controller of the personal data described here is that entity; its registered name and address will be published on this page before launch ${TBC}.`,
        `You can reach us about anything in this policy on ${phone}.`,
      ],
    },
    {
      heading: "What we collect, and from where",
      paragraphs: [
        "The site has no accounts and no login. Everything we hold comes from a form you chose to fill in, or from the technical record of your visit.",
      ],
      bullets: [
        "Table request form: the restaurant, date, time, party size, occasion, dietary notes, your name, phone number, free-text notes and your confirmation that a request is not a booking.",
        "List your restaurant form: restaurant name, city, optional website, your name, role, phone number, covers per service, a free-text description and your consent to be contacted.",
        "Contact form: your name, phone number, the topic, an optional reference number and your message.",
        "Newsletter form: your phone number, the city you are interested in and your consent.",
        "Phone bookings: when you call the booking line, our voice agent takes your name, the number of guests, the day and the time, and saves the booking. The number you call from is not saved with the booking; it appears only in masked form in our service logs.",
        "Technical data: the IP address of the connection that submits a form, used only for rate limiting (see below), and standard server logs kept by our hosting provider.",
      ],
    },
    {
      heading: "Why we use it and on what basis",
      paragraphs: [
        "Under UK GDPR we must have a lawful basis for each use. These are the uses and the basis for each.",
      ],
      bullets: [
        "Answering a table request, passing it to the restaurant you named and telling you the outcome: necessary to take the steps you asked for before any booking (contract).",
        "Answering a listing enquiry or a contact message: our legitimate interest in running the service and responding to people who write to us.",
        "Sending the newsletter: your consent, which you can withdraw at any time by replying STOP to any message or by calling us.",
        "Taking a booking on the phone line: necessary to make the booking you asked for (contract). The voice agent only books a table that is free; it does not make any other decision about you.",
        "Rate limiting and spam prevention, including the hidden honeypot field on each form: our legitimate interest in keeping the service available and free of abuse.",
        "We do not use your data for profiling or automated decisions, and we do not sell it.",
      ],
    },
    {
      heading: "Where your data goes",
      paragraphs: [
        "When you submit a form, the data is validated on our server and then forwarded as a single message to a delivery endpoint we configure (a webhook). That endpoint delivers the submission to the tool our team uses to answer it. The identity of the provider behind that endpoint will be listed here before launch " + TBC + ".",
        "If you ask us to request a table, we pass the details the restaurant needs to consider it: date, time, party size, occasion, dietary notes, your name and your contact details. The restaurant then handles those details under its own privacy policy. We do not pass your details to any restaurant you did not name.",
        "Phone calls are carried by our telephony provider, Telnyx. What you say is converted to text, and our replies are converted back to speech, by OpenAI, which also powers the voice agent's understanding of the conversation. Bookings are stored in our database (MongoDB). We do not keep audio recordings of calls; the text of each turn of the conversation is kept in our service logs for troubleshooting for " + TBC + ".",
        "Where a restaurant takes bookings through a third-party provider such as Tock, Resy, SevenRooms or OpenTable, any booking you make there is between you and that provider under its terms; we are not party to it and do not receive your payment details.",
        "Our hosting provider processes technical data to serve the site and keeps standard access logs. Our hosting provider and the countries in which data is stored will be named here before launch " + TBC + ". Where data leaves the United Kingdom, we rely on the UK's adequacy regulations or the International Data Transfer Agreement.",
      ],
    },
    {
      heading: "Rate limiting and what is not stored",
      paragraphs: [
        "To limit abuse, the server keeps a short-lived count of submissions per connection in memory. Only the IP address and the timestamps of its recent submissions are held, for ten minutes at most, and nothing is written to disk. If you submit more than eight forms in ten minutes you will be asked to wait.",
        "The website's application logs record the kind of form submitted and the reference number issued. They do not record names, phone numbers or message content.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        `Retention periods for form submissions are ${TBC} before launch and will be stated here with a specific number of months for each form. The principle we will apply is that a table request is kept only as long as needed to resolve it and answer any follow-up about it, and a listing enquiry only until the listing is published or declined.`,
        "Newsletter addresses are kept until you unsubscribe or ask us to delete them. Rate-limiting data is discarded after ten minutes.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "If you are in the United Kingdom or the European Economic Area, you have the right to ask for a copy of the data we hold about you, to have it corrected or deleted, to restrict or object to how we use it, to receive it in a portable form, and to withdraw consent where consent is the basis. You also have the right to complain to the Information Commissioner's Office (ico.org.uk) or your local supervisory authority.",
        "If you are in a US state with a consumer privacy law, such as California, Virginia, Colorado, Connecticut or Texas, you may have similar rights of access, correction, deletion and portability, and the right to opt out of the sale or sharing of personal data and of targeted advertising. We do not sell or share personal data for advertising, so there is nothing to opt out of, and we will not treat you differently for exercising a right.",
        `To exercise any right, call ${phone} with the reference number from your confirmation if you have one. We will confirm your identity before releasing or deleting data and reply within one month, or the shorter period your local law requires.`,
      ],
    },
    {
      heading: "Cookies and local storage",
      paragraphs: [
        "The site currently sets no analytics or advertising cookies and stores nothing in your browser's local storage. The full position, and what we will do if that changes, is in the Cookie Policy.",
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "The service is intended for adults making restaurant arrangements. We do not knowingly collect personal data from anyone under 16. If you believe a child has sent us a form, write to us and we will delete it.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We will update this page when our practices change and change the date at the top. Material changes, such as naming the delivery provider or setting retention periods, will be recorded here with the date they took effect.",
      ],
    },
  ],
};

export const termsOfUse: LegalDocument = {
  title: "Terms of Use",
  description: "The terms on which TableTalk provides its dining guide and table-request service: what a request is, how accurate listings are, and what we do and do not promise.",
  path: "/terms",
  updatedOn: UPDATED,
  intro: "These terms govern your use of the TableTalk website and its table-request service. They are short because the service is simple: we publish facts about restaurants with their sources, and we relay requests. We do not take bookings or payments.",
  sections: [
    {
      heading: "Who provides the service",
      paragraphs: [
        `The website and the table-request service are provided by ${siteConfig.legalName}. The registered name, company number and address will be published here before launch ${TBC}. By using the site you agree to these terms; if you do not agree, please do not use it.`,
      ],
    },
    {
      heading: "What TableTalk is",
      paragraphs: [
        "TableTalk is two things. First, a dining guide: listings of restaurants in the United Kingdom and the United States showing hours, menu formats, prices, booking rules and awards, each with its source and the date it was checked. Second, a request relay: you can send us a table request and we will reply with a reference and either pass the request to the restaurant or tell you the quickest way to secure the table yourself.",
        "TableTalk is not a booking platform and does not hold restaurant diaries, confirm tables or take payment for them.",
      ],
    },
    {
      heading: "A request is not a booking",
      paragraphs: [
        "Sending a table request through the site does not create a reservation and does not oblige any restaurant to hold a table. A booking exists only when the restaurant, or its booking provider, confirms it to you, and it is then governed by the restaurant's own terms, including any deposit, prepayment or cancellation fee.",
        `We promise to call you back about every request within one working day. We do not promise that a table will be available, that a restaurant will respond, or that it will respond within any particular time. The Booking and Cancellation Policy explains the process in more detail.`,
      ],
    },
    {
      heading: "Accuracy of listings",
      paragraphs: [
        "Every fact on a listing is taken from the restaurant's own published material or from the awarding body, on the date shown on the listing. Restaurants change hours, menus, prices and policies without telling us, so a listing is a record of what was published on that date, not a guarantee of what you will find on the night.",
        "Where we could not verify a fact, the listing says 'to be confirmed'. Before relying on any detail that matters to you, including allergen handling, dress code and cancellation fees, check it with the restaurant. If you spot an error, tell us through the contact form and we will check it against the source before changing the listing.",
        "We publish no ratings, scores or reviews, and photography on the site is licensed editorial stock that is not of the restaurants pictured.",
      ],
    },
    {
      heading: "Third-party sites and booking providers",
      paragraphs: [
        "Listings link to restaurants' own websites and, where public, to their pages on booking providers such as Tock, Resy, SevenRooms and OpenTable. Those sites are run by other organisations under their own terms and privacy policies. We are not responsible for their content, availability or the bookings and payments you make on them.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "The text, design, layout, logo and code of the site belong to TableTalk or its licensors and are protected by copyright and other rights. You may read, print and share links to pages for personal, non-commercial use. You may not copy listings in bulk, scrape the site, or republish its content without written permission.",
        "Restaurant names, menus and award titles belong to their respective owners and awarding bodies and are reproduced only to describe them accurately. Photographs are licensed editorial images and may not be reused.",
      ],
    },
    {
      heading: "Acceptable use",
      paragraphs: ["When using the site and its forms you agree not to:"],
      bullets: [
        "Send a request on behalf of someone who has not asked you to, or give contact details that are not yours.",
        "Send requests you do not intend to keep, or use the service to hold tables you do not plan to use.",
        "Submit false or misleading information in a listing enquiry, including awards the restaurant has not received.",
        "Attempt to bypass the rate limits or spam protection, or probe, scan or overload the site.",
        "Use automated tools to extract listing data.",
      ],
    },
    {
      heading: "Liability",
      paragraphs: [
        "The site and the request service are provided free of charge and as described. To the extent permitted by law, we are not liable for any loss arising from a table being unavailable, a restaurant declining or cancelling a booking, a fee charged under a restaurant's terms, or a listing fact that has changed since the date it was checked.",
        "Nothing in these terms excludes liability that cannot be excluded by law, including liability for death or personal injury caused by negligence, for fraud, or under consumer protection law in your country of residence.",
      ],
    },
    {
      heading: "Governing law and changes",
      paragraphs: [
        `These terms are governed by the law of ${TBC}, and disputes will be heard in the courts of ${TBC}, without affecting any mandatory consumer rights you have where you live.`,
        `We may update these terms; the date at the top shows the current version. Continued use of the site after a change means you accept the new terms. Questions about them can be raised by calling ${phone}.`,
      ],
    },
  ],
};

export const cookiePolicy: LegalDocument = {
  title: "Cookie Policy",
  description: "TableTalk sets no analytics or advertising cookies and uses no local storage. What that means, how to check, and what we will do if it changes.",
  path: "/cookie-policy",
  updatedOn: UPDATED,
  intro: "This page lists every cookie and every piece of browser storage the site uses. At the moment that list is short, and this policy will be updated before anything is added to it.",
  sections: [
    {
      heading: "What cookies and local storage are",
      paragraphs: [
        "A cookie is a small text file a website asks your browser to store and send back on later visits. Local storage is a similar mechanism that stays in the browser and is not sent with each request. Both can be used to remember settings, to keep you signed in, or to track behaviour across visits and sites.",
      ],
    },
    {
      heading: "Cookies we use today",
      paragraphs: [
        "The TableTalk site sets no cookies of its own. There is no login, no shopping basket and no preference that needs remembering between visits.",
        "The only cookies that could be set are strictly necessary ones from our hosting provider, used to serve the site securely and to protect it from abuse. These do not identify you across sites and cannot be switched off without affecting the service. Whether our hosting provider sets any such cookie, and its name and lifetime, will be listed here before launch " + TBC + ".",
        "We set no analytics cookies, no advertising cookies and no social-media tracking pixels, so there is no consent banner to click.",
      ],
    },
    {
      heading: "Local storage",
      paragraphs: [
        "The site stores nothing in your browser's local storage or session storage. Form contents are held only in the page while you fill them in and are not saved anywhere in your browser.",
      ],
    },
    {
      heading: "Fonts, images and embedded content",
      paragraphs: [
        "Fonts and icon glyphs are served from our own domain rather than from a third-party font service, so no font provider sees your visit. Photographs are served from our own domain. The site embeds no maps, videos or social widgets, which are the usual route by which third parties set cookies.",
        "Links to restaurant websites and booking providers open those sites, which set their own cookies under their own policies.",
      ],
    },
    {
      heading: "How to control cookies",
      paragraphs: [
        "Every modern browser lets you view, block and delete cookies through its settings, usually under Privacy or Site data. You can also set the browser to refuse all cookies or to warn you before one is set. Because this site relies on none, blocking them will not affect how it works.",
      ],
    },
    {
      heading: "If we add analytics",
      paragraphs: [
        "If we decide to measure how the site is used, we will prefer a privacy-respecting method that needs no cookies and no personal data. If we do choose a tool that sets cookies or uses local storage, we will list each item here with its purpose and lifetime, ask for your consent before setting anything that is not strictly necessary, and update the date at the top of this page.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [`Questions about this policy can be raised by calling ${phone}. The Privacy Policy explains how we handle the information you send us through forms.`],
    },
  ],
};

export const bookingPolicy: LegalDocument = {
  title: "Booking & Cancellation Policy",
  description: "How a TableTalk table request works, what a restaurant's own deposit and cancellation terms mean for you, and how to cancel or change a request.",
  path: "/booking-policy",
  updatedOn: UPDATED,
  intro: "TableTalk relays requests; restaurants confirm bookings. This policy explains the difference, what we do with your request, and how the deposit and cancellation terms that restaurants publish apply to you.",
  sections: [
    {
      heading: "Request versus booking",
      paragraphs: [
        "A table request tells us the restaurant, date, time, party size, occasion and any dietary needs you want. It is free, and it is not a booking. A booking exists only when the restaurant or its booking provider confirms it to you directly, in writing.",
        "If you need certainty now, use the booking link on the restaurant's listing or contact the restaurant yourself. Same-day requests are better placed directly with the restaurant.",
      ],
    },
    {
      heading: "What we do with your request",
      paragraphs: [
        `${siteConfig.replyPromise} The reply carries a reference number beginning TT and explains the route: either we have forwarded the request to the restaurant's chosen contact, or we are pointing you to the fastest way to secure the table, such as a release time on its booking provider, its events team or a walk-in plan.`,
        "When we forward a request, we send the restaurant the details it needs: date, time, party size, occasion, dietary notes and your name and contact details. From that point the restaurant deals with you directly. We do not charge diners for this service.",
      ],
    },
    {
      heading: "The restaurant's terms prevail",
      paragraphs: [
        "Every confirmed booking is governed by the restaurant's own terms, not ours. Those terms decide whether a card is held, whether a deposit or prepayment is taken, and what is charged if you cancel late or do not arrive. We summarise the published terms under Booking rules on each listing so that you can read them before you ask, but the restaurant's confirmation and website are the authoritative version.",
      ],
    },
    {
      heading: "Typical deposit and cancellation patterns",
      paragraphs: [
        "Restaurants listed on TableTalk use three models. The figures below are the ones published on each restaurant's own site on the date shown on its listing; check the listing and the restaurant's confirmation for the current terms.",
      ],
      bullets: [
        "Card on file with a late-cancellation fee. Bonheur by Matt Abé in London charges £165 for cancellations with less than 72 hours' notice. Core by Clare Smyth in London charges £175 per person for cancellations or reductions inside 72 hours. Le Bernardin in New York charges $150 per person if you cancel with less than 48 hours' notice.",
        "Per-person charge for late cancellation or no-show at a lower threshold. The Kitchin in Edinburgh charges £45 per person at lunch and £90 per person at dinner for cancellation within 24 hours or a no-show, with a 72-hour rule for parties of eight.",
        "Prepaid ticket. Alinea in Chicago sells its seats as prepaid tickets; all sales are final and non-refundable, and a ticket can be rescheduled to a date in the same calendar year with at least 72 hours' notice. Other Tock restaurants follow a similar pattern, usually allowing a ticket to be transferred to another guest.",
        "Reductions in party size can be charged in the same way as cancellations, and some restaurants treat a dress-code breach as a cancellation.",
      ],
    },
    {
      heading: "How to cancel or change a request",
      paragraphs: [
        "Before the restaurant has confirmed: call our booking line quoting your reference, or use the contact form choosing 'An existing table request' and quoting the reference. We will tell the restaurant the same working day, and there is nothing to pay.",
        "After the restaurant has confirmed: cancel or amend through the channel the restaurant used to confirm, which is usually a link in its confirmation email or its booking provider's account page, and do it as early as you can. The restaurant's terms decide whether a fee applies. You are welcome to copy us so that our record matches.",
      ],
    },
    {
      heading: "No-shows",
      paragraphs: [
        "If you do not arrive for a confirmed booking and did not cancel, the restaurant may charge the fee in its terms, which for the restaurants above ranges from a fixed amount per booking to the full prepaid menu price. Several restaurants also release the table a set time after the booked slot; The Kitchin, for example, asks for reconfirmation 24 hours ahead and releases tables 20 to 30 minutes after the booked time.",
        "If you no longer need a table you requested through us, tell us even if the restaurant has not yet confirmed, so that nobody holds a seat for you.",
      ],
    },
    {
      heading: "If the restaurant cancels",
      paragraphs: [
        "A restaurant that cancels a confirmed booking should refund in full any deposit or prepayment it has taken. If that does not happen, contact the restaurant or its booking provider first; if you tell us, we will note it against the listing and, where we forwarded the request, help you reach the right person.",
      ],
    },
    {
      heading: "Large parties and private rooms",
      paragraphs: [
        "The request form takes up to 12 guests. For larger groups we route the request to the restaurant's events or private dining team where one exists. Private rooms and chef's tables are normally sold with a minimum spend, a set menu and a non-refundable deposit agreed in writing; those terms are the restaurant's and will be set out before you commit.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [`Questions about a request can be sent through the contact form with your reference, or by calling ${phone}. This policy was last updated on the date shown at the top of the page.`],
    },
  ],
};
