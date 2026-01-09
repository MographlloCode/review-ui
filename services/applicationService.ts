// services/applicationService.ts
import { Application } from '@/types/application'
import { PaginatedResponse, SearchParams } from '@/types/api'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const generateAllData = (): Application[] => {
  return Array.from({ length: 2000 }, (_, i) => {
    const baseDate = new Date('2024-05-10T10:00:00Z')
    baseDate.setMinutes(baseDate.getMinutes() + i)

    return {
      id: i.toString(),
      application: `Application ${i}`,
      datasource: `Datasource ${i}`,
      lastScanDate: baseDate.toISOString(),
      dataOwners: [`dataowner${i}@email.com`, `backup${i}@email.com`],
      curationRate: (i * 37) % 101,
      haveChangeRequest: i % 3 === 0 ? 'CR Reviewed' : 'Pending Review',
    }
  })
}

export async function getApplications(
  params: SearchParams,
): Promise<PaginatedResponse<Application>> {
  await delay(300)

  let allData = generateAllData()

  // --- CORREÇÃO DO "0": Tratamento robusto de string ---
  const search = (params.search || '').toLowerCase()

  if (search) {
    allData = allData.filter(
      (item) =>
        item.application.toLowerCase().includes(search) ||
        item.datasource.toLowerCase().includes(search) ||
        item.dataOwners.some((d) => d.toLowerCase().includes(search)),
    )
  }

  // Filtros por Coluna
  Object.keys(params).forEach((key) => {
    if (['page', 'limit', 'search', 'sort', 'order'].includes(key)) return

    // Garante que "0" seja lido como string "0" e não ignorado
    const value = params[key]?.toString().toLowerCase()

    // Verificação explicita: se value for string vazia, ignora. Se for "0", processa.
    if (value !== undefined && value !== '') {
      allData = allData.filter((item) => {
        const itemValue = String((item as any)[key] || '').toLowerCase()
        return itemValue.includes(value)
      })
    }
  })

  // --- CORREÇÃO 3: Lógica de Sorting ---
  const sortCol = params.sort as keyof Application
  const sortOrder = params.order === 'desc' ? -1 : 1

  if (sortCol) {
    allData.sort((a, b) => {
      const valA = a[sortCol]
      const valB = b[sortCol]

      // Tratamento para números e strings
      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * sortOrder
      }

      // Tratamento genérico para strings
      const strA = String(valA).toLowerCase()
      const strB = String(valB).toLowerCase()

      if (strA < strB) return -1 * sortOrder
      if (strA > strB) return 1 * sortOrder
      return 0
    })
  }

  // Paginação
  const page = Number(params.page || '1')
  const limit = Number(params.limit || '100')
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  const totalRows = allData.length
  const pageCount = Math.ceil(totalRows / limit)

  const slicedData = allData.slice(startIndex, endIndex)

  return {
    data: slicedData,
    meta: {
      totalRows,
      pageCount,
    },
  }
}
