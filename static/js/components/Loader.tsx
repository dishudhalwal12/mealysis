import React from "react";
import { IconLoader2 } from "@tabler/icons-react";
import GoogleAdBanner from "./GoogleAdBanner.tsx";
import { isAppBrowser } from "../utils/platform.ts";

export default function Loader({ variant = "default" }: { variant: "default" | "lottie-webp" }) {
  if (variant === "lottie-webp") {
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex h-60 max-w-96 items-center justify-center">
          <img
            src={"https://i.pinimg.com/originals/33/50/05/335005b8eab00e041475d300c1478c4b.gif"}
            alt="loader"
          />
        </div>
        <GoogleAdBanner 
                  key="/23312116132/quickcompare_web/qc_home"
                  adSlot="/23312116132/quickcompare_web/qc_home" 
                  adFormat="auto"
                  className="w-full"
                />
      </div>
    );
  }

  return (
    <div className="flex h-40 items-center justify-center">
      <IconLoader2 className="h-10 w-10 animate-spin text-action dark:text-blue-500" />
    </div>
  );
}
