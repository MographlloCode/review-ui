// app/page.tsx
import { AnimatedText } from '@/components/common/AnimatedText'
import { DataTable } from '@/components/common/DataTable/DataTable'
import { ContentWrapper } from '@/components/layout/ContentWrapper'
import { Sidebar } from '@/components/layout/Sidebar/Sidebar'
import { applicationColumns as columns } from './_table/application/columns'
import { getApplications } from '@/services/applicationService'
import { SearchParams } from '@/types/api' // Certifique-se que o tipo existe

export default async function Home({
  searchParams,
}: {
  // No Next.js 15, searchParams é uma Promise
  searchParams: Promise<SearchParams>
}) {
  // CORREÇÃO: Aguarde a resolução dos parâmetros antes de passar para o service
  const resolvedParams = await searchParams

  // Agora passamos o objeto resolvido (não a promise)
  const response = await getApplications(resolvedParams)

  return (
    <>
      <Sidebar />
      <ContentWrapper>
        <div className='flex flex-col h-full'>
          <div className='w-full flex items-center gap-4 p-4 border-b border-gray-300/50'>
            <span className='font-semibold'>
              <AnimatedText text='Review Status' lgSize />
            </span>
          </div>

          <div className='flex-1 p-4 overflow-hidden'>
            <DataTable
              columns={columns}
              data={response.data}
              pageCount={response.meta.pageCount}
              rowCount={response.meta.totalRows}
              className='h-full border border-gray-200 rounded-lg shadow-sm'
            />
          </div>
        </div>
      </ContentWrapper>
    </>
  )
}
