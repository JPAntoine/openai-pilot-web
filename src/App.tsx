import UserIcon from "./features/userIcon/userIcon";
import MainContent from "./features/mainContent/mainContentWrapper";
import Header from "./features/header/header";

import companyLogo from "./assets/images/DTE.png";

function App() {
  return (
    <div className="flex h-screen max-h-screen w-screen flex-col bg-White">
      <Header className="flex flex-row items-center bg-DTE-Blue p-5 h-[103px]">
        <img src={companyLogo} className="w-[136px] h-[47px]" alt="company-logo"/>

        <UserIcon className="ml-auto w-[52px] h-[52px]" />
      </Header>
      <div className="gap-9.5 flex h-full min-h-0 min-w-0 px-6 pt-3 pb-4">
        <MainContent />
      </div>
    </div>
  );
}

export default App;
