import { AnimatedText } from '@/components/common/AnimatedText'
import { DataTable } from '@/components/common/DataTable/DataTable'
import { ContentWrapper } from '@/components/layout/ContentWrapper'
import { Sidebar } from '@/components/layout/Sidebar/Sidebar'
import { applicationColumns as columns } from './_table/application/columns'
import { getApplications } from '@/services/applicationService'

export default async function Home() {
  const data = await getApplications()

  return (
    <>
      <Sidebar />
      <ContentWrapper>
        <div className='w-full flex flex-col items-center gap-4 p-4 border-b border-gray-300/50 max-h-full h-auto'>
          <span className='self-start font-semibold'>
            <AnimatedText text='Review Status' lgSize />
          </span>
          <div className='w-full grow flex items-start overflow-hidden'>
            <DataTable
              columns={columns}
              data={data}
              className='h-full border border-gray-200 rounded-lg shadow-sm'
            />
          </div>
        </div>
      </ContentWrapper>
    </>
  )
}
