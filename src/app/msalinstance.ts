import {
  InteractionRequiredAuthError,
  PublicClientApplication,
} from "@azure/msal-browser";
import msalConfig from "../configs/msalConfig";

const msalInstance = new PublicClientApplication(msalConfig);

export const authRequest = {
  scopes: ["openid", "profile", "User.Read"],
};

export const getToken: () => Promise<string | null> = async () => {
  const token = await msalInstance
    .acquireTokenSilent(authRequest)
    .then(function (accessTokenResponse) {
      // Acquire token silent success
      const accessToken = accessTokenResponse.accessToken;
      return accessToken;
    })
    .catch(function (error) {
      //Acquire token silent failure, and send an interactive request
      if (error instanceof InteractionRequiredAuthError) {
        msalInstance
          .acquireTokenPopup(authRequest)
          .then(function (accessTokenResponse) {
            // Acquire token interactive success
            const accessToken = accessTokenResponse.accessToken;
            return accessToken;
          })
          .catch(function (error) {
            // Acquire token interactive failure
            console.error(error);
          });
      }
      console.error(error);
    });

  return token || null;
};

export default msalInstance;

//https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize