import './App.css'
import Link from './features/link/link';
import { Links } from './app/constants';
import UserIcon from './features/userIcon/userIcon';
import MainContent from './features/mainContent/mainContentWrapper';
import Header from './features/header/header';

function App() {

  return (
    <div className="flex h-screen max-h-screen w-screen flex-col gap-2 bg-black p-3">
    
    <Header className="flex flex-shrink-0 items-center">
      <div className="ml-3 flex items-center justify-center gap-2">
        <img src="sce-logo-square.png" className="w-9" />
        <div className="font-open-sans text-xl text-white">Inject Title</div>
      </div>
      <Link
        href={Links.FEEDBACK_FORM}
        className="ml-auto block text-base text-white underline transition-colors duration-300"
        openInNewTab={true}
      >
        Feedback
      </Link>
      <UserIcon className="ml-4 h-8 w-8" />
    </Header>
    <div className="gap-9.5 flex h-full min-h-0 min-w-0">     
      <MainContent />
    </div>
  </div>
  )
}

export default App
