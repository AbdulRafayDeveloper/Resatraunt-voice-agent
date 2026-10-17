import type { HowItWorksStep } from "@/types";

/** How a table request works, in the order shown on the home page and the request page. */
export const howItWorks: HowItWorksStep[] = [
  { title: "Choose a restaurant", detail: "Search by city, cuisine, price band or occasion. Every listing shows hours, menu formats, booking rules and awards with their source.", icon: "search" },
  { title: "Send a request", detail: "Tell us the date, time, party size, occasion and any dietary needs. It takes a minute and nothing is charged.", icon: "edit_note" },
  { title: "We confirm the route", detail: "Within one working day we email you a reference and either pass the request to the restaurant or point you to the fastest way to secure the table.", icon: "mark_email_read" },
  { title: "The restaurant confirms", detail: "A booking is only confirmed when the restaurant says so, under its own deposit and cancellation terms. We show those terms before you ask.", icon: "event_available" },
];

/** What we check for every listing, and how. */
export const verificationSteps = [
  { title: "Official site first", detail: "Hours, menus, prices and policies are read from the restaurant's own website on the date shown on the listing." },
  { title: "Awards from the source", detail: "Michelin stars come from the Michelin Guide or its official announcements; James Beard awards from the Foundation or its reporting partners. Each one carries a year and a link." },
  { title: "No invented numbers", detail: "No star ratings, review counts, seat counts or prices appear unless the restaurant or awarding body publishes them." },
  { title: "Doubt is labelled", detail: "When sources disagree, the listing says 'to be confirmed' and explains why." },
];

/** Facts about the listed set, derived at build time from the data, for the home page strip. */
export const siteFacts = {
  spelling: "British English",
  photography: "Licensed editorial photography; not of the restaurants",
};
