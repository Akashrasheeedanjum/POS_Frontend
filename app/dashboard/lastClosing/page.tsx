import ReduxProvider from '@/app/Redux/provider';
import MainContent from './_components/MainContent';

const Page = () => {


  return (
    <ReduxProvider>
    <MainContent />
    </ReduxProvider>
  )
}

export default Page
