import { AnimatedText } from '@/components/common/AnimatedText'
import { DataTable } from '@/components/common/DataTable/DataTable'
import { ContentWrapper } from '@/components/layout/ContentWrapper'
import { Sidebar } from '@/components/layout/Sidebar/Sidebar'
import { applicationColumns as columns } from './_table/application/columns'
import { getApplications } from '@/services/applicationService'
import { SearchParams } from '@/types/api'

export default async function Home(props: {
  searchParams: Promise<SearchParams>
}) {
  const resolvedSearchParams = await props.searchParams
  const response = await getApplications(resolvedSearchParams)

  return (
    <>
      <Sidebar />
      <ContentWrapper>
        <div className='flex flex-col h-full'>
          <div className='w-full flex items-center gap-4 p-4 border-b border-gray-300/50 bg-white/50 backdrop-blur-sm'>
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
              className='h-full'
              estimateRowHeight={52}
            />
          </div>
        </div>
      </ContentWrapper>
    </>
  )
}
