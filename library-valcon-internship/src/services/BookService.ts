import axios from 'axios'

import BookIdResponse from '../models/responses/BookIdResponse'
import BooksPagedResponse from '../models/responses/BooksPagedResponse'
import Where from '../models/Where'
import { baseUrl } from './AxiosConfiguration'

interface GetBooksProps {
  pageNumber: number,
  pageLength: number,
  search: string,
  filter: Where[],
  sort: string[]
}

const createWhereSearch = (search: string) => {
  return {
    Field: 'Title',
    Value: search,
    Operation: 2
  }
}

const convertParamsToQueryString = ({ pageNumber, pageLength, search, filter, sort }: GetBooksProps) => {
  let result = '?'
  result += 'PageNumber=' + pageNumber.toString()
  result += '&PageLength=' + pageLength.toString()
  const where: Where[] = [ ...filter ]
  where.push(createWhereSearch(search))
  where.forEach((where) => {
    if (where.Value !== '' && where.Value != null) {
      result += `&where=${JSON.stringify(where)}`
    }
  })
  sort.forEach((sort) => {
    if (sort)
      result += '&Order=' + sort
  })
  return result
}

export const getBooks = async ({ pageNumber, pageLength, search, filter, sort }: GetBooksProps) => {
  return axios.get<BooksPagedResponse>(baseUrl + 'api/Books/paged' + convertParamsToQueryString(
    {
      pageNumber, pageLength, search, filter, sort
    }
  ))
}

export const addNewBook = async (formData: FormData) => {
  return axios.post(baseUrl + 'api/Books', formData)
}

export const getBookById = async (id: string) => {
  return axios.get<BookIdResponse>(baseUrl + `api/Books/${id}`)
}

export const editBook = async (formData: FormData) => {
  return axios.put(baseUrl + 'api/Books', formData)
}

export const deleteBook = async (id: string) => {
  return axios.delete(baseUrl + `api/Books/${id}`)
}
