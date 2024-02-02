import UserIcon from './features/userIcon/userIcon';
import MainContent from './features/mainContent/mainContentWrapper';
import Header from './features/header/header';

function App() {

  return (
    <div className="flex h-screen max-h-screen w-screen flex-col gap-2 bg-background p-3">
    
    <Header className="flex flex-shrink-0 items-center">
      <div className="ml-3 flex items-center justify-center gap-2">
        <img src="company-logo.png" className="w-36 -mt-[10px] -mb-[10px]" />
      </div>

      <UserIcon className="ml-auto h-8 w-8 block" />
    </Header>
    <div className="gap-9.5 flex h-full min-h-0 min-w-0">     
      <MainContent />
    </div>
  </div>
  )
}

export default App
