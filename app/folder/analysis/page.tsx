import React from 'react'
// import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const Page = () => {
// const session = await auth();

    redirect('/folder/analysis/dashboard');

}

export default Page
