import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import Where from '../../models/Where'
import Search from '../Search/Search'
import './Header.css'

interface HeaderProps {
  setToken: Dispatch<SetStateAction<string | null>>
  setSearch: Dispatch<SetStateAction<string>>
  setFilter: Dispatch<SetStateAction<Where[]>>
  setSort: Dispatch<SetStateAction<string[]>>
}

const Header = ({ setToken, setSearch, setFilter, setSort }: HeaderProps) => {
  const [ position, setPosition ] = useState(window.scrollY)
  const [ visible, setVisible ] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem('token')
  const isSearchVisible = location.pathname === '/' && isLoggedIn
  useEffect(() => {
    const handleScroll = () => {
      const moving = window.scrollY
      setVisible(position > moving)
      setPosition(moving)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [ position ])
  const visibilityClass = visible ? 'visible' : 'hidden'
  const handleSignOut = () => {
    localStorage.clear()
    setToken(null)
    navigate('/')
  }
  return (
    <div className={'header ' + visibilityClass}>
      <Search isSearchVisible={isSearchVisible} setSearch={setSearch} setFilter={setFilter} setSort={setSort} />
      <div className='header-user'>
        { isLoggedIn &&
          <button className='header-btn' onClick={handleSignOut}>
            Sign out
          </button>}
      </div>
    </div>
  )
}

export default Header
