import ReduxProvider from "@/app/Redux/provider"
import MainContent from "./_components/MainContent"

export default function POSSystem() {

  return (
    <>
      <ReduxProvider>
      <MainContent />
      </ReduxProvider>
    </>
  )
}
