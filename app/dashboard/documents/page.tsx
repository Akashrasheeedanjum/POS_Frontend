import React from 'react'
import NewDocuments from './_components/NewDocuments'
import ReduxProvider from '@/app/Redux/provider'

const page = () => {
  return (
    <ReduxProvider>
      <NewDocuments />
    </ReduxProvider>
  )
}

export default page