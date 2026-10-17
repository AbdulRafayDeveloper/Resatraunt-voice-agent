import { LegalPage } from "@/components/layout/LegalPage";
import { bookingPolicy } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: bookingPolicy.title, description: bookingPolicy.description, path: bookingPolicy.path });

export default function BookingPolicyPage() {
  return <LegalPage {...bookingPolicy} />;
}
