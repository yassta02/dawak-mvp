import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './store'
import { Landing } from './pages/Landing'
import { SearchPage } from './pages/SearchPage'
import { PharmacyDetail } from './pages/PharmacyDetail'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/pharmacy/:id" element={<PharmacyDetail />} />
          <Route path="/pharmacy/login" element={<Login />} />
          <Route path="/pharmacy/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
