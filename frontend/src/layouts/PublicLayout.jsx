import { Outlet } from 'react-router-dom'
import { Header } from '../components/navigation/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'

export function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
