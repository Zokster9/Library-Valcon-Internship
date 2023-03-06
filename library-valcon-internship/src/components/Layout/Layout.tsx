import { useState } from 'react'

import { BrowserRouter } from 'react-router-dom'

import Navbar from '../Navbar/Navbar'
import Header from '../Header/Header'
import MobileSidebar from '../MobileSidebar/MobileSidebar'
import AppRouter from '../AppRouter/AppRouter'
import './Layout.css'

const Layout = () => {
  const [ isVisible, setIsVisible ] = useState(false)
  const handleMenuClick = () => {
    setIsVisible((currentState) => !currentState)
  }
  return (
    <div className='Layout'>
      <BrowserRouter>
        <Header />
        <AppRouter />
        <MobileSidebar isVisible={isVisible} />
        <Navbar handleMenuClick={handleMenuClick} />
      </BrowserRouter>
    </div>
  )
}

export default Layout
