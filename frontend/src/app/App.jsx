import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'
import { LanguageProvider } from './hooks/useLanguage.js'
import { ToastProvider } from './components/common/Toast.jsx'
import './index.css'

export default function App() {
  return (
    <ToastProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ToastProvider>
  )
}
