import { useState } from 'react'

import hamburgerMenuIcon from '../../assets/icons/hamburger-menu-icon.svg'
import home from '../../assets/icons/home-icon.svg'
import profile from '../../assets/icons/profile-icon.svg'
import Token from '../../models/Token'
import BookFormWrapper from '../BookFormWrapper/BookFormWrapper'
import NavbarLink from '../NavbarLink/NavbarLink'
import './Navbar.css'

interface NavbarProps {
  handleMenuClick: () => void,
  token: string | null
}

const Navbar = ({ handleMenuClick, token }: NavbarProps) => {
  const [ showAddBookModal, setShowAddBookModal ] = useState(false)
  const isLoggedIn = token
  const jsonToken: Token | null = token ? JSON.parse(token) as Token : null
  return isLoggedIn ? (
    <nav className='navbar'>
      <NavbarLink className='navbar-link' to='' color='#F56211'>
        <img src={home} alt='home-icon' />
      </NavbarLink>
      <NavbarLink className='navbar-link' to='profile' color='#F56211'>
        <img src={profile} alt='profile-icon' />
      </NavbarLink>
      <button className='navbar-link' onClick={() => handleMenuClick()}>
        <img src={hamburgerMenuIcon} alt='moreOptions-icon' />
      </button>
      {
        jsonToken?.Role !== 'User' &&
        <>
          <button className='navbar-options-link' onClick={() => setShowAddBookModal(true)}>
            Add a new book
          </button>
          <NavbarLink to='top-rental-books' className='navbar-options-link' color='#F56211'>
            Top 10 Rental Books
          </NavbarLink>
          {showAddBookModal &&
            <BookFormWrapper closeModal={() => setShowAddBookModal(false)} />
          }
        </>
      }
    </nav>
  ) : (
    <></>
  )
}

export default Navbar
