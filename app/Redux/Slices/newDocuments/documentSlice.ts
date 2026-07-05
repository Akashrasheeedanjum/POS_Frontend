// src/app/Redux/Slices/documentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clear } from "console"
import { set } from "date-fns";

interface SelectedTab {
    id: string;
    name: string;
}
interface DocumentState {
    selectedTab: SelectedTab
    selectedCustomer: any
    selectedDocument: any
}

const initialState: DocumentState = {
    selectedTab: { id: "invoice", name: "Invoice" },
    selectedCustomer: null,
    selectedDocument: null,
}

const documentSlice = createSlice({
    name: "newdocument",
    initialState,
    reducers: {
        setSelectedTab(state, action: PayloadAction<SelectedTab>) {
            state.selectedTab = action.payload
        },
        setSelectedCustomer(state, action: PayloadAction<any | null>) {
            state.selectedCustomer = action.payload
        },
        clearSelectedCustomer(state) {
            state.selectedCustomer = null
        },
        setSelectedDocument(state, action: PayloadAction<any>) {
            state.selectedDocument = action.payload
        },
        clearSelectedDocument(state) {
            state.selectedDocument = null
        }
    },
})

export const { setSelectedTab, setSelectedCustomer, clearSelectedCustomer,setSelectedDocument,clearSelectedDocument } = documentSlice.actions
export default documentSlice.reducer
