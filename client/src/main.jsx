import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { SentryErrorBoundary } from './monitoring/sentry.js'
import './index.css'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SentryErrorBoundary fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Something went wrong. Please refresh.</div>}>
          <App />
        </SentryErrorBoundary>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #1f2937, #374151)',
              color: '#fff',
              borderRadius: '12px',
              padding: '14px 20px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(8px)',
            },
            success: {
              style: {
                background: 'linear-gradient(135deg, #22c55e, #10b981)',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#22c55e',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
            loading: {
              style: {
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
