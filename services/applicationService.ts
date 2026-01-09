// services/applicationService.ts
import { Application } from '@/types/application'
import { PaginatedResponse, SearchParams } from '@/types/api' // Ajuste o import

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

// Gerador Determinístico (O mesmo que já fizemos)
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

// Essa função simula o Controller do Backend
export async function getApplications(
  params: SearchParams,
): Promise<PaginatedResponse<Application>> {
  await delay(300) // Simula latência de rede realista

  // 1. Gera TUDO (No real, isso seria "SELECT * FROM table")
  let allData = generateAllData()

  // 2. FILTRAGEM (WHERE)
  const search = params.search?.toLowerCase()

  if (search) {
    allData = allData.filter(
      (item) =>
        item.application.toLowerCase().includes(search) ||
        item.datasource.toLowerCase().includes(search) ||
        item.dataOwners.some((d) => d.toLowerCase().includes(search)),
    )
  }

  // 2.1 Filtros por Coluna (Ex: ?application=App 10)
  Object.keys(params).forEach((key) => {
    if (['page', 'limit', 'search'].includes(key)) return // Ignora params de controle

    const value = params[key]?.toString().toLowerCase()
    if (value) {
      allData = allData.filter((item) => {
        // Lógica simplificada de filtro por coluna
        const itemValue = String((item as any)[key] || '').toLowerCase()
        return itemValue.includes(value)
      })
    }
  })

  // 3. PAGINAÇÃO (LIMIT / OFFSET)
  const page = Number(params.page || '1')
  const limit = Number(params.limit || '100')
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  // 4. METADADOS
  const totalRows = allData.length
  const pageCount = Math.ceil(totalRows / limit)

  // 5. FATIAMENTO (Retorna só a página atual)
  const slicedData = allData.slice(startIndex, endIndex)

  return {
    data: slicedData,
    meta: {
      totalRows,
      pageCount,
    },
  }
}
