"use client"
import React from 'react'
import ReduxProvider from '@/app/Redux/provider'
import CustomerPageContent from './_components/CustomerPageContent'

const Page = () => {
  
  return (
<>
 <ReduxProvider>
<CustomerPageContent />
 </ReduxProvider>
</>
  )
}

export default Page
