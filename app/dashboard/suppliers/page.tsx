import React from 'react'
import SuppliersPageContent from './_components/SuppliersPageContent'
import ReduxProvider from '@/app/Redux/provider'

const Page = () => {
  return (
    <ReduxProvider>
    <SuppliersPageContent />
    </ReduxProvider>
  )
}

export default Page
