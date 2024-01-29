import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { InteractionStatus } from "@azure/msal-browser";
import FullScreenText from "../chatbox/components/fullScreenText";

/* Wrapper to set active user */
const ActiveUserWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { instance: msalInstance, inProgress } = useMsal();

  const [accountLoaded, setAccountLoaded] = useState(false);

  useEffect(() => {
    if (inProgress !== InteractionStatus.None) return;
    const accounts = msalInstance.getAllAccounts();
    const account = accounts.find(
      (account) =>
        account.username.toLowerCase().endsWith("@companyemail.com") ||
        account.username.toLowerCase().endsWith("@companyaltemail.com")
    );

    if (account) {
      msalInstance.setActiveAccount(account);
      setAccountLoaded(true);
    }
  }, [inProgress]);

  return accountLoaded ? (
    <>{children}</>
  ) : (
    <FullScreenText>Authentication Error</FullScreenText>
  );
};

export default ActiveUserWrapper;