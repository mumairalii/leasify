import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { store } from './app/store'; // <-- Import the store
import { Provider } from 'react-redux'; // <-- Import the Provider
import { ThemeProvider } from './components/providers/ThemeProvider';
createRoot(document.getElementById('root')).render(
  
  
  <StrictMode>

    {/* Wrap your entire App component with the Provider */}
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="propman-ui-theme">
        <App />
      </ThemeProvider>
      
    </Provider>
  </StrictMode>,
)
