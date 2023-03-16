import { useEffect, useState } from 'react'

import AuthorFormType from '../../models/AuthorFormType'
import AuthorFormValidation from '../../models/AuthorFormValidation'
import BookDetail from '../../models/BookDetail'
import BookFormType from '../../models/BookFormType'
import BookFormValidation from '../../models/BookFormValidation'
import { addNewAuthor, getAllAuthors } from '../../services/AuthorService'
import { addNewBook } from '../../services/BookService'
import { convertAuthorsToAuthorDetails } from '../../utils/Utils'
import BookForm from '../BookForm/BookForm'
import Modal from '../Modals/Modal/Modal'
import './BookFormWrapper.css'

interface BookFormWrapperProps {
  closeModal: () => void
  book?: BookDetail
}

const BookFormWrapper = ({ closeModal, book }: BookFormWrapperProps) => {
  const [ bookForm, setBookForm ] = useState<BookFormType>({
    requestCover: new Blob(),
    cover: book?.Cover ? book?.Cover : '',
    title: book?.Title ? book?.Title : '',
    description: book?.Description ? book?.Description : '',
    isbn: book?.ISBN ? book?.ISBN : '',
    quantity: book?.Quantity ? book?.Quantity.toString() : '',
    releaseDate: book?.PublishDate ? new Date(book?.PublishDate) : null,
    selectedAuthors: book?.Authors ? book?.Authors : [],
    authors: []
  })
  const [ bookFormValidation, setBookFormValidation ] = useState<BookFormValidation>({
    isTitleValid: true,
    isDescriptionValid: true,
    isIsbnValid: true,
    isQuantityValid: true,
    isReleaseDateValid: true,
    isSelectedAuthorsValid: true,
    isDataValid: true
  })
  const [ authorForm, setAuthorForm ] = useState<AuthorFormType>({
    firstName: '',
    lastName: ''
  })
  const [ authorFormValidation, setAuthorFormValidation ] = useState<AuthorFormValidation>({
    isFirstNameValid: true,
    isLastNameValid: true,
    isAuthorDataValid: true
  })

  const fetchAuthors = () => {
    getAllAuthors()
      .then(response => {
        setBookForm(bookForm => {
          return {
            ...bookForm,
            authors: convertAuthorsToAuthorDetails(response.data)
          }
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  useEffect(() => {
    fetchAuthors()
  }, [])

  const handleOnBookSubmit = () => {
    if (bookForm.title.trim() === '') {
      setBookFormValidation(bookFormValidation => {
        return {
          ...bookFormValidation,
          isTitleValid: false
        }
      })
      return
    }
    if (bookForm.description.trim() === '') {
      setBookFormValidation(bookFormValidation => {
        return {
          ...bookFormValidation,
          isDescriptionValid: false
        }
      })
      return
    }
    if (Number.parseInt(bookForm.quantity.trim()) < 1) {
      setBookFormValidation(bookFormValidation => {
        return {
          ...bookFormValidation,
          isQuantityValid: false
        }
      })
      return
    }
    const isbnRegex = new RegExp('^(?=(?:\\D*\\d){10}(?:(?:\\D*\\d){3})?$)[\\d-]+$')
    if (bookForm.isbn.trim() === '' || !isbnRegex.test(bookForm.isbn)) {
      setBookFormValidation(bookFormValidation => {
        return {
          ...bookFormValidation,
          isIsbnValid: false
        }
      })
      return
    }
    if (!bookForm.releaseDate) {
      setBookFormValidation(bookFormValidation => {
        return {
          ...bookFormValidation,
          isReleaseDateValid: false
        }
      })
      return
    }
    if (bookForm.selectedAuthors.length === 0) {
      setBookFormValidation(bookFormValidation => {
        return {
          ...bookFormValidation,
          isSelectedAuthorsValid: false
        }
      })
      return
    }

    const formData = new FormData()
    formData.append('title', bookForm.title.trim())
    formData.append('description', bookForm.description.trim())
    formData.append('isbn', bookForm.isbn.trim())
    formData.append('quantity', bookForm.quantity.trim())
    formData.append('cover', bookForm.requestCover)
    formData.append('publishDate', bookForm.releaseDate.toISOString())
    bookForm.selectedAuthors.forEach(author => formData.append('authorIds', author.Id.toString()))
    addNewBook(formData)
      .then(() => {
        closeModal()
      })
      .catch(() => {
        setBookFormValidation(bookFormValidation => {
          return {
            ...bookFormValidation,
            isDataValid: false
          }
        })
      })
  }
  const handleOnAuthorSubmit = () => {
    if (authorForm.firstName.trim() === '') {
      setAuthorFormValidation(authorFormValidation => {
        return {
          ...authorFormValidation,
          isFirstNameValid: false
        }
      })
      return
    }
    if (authorForm.lastName.trim() === '') {
      setAuthorFormValidation(authorFormValidation => {
        return {
          ...authorFormValidation,
          isLastNameValid: false
        }
      })
      return
    }
    addNewAuthor(authorForm.firstName.trim(), authorForm.lastName.trim())
      .then(() => {
        fetchAuthors()
        setAuthorForm({
          firstName: '',
          lastName: ''
        })
      })
      .catch(() => {
        setAuthorFormValidation(authorFormValidation => {
          return {
            ...authorFormValidation,
            isAuthorDataValid: false
          }
        })
      })
  }

  return (
    <Modal closeModal={closeModal} confirm={handleOnBookSubmit}>
      <BookForm
        bookForm={bookForm}
        bookFormValidation={bookFormValidation}
        authorForm={authorForm}
        authorFormValidation={authorFormValidation}
        setBookForm={setBookForm}
        setBookFormValidation={setBookFormValidation}
        setAuthorForm={setAuthorForm}
        setAuthorFormValidation={setAuthorFormValidation}
        handleOnBookSubmit={handleOnBookSubmit}
        handleOnAuthorSubmit={handleOnAuthorSubmit}
        title='Create a book'
      />
    </Modal>
  )
}

export default BookFormWrapper