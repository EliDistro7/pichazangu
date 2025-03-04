

import { useState, useEffect } from "react";

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("user_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (choice) => {
    if (choice === "accept") {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
      });
    } else {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
      });
    }

    localStorage.setItem("user_consent", choice);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 text-center">
      <p className="mb-2">We use cookies for personalized ads & analytics.</p>
      <button onClick={() => handleConsent("accept")} className="bg-green-500 px-4 py-2 mr-2">
        Accept
      </button>
      <button onClick={() => handleConsent("reject")} className="bg-red-500 px-4 py-2">
        Reject
      </button>
    </div>
  );
}
