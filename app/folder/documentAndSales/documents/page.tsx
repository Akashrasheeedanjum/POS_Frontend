import React from 'react'
import MainContent from './_components/MainContent'
import ReduxProvider from '@/app/Redux/provider'
const Page = () => {
  return (
    <>
    <ReduxProvider>
      <MainContent />
    </ReduxProvider>
    </>
  )
}

export default Page
