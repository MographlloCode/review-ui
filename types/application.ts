export type dataOwners = string[]

export interface Application {
  id: string
  application: string
  datasource: string
  lastScanDate: string
  dataOwners: dataOwners
  curationRate: number
  haveChangeRequest: string
}
