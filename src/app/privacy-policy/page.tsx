import { LegalPage } from "@/components/layout/LegalPage";
import { privacyPolicy } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: privacyPolicy.title, description: privacyPolicy.description, path: privacyPolicy.path });

export default function PrivacyPolicyPage() {
  return <LegalPage {...privacyPolicy} />;
}
