import React from "react";
import GeolocationProvider from "./context/GeolocationContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import MarketplaceProvider from "./context/MarketplaceContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { initFirebase } from "./services/firebase.ts";
import Router from "./Router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmationDialogProvider } from "./context/ConfirmationDialogContext.tsx";
import { AlertProvider } from "./context/AlertContext.tsx";

initFirebase();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1, // Consider data fresh for 1 minute
      gcTime: 1000 * 60 * 5, // Keep unused data in cache for 5 minutes
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnReconnect: true, // Refetch when reconnecting
      retry: 2, // Retry failed requests twice
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AlertProvider>
          <ConfirmationDialogProvider>
            <div className="relative mx-auto h-screen bg-bg transition-colors duration-200">
              <div className="relative mx-auto h-screen max-w-[800px] shadow-lg bg-bg transition-colors duration-200">
                <GeolocationProvider>
                  <CartProvider>
                    <MarketplaceProvider>
                      <Router />
                    </MarketplaceProvider>
                  </CartProvider>
                </GeolocationProvider>
              </div>
            </div>
          </ConfirmationDialogProvider>
        </AlertProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
