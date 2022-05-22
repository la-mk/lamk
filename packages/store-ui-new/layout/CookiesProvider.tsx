import React from "react";
import { CookieBanner } from "@la-mk/blocks-ui";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { urls } from "../tooling/url";

type Consent = {
  necessary?: boolean;
  analytics?: boolean;
};

interface CookiesProviderProps {
  necessaryTitle: string;
  analyticsTitle: string;
  children: React.ReactElement;
}

export const CookiesContext = React.createContext(null as Consent | null);

export const CookiesProvider = ({
  necessaryTitle,
  analyticsTitle,
  children,
}: CookiesProviderProps) => {
  const [consent, setConsent] = useLocalStorage<Consent | null>(
    "cookies-consent"
  );

  return (
    <CookiesContext.Provider value={consent}>
      <CookieBanner
        onConsentsChanged={setConsent}
        consents={consent}
        cookiesPolicyLink={urls.cookiesPolicy}
        requests={[
          {
            key: "necessary",
            title: necessaryTitle,
            isRequired: true,
          },
          {
            key: "analytics",
            title: analyticsTitle,
          },
        ]}
      />

      {children}
    </CookiesContext.Provider>
  );
};
