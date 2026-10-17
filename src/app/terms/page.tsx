import { LegalPage } from "@/components/layout/LegalPage";
import { termsOfUse } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: termsOfUse.title, description: termsOfUse.description, path: termsOfUse.path });

export default function TermsPage() {
  return <LegalPage {...termsOfUse} />;
}
