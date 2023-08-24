import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {AuthContextProvider} from './context/AuthContext'
import './index.css'
// import { SmartAccountProvider  } from './contexts/SmartAccountAcontext'
// import { Web3AuthProvider } from './contexts/SocialLoginContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <Web3AuthProvider>
      <SmartAccountProvider> */}
      <AuthContextProvider>
        <App />
      </AuthContextProvider>  
      {/* </SmartAccountProvider>
    </Web3AuthProvider> */}
  </React.StrictMode>,
)