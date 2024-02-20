import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { pdfjs } from "react-pdf";
import msalInstance, { authRequest } from "./app/msalinstance.ts";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import FullScreenText from "./features/chatbox/components/fullScreenText.tsx";
import ActiveUserWrapper from "./features/activeUserWrapper/activeUserWrapper.tsx";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const rootNode = document.getElementById("root");
if (!rootNode) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootNode);

console.log(process.env.NODE_ENV)

root.render(
  <React.StrictMode>
    {process.env.NODE_ENV !== "development" ? (
      <MsalProvider instance={msalInstance}>
        <MsalAuthenticationTemplate
          interactionType={InteractionType.Redirect}
          authenticationRequest={authRequest}
          errorComponent={() => (
            <FullScreenText>Authentication Error</FullScreenText>
          )}
          loadingComponent={() => (
            <FullScreenText showSpinner={true}>
              Checking Authorization
            </FullScreenText>
          )}
        >
          <ActiveUserWrapper>
            <Provider store={store}>
              <App />
            </Provider>
          </ActiveUserWrapper>
        </MsalAuthenticationTemplate>
      </MsalProvider>
    ) : (
      <Provider store={store}>
        <App />
      </Provider>
    )}
  </React.StrictMode>
);
