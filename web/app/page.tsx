import { HomePage } from "@/components/pages/HomeTools";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("App_Title", "Home_Sub");

export default function Page() {
  return <HomePage />;
}
