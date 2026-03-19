import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './hooks/useTheme'
import { WeatherErrorBoundary } from './components/WeatherErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WeatherErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </WeatherErrorBoundary>
  </StrictMode>,
)

