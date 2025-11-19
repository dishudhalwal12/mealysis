import { GroupedProductOption } from "../api/getGroupedProducts";

export const openOutboundLink = (option: GroupedProductOption) => {
  // Add referrer parameter to deeplink
  const url = new URL(option.deeplink);
  url.searchParams.append("utm_source", "qc");
  url.searchParams.append("utm_medium", "web");
  url.searchParams.append("utm_campaign", "price_compare");

  // Open link with referrer
  window.open(url.toString(), "_blank", "noopener,noreferrer");
};
