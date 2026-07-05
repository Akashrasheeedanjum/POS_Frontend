 "use client"
import ReduxProvider from "@/app/Redux/provider";
import InvoiceInterface from "../_components/invoice-interface";
import { useSelector } from "react-redux";

function EditDocumentContent() {
  // Ye ab ReduxProvider ke andar chalega
  // const selectedDocument = useSelector((state: any) => state.newdocument.selectedDocument);
  // console.log("selectedDocument in invoice-interface ", selectedDocument);

  return (
    <InvoiceInterface
      isEditMode={true}
      // initialData={selectedDocument}
    />
  );
}
export default function EditDocumentPage() {
  return (
    <ReduxProvider>
      <EditDocumentContent/>
    </ReduxProvider>
  )

}

// Route redirect se pehly ye tha 17/10/2025