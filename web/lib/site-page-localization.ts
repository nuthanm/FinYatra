import type { SitePageLink } from "@/lib/config/site";
import type { TFn } from "@/lib/i18n";

export function sitePageTitle(t: TFn, page: SitePageLink): string {
  switch (page.route) {
    case "":
      return t("Nav_Home");
    case "tools":
      return t("Nav_AllTools");
    case "goal":
      return t("Tool_goal_Title");
    case "fire":
      return t("Tool_fire_Title");
    case "fd-laddering":
      return t("Tool_fd_Title");
    case "sip":
      return t("Tool_sip_Title");
    case "emi":
      return t("Tool_emi_Title");
    case "inflation":
      return t("Tool_inflation_Title");
    case "about":
      return t("Page_About_Title");
    case "schemes/pmsby-pmjjby":
      return t("Page_PmsbyPmjjby_Title");
    case "contact":
      return t("Page_Contact_Title");
    case "sitemap":
      return t("Page_Sitemap_Title");
    case "privacy":
      return t("Page_Privacy_Title");
    case "terms":
      return t("Page_Terms_Title");
    default:
      return t(page.titleKey);
  }
}

export function sitePageDescription(t: TFn, page: SitePageLink): string {
  switch (page.route) {
    case "":
      return t("Home_Sub");
    case "tools":
      return t("Tools_Desc");
    case "goal":
      return t("Tool_goal_Description");
    case "fire":
      return t("Tool_fire_Description");
    case "fd-laddering":
      return t("Tool_fd_Description");
    case "sip":
      return t("Tool_sip_Description");
    case "emi":
      return t("Tool_emi_Description");
    case "inflation":
      return t("Tool_inflation_Description");
    case "about":
      return t("Page_About_Description");
    case "schemes/pmsby-pmjjby":
      return t("Page_PmsbyPmjjby_Description");
    case "contact":
      return t("Page_Contact_Description");
    case "sitemap":
      return t("Page_Sitemap_Description");
    case "privacy":
      return t("Page_Privacy_Description");
    case "terms":
      return t("Page_Terms_Description");
    default:
      return t(page.descriptionKey);
  }
}
