import ReduxProvider from '@/app/Redux/provider'
import React from 'react'
import MainContent from './_components/MainContent'

const Page = () => {
  return (
    <ReduxProvider>
      <MainContent />
    </ReduxProvider>
  )
}

export default Page
