import { Application } from './application'

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    totalRows: number
    pageCount: number
  }
}

export type SearchParams = {
  page?: string
  limit?: string
  search?: string
  [key: string]: string | undefined
}
