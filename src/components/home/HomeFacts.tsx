import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { cities } from "@/data/cities";
import { restaurants } from "@/data/restaurants";
import { formatDate } from "@/lib/utils";

/** Hairline-ruled facts row. Every figure is derived from the data files, never typed in. */
export function HomeFacts() {
  const awards = restaurants.reduce((n, r) => n + r.awards.length, 0);
  const michelinStarred = restaurants.filter((r) => r.awards.some((a) => a.body === "Michelin Guide" && a.title.includes("Star") && !a.title.includes("Green"))).length;
  const facts = [
    { label: "Restaurants listed", value: String(restaurants.length) },
    { label: "Cities", value: String(cities.length) },
    { label: "Michelin-starred", value: String(michelinStarred) },
    { label: "Awards with a source", value: String(awards) },
    { label: "Listings checked", value: formatDate(siteConfig.dataCheckedOn) },
  ];
  return (
    <section className="border-y border-line bg-linen" aria-label="TableTalk at a glance">
      <Container>
        <dl className="grid grid-cols-2 divide-y divide-line sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {facts.map((f) => (
            <div key={f.label} className="py-5 pe-4 lg:px-6 lg:first:ps-0 lg:last:pe-0">
              <dd className="font-display text-3xl text-claret-deep md:text-4xl">{f.value}</dd>
              <dt className="mt-1 text-xs font-semibold uppercase tracking-wider text-smoke">{f.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
