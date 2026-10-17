import { LegalPage } from "@/components/layout/LegalPage";
import { cookiePolicy } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: cookiePolicy.title, description: cookiePolicy.description, path: cookiePolicy.path });

export default function CookiePolicyPage() {
  return <LegalPage {...cookiePolicy} />;
}
