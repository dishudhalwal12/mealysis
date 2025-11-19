import React from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import HomePage from "./pages/HomePage.tsx";
import GroupListPage from "./pages/GroupListPage.tsx";
import GeolocationPage from "./pages/GeolocationPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import Root from "./pages/Root.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";
import SupportPage from "./pages/SupportPage.tsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.tsx";
import CartComparisonPage from "./pages/CartComparisonPage.tsx";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage.tsx";
import RefundPolicyPage from "./pages/RefundPolicyPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "search-results",
        element: <GroupListPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "geolocation",
        element: <GeolocationPage />,
      },
      {
        path: "product-detail",
        element: <ProductDetailPage />,
      },
      {
        path: "action-ios",
        element: <GroupListPage />,
      },
      {
        path: "action-android",
        element: <GroupListPage />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "tnc",
        element: <TermsAndConditionsPage />,
      },
      {
        path: "refundpolicy",
        element: <RefundPolicyPage />,
      },
      {
        path: "support",
        element: <SupportPage />,
      },
      {
        path: "cart-comparison",
        element: <CartComparisonPage />,
      }
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
