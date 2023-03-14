import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from 'react'

import debounce from 'lodash.debounce'
import { BsSortDownAlt } from 'react-icons/bs'
import { VscFilter } from 'react-icons/vsc'

import Where from '../../models/Where'
import ModalFilter from '../Modals/ModalFilter/ModalFilter'
import './Search.css'

interface SearchProps {
  isSearchVisible: string | false | null
  setSearch: Dispatch<SetStateAction<string>>
  setFilter: Dispatch<SetStateAction<Where[]>>
}

const Search = ({ isSearchVisible, setSearch, setFilter }: SearchProps) => {
  const [ showFilter, setShowFilter ] = useState(false)
  const handleSearchOnChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setSearch(target.value)
  }
  const handleFilterOnChange = (filter: Where[]) => setFilter(filter)
  const debouncedChangeHandler = useMemo(
    () => debounce(handleSearchOnChange, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  return (
    <div className={isSearchVisible ? 'header-search' : 'hide-search'}>
      <input
        className='header-search-bar'
        type='text'
        placeholder='Search...'
        autoComplete='off'
        onChange={debouncedChangeHandler}
      />
      <VscFilter className='icon' onClick={() => setShowFilter(true)} title='Filter' />
      <BsSortDownAlt className='icon' />
      <ModalFilter show={showFilter} closeModal={() => setShowFilter(false)} applyFilter={handleFilterOnChange} />
    </div>
  )
}

export default Search
