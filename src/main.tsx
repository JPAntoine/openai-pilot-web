import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { pdfjs } from 'react-pdf'
import msalInstance from './app/msalinstance.ts'
import { MsalProvider } from '@azure/msal-react'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const rootNode = document.getElementById("root");
if (!rootNode) throw new Error("Failed to find the root element");


(async () => {
  if (process.env.NODE_ENV === 'development') {
    await import('@/testing/mocks/chatServiceMocks.ts');
  }})();

const root = ReactDOM.createRoot(rootNode);

// root.render(
//   <React.StrictMode>
//     <MsalProvider instance={msalInstance}>
//       <MsalAuthenticationTemplate
//         interactionType={InteractionType.Redirect}
//         authenticationRequest={authRequest}
//         errorComponent={() => (
//           <FullScreenText>Authentication Error</FullScreenText>
//         )}
//         loadingComponent={() => (
//           <FullScreenText showSpinner={true}>
//             Checking Authorization
//           </FullScreenText>
//         )}
//       >
//         <ActiveUserWrapper>
//             <App />
//         </ActiveUserWrapper>
//       </MsalAuthenticationTemplate>
//     </MsalProvider>
//   </React.StrictMode>
// );

root.render(
  <React.StrictMode>
     <MsalProvider instance={msalInstance}>
      
      <Provider store={store}>
        <App />
      </Provider>
    </MsalProvider>
  </React.StrictMode>,
);