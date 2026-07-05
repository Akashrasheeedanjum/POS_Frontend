"use client"

import * as React from "react"
import { Save, X, Calendar, Hash, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllPaymentMethods } from "@/lib/actions/paymentMethods.actions"
import { createTicket, updateTicket } from "@/lib/actions/sales.actions"
import { getActivePriceCategory } from "../Helper/activePriceCategory"
import { useRouter } from "next/navigation"
import { useSession } from "@clerk/nextjs"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/Redux/store"
import { clearSelectedDocument } from "@/app/Redux/Slices/newDocuments/documentSlice"
import { ar } from "date-fns/locale"

type PaymentMethod = string;

interface Payment {
  id: string
  // methodId: string
  methodName: string
  amount: number
  date: string
}

export interface SaveDocumentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode?: "create" | "edit";
  ticket?: any;
  selectedTab?: any
  selectedCustomer?: any
  selectedCustomerUpdate?: any
  lineItems?: any
  total: number
  docNo?: string | number
  customer?: { name: string; address?: string }
  createdAt?: Date
}

function formatAmount(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function clampTo2(n: number) {
  return Math.round(n * 100) / 100
}

export function SaveDocument({
  open, setOpen,
  mode,
  ticket,
  total,
  docNo = "—",
  customer = { name: "", address: "" },
  createdAt = new Date(),
  selectedTab,
  selectedCustomerUpdate,
  selectedCustomer,
  lineItems
}: SaveDocumentProps) {

  const { session } = useSession();
  const token: any = session?.user?.publicMetadata?.token
  // console.log("selectedTab Props ", selectedTab)
  // console.log("selectedCustomer props ", selectedCustomer)
  // console.log("lineItems props ", lineItems)
  // const [open, setOpen] = React.useState(false)
  const [paymentMethods, setPaymentMethods] = React.useState<{ key: string; label: string }[]>([])
  const [loadingMethods, setLoadingMethods] = React.useState(false)
  // Calculator + payment entry state
  const [method, setMethod] = React.useState<PaymentMethod>("")
  const [entry, setEntry] = React.useState<string>("0")
  const [payDate, setPayDate] = React.useState<string>(new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = React.useState(false);
  // Preferences
  const [printOn, setPrintOn] = React.useState(true)
  const [drawerOn, setDrawerOn] = React.useState(false)
  const dispatch = useDispatch<AppDispatch>();
  // Committed split-payments
  const [payments, setPayments] = React.useState<Payment[]>([])
  const [paymentsendpoint, setPaymentEndpoint] = React.useState<Payment[]>([])

 
  const [paymentsOpen, setPaymentsOpen] = React.useState(false)

  const paid = React.useMemo(() => clampTo2(payments.reduce((s, p) => s + p.amount, 0)), [payments])
  const remainingBalance =
    mode === "edit"
      ? Number(ticket?.balanceDue ?? 0)
      : total;
 
  const typed = Number.parseFloat(entry || "0")
  const paidPreview = clampTo2(paid + (Number.isFinite(typed) ? typed : 0))
  const leftToPayPreview = Math.max(total - paidPreview, 0)
  const toRenderPreview = Math.min(total - paidPreview, 0)
  const finalCustomer =
    mode === "edit"
      ? selectedCustomerUpdate
      : customer;
  console.log("finalCustomer in save--.", finalCustomer)
  const router = useRouter();
  React.useEffect(() => {
    const fetchMethods = async () => {
      setLoadingMethods(true)
      try {
        const res = await getAllPaymentMethods()
        // Map backend data into the required shape
        const mapped = res.map((m: any) => ({
          key: m._id,
          label: m.name,
        }))
        setPaymentMethods(mapped)
      } catch (error) {
        console.error("Error loading payment methods:", error)
      } finally {
        setLoadingMethods(false)
      }
    }

    fetchMethods()
  }, [])
  React.useEffect(() => {
    if (mode === "edit" && ticket) {
      // backend se aayi hui payments ko frontend state me set karo
      const initialPayments: Payment[] = ticket.paymentMethods.map((p: any) => ({
        id: p.paymentMethod_id,
        methodName: p.paymentMethod_name,
        amount: p.paymentAmount,
        date: new Date(p.paymentDate).toISOString().slice(0, 10),
      }));
      setPayments(initialPayments);
    }
  }, [mode, ticket]);

  const parseEntry = () => {
    const v = Number.parseFloat(entry || "0")
    return Number.isFinite(v) ? clampTo2(v) : 0
  }

  const quickAdd = (val: number) => {
    const current = parseEntry()
    const next = clampTo2(current + val)
    setEntry(String(next))
  }

  const setEntryToTotal = () => {
    setEntry(String(clampTo2(leftToPayPreview)))
    queueMicrotask(() => {
      document.getElementById("entry")?.focus()
    })
  }

  const addPayment = () => {
    const amt = parseEntry()
    if (!amt || amt <= 0) return
    const alreadyPaid = payments.reduce((s, p) => s + p.amount, 0);
    const totalPayable = ticket?.totalAmount_VatIncluded || total;
    console.log(" amt + alreadyPaid", amt + alreadyPaid, amt)
    console.log("totalPayable", totalPayable)
    // if (amt + alreadyPaid > totalPayable) {
    //   alert("Payment exceeds remaining balance");
    //   return;
    // }
    // if (amt + alreadyPaid > remainingBalance) {
    //   alert("Payment exceeds remaining balance");
    //   return;
    // }
    const selectedMethod = paymentMethods.find((m) => m.key === method);
    const p: Payment = {
      id: method,
      // methodId: method,
      methodName: selectedMethod ? selectedMethod.label : method, // fallback if not found
      amount: amt,
      date: payDate,
    }
setPaymentEndpoint([p])
    setPayments((prev) => [...prev, p])
    setEntry("0") // reset for next split
  }

  const clearAll = () => {
    setPayments([])
    setEntry("0")
  }

  const removePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id))
  }

  const createdDateStr = createdAt.toISOString().slice(0, 10)

  const handleKey = React.useCallback((k: string) => {
    if (k === "DEL") {
      setEntry((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)))
      return
    }
    if (k === ".") {
      setEntry((prev) => (prev.includes(".") ? prev : prev + "."))
      return
    }
    // only digits 0-9
    if (!/^\d$/.test(k)) return
    setEntry((prev) => (prev === "0" ? k : prev + k))
  }, [])
console.log("LineItems before sending",lineItems)
const paymentssend = mode === "edit" ? paymentsendpoint : payments
  console.log("paymentsendpoint", paymentsendpoint)
  const handleSave = async () => {
    try {
      setLoading(true);
      // 🧾 Build ticket data based on props + state
      const ticketData = {

        receiptType: selectedTab,
        articles:
          lineItems?.map((item: any) => {
            const activeCategory = getActivePriceCategory(item, selectedCustomer)
            return {
              articleId: item._id,
              article_productId: item.productId,
              nameAtPurchase: item.designation,
              quantityAtPurchase: item.quantity,
              articleCategory: mode === "edit" ? item.articleCategory || "" : item.category?.name || "",
              singleUnitPrice_vatExclude: item.unitPriceVatExcl || 0,
              rateOfVat_atPurchase: activeCategory?.vatId?.rate || 0,
              codeOfVat_atPurchase: activeCategory?.vatId?.code || "",
            }
          }) || [],

        // 👇 From payment section
        paymentMethods:
          paymentssend?.map((p: any) => ({
            paymentMethod_id: p.id,
            paymentMethod_name: p.methodName,
            paymentAmount: p.amount,
          })) || [],

      
        dueDate: payDate,
      }
      const CreateTicketPayload = {
        ...ticketData,
        customer: selectedCustomer?._id || null,
        perceivedAmount: paid,
      }
      const EditTicketPayload = {
        ...ticketData
      }
      console.log("🧾 Ticket Data Ready To Send:", EditTicketPayload)
      let response;
      // 🟢 CREATE MODE
      // ==========================
      if (mode !== "edit") {
        response = await createTicket(CreateTicketPayload, token);
        alert("Ticket created successfully!");
      }
      // 🔵 EDIT MODE
      // ==========================
      else {
        if (!ticket?._id) {
          alert("Ticket ID missing");
          return;
        }

        response = await updateTicket(
          ticket._id,   // 👈 backend expects :id
          EditTicketPayload,
          token
        );

        alert("Ticket updated successfully!");
      }
      console.log("✅ API RESPONSE:", response);
      // 👇 Redirect user to your route
      dispatch(clearSelectedDocument());
      setOpen(false);
      router.push("/folder/documentAndSales/documents");

    } catch (error) {
      console.error("❌ Error creating ticket:", error);
      alert("Failed to create ticket. Check console for details.");
    } finally {
      setLoading(false);
    }
  }
  const handleCancel = () => {
    if (mode === "edit") {
      dispatch(clearSelectedDocument());

      console.log("Clear all data", ticket)
    }
    else {
      console.log("Not clear on create time ")
    }

  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent className="h-[calc(100dvh-52px)] max-w-[1100px] lg:max-w-[1200px] p-0 overflow-y-auto">
        <DialogHeader className="px-4 sm:px-6 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base sm:text-lg">Saving the document</DialogTitle>
            <DialogClose asChild>

            </DialogClose>
          </div>
        </DialogHeader>

        <div className="px-4 sm:px-6 pb-5">
          {/* Top meta */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <Card className="lg:col-span-7 p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <Label htmlFor="docNo" className="text-xs">
                    Document Nº
                  </Label>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <Input id="docNo" value={String(docNo)} readOnly disabled className="h-9 cursor-not-allowed" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="date" className="text-xs">
                    Date
                  </Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={createdDateStr}
                      readOnly
                      disabled
                      className="h-9 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <Label className="text-xs">Term</Label>
                  <Select defaultValue="cash">
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Payment term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash payment</SelectItem>
                      <SelectItem value="net-7">Net 7</SelectItem>
                      <SelectItem value="net-15">Net 15</SelectItem>
                      <SelectItem value="net-30">Net 30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Total amount</Label>
                  <div className="rounded-md border p-2">
                    <p className="text-xl font-semibold text-primary">{formatAmount(total)}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Left to pay</Label>
                  <div className="rounded-md border p-2">
                    <p className="text-xl font-semibold text-primary">{formatAmount(leftToPayPreview)}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">To render</Label>
                  <div className="rounded-md border p-2">
                    <p
                      className={`text-xl font-semibold ${toRenderPreview < 0 ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {formatAmount(toRenderPreview)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-5 p-4">
              <Label className="text-xs">Customers</Label>
              <div className="mt-2 rounded-md border p-3">
                <p className="font-medium">{finalCustomer?.name}</p>
                {finalCustomer?.address ? <p className="text-sm text-muted-foreground">{finalCustomer?.address}</p> : null}
              </div>
            </Card>
          </div>

          {/* Main area */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: calculator + methods */}
            <Card className="lg:col-span-7 p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Calculator */}
                <div className="md:col-span-5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="entry" className="text-xs">
                      Payment method
                    </Label>
                    <button
                      type="button"
                      onClick={setEntryToTotal}
                      className="rounded-md bg-accent text-foreground/90 px-2 py-1 text-xs hover:opacity-90"
                      title="Use total in calculator"
                      aria-label="Use total in calculator"
                    >
                      Total: {formatAmount(leftToPayPreview)}
                    </button>
                  </div>
                  <Input
                    id="entry"
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    inputMode="decimal"
                    className="mt-1.5 h-10"
                  />

                  {/* Keypad */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "DEL"].map((k) => (
                      <Button
                        key={k}
                        variant="secondary"
                        type="button"
                        className="h-12"
                        onClick={() => handleKey(k)}
                        aria-label={`Key ${k}`}
                      >
                        {k}
                      </Button>
                    ))}
                  </div>

                  {/* Quick adds */}
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <Button variant="outline" type="button" onClick={() => quickAdd(10)}>
                      +10
                    </Button>
                    <Button variant="outline" type="button" onClick={() => quickAdd(20)}>
                      +20
                    </Button>
                    <Button variant="outline" type="button" onClick={() => quickAdd(50)}>
                      +50
                    </Button>
                  </div>
                </div>

                {/* Methods list */}
                <div className="md:col-span-7">
                  <Label className="text-xs">Choose a method</Label>
                  <div className="mt-1.5 grid grid-cols-2 gap-3">
                    {loadingMethods ? (
                      <p className="text-sm text-muted-foreground col-span-2">Loading payment methods...</p>
                    ) : paymentMethods.length === 0 ? (
                      <p className="text-sm text-muted-foreground col-span-2">No payment methods found</p>
                    ) : (
                      paymentMethods.map(({ key, label }) => {
                        const active = method === key
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setMethod(key as PaymentMethod)}
                            className={[
                              "flex items-center justify-between rounded-md border p-3 text-left transition-colors",
                              active ? "bg-accent" : "hover:bg-accent/50",
                            ].join(" ")}
                            aria-pressed={active}
                            title={label}
                          >
                            <span className="flex items-center gap-2 font-medium">{label}</span>
                            <Plus className="h-4 w-4 text-muted-foreground" />
                          </button>
                        )
                      })
                    )}

                  </div>
                </div>
              </div>
            </Card>

            {/* Right: add payment + summary */}
            <Card className="lg:col-span-5 p-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="check" className="text-xs">
                    No. Check / Part
                  </Label>
                  <Input id="check" placeholder="Optional reference" className="h-9" />
                </div>
                <div>
                  <Label htmlFor="paydate" className="text-xs">
                    Payment date
                  </Label>
                  <Input
                    id="paydate"
                    type="date"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={addPayment} className="h-10 flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Add payment
                  </Button>

                  {/* "Blue box" showing payment count; opens nested modal */}
                  <button
                    type="button"
                    aria-label="View payments"
                    onClick={() => setPaymentsOpen(true)}
                    className="h-10 w-14 rounded-md bg-primary text-primary-foreground font-semibold"
                    title="View payments"
                  >
                    {payments.length}
                  </button>
                </div>

                {/* Running total display (paid) */}
                <div className="mt-1 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Paid (committed)</span>
                    <span className="text-lg font-semibold">{formatAmount(paid)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Including current entry</span>
                    <span className="text-lg font-semibold">{formatAmount(paidPreview)}</span>
                  </div>
                </div>

                <Separator className="my-1" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">To pay</span>
                  <span className="text-2xl font-semibold">{formatAmount(leftToPayPreview)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Footer controls */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            <Card className="lg:col-span-7 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between md:justify-start gap-3">
                  <div>
                    <p className="text-sm font-medium">Print</p>
                    <p className="text-xs text-muted-foreground">Enable print after save</p>
                  </div>
                  <Switch checked={printOn} onCheckedChange={setPrintOn} aria-label="Toggle print" />
                </div>
                <div className="flex items-center justify-between md:justify-start gap-3">
                  <div>
                    <p className="text-sm font-medium">Cash drawer</p>
                    <p className="text-xs text-muted-foreground">Open after save</p>
                  </div>
                  <Switch checked={drawerOn} onCheckedChange={setDrawerOn} aria-label="Toggle cash drawer" />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="w-full bg-transparent" onClick={clearAll}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </Card>

            <div className="lg:col-span-5 flex items-center justify-between gap-3">
              <DialogClose asChild>
                <Button variant="outline"
                  className="w-1/2 bg-transparent"
                  onClick={handleCancel}>
                  Cancel
                </Button>
              </DialogClose>
              <Button className="w-1/2" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

        </div>
      </DialogContent>

      {/* Nested dialog for payments table */}
      <Dialog open={paymentsOpen} onOpenChange={setPaymentsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payments</DialogTitle>
          </DialogHeader>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No payments yet
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.date}</TableCell>
                      <TableCell>{p.methodName}</TableCell>
                      <TableCell className="text-right">{formatAmount(p.amount)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePayment(p.id)}
                          aria-label="Remove"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total paid</span>
            <span className="font-semibold">{formatAmount(paid)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Left to pay</span>
            <span className="font-semibold">{formatAmount(leftToPayPreview)}</span>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

export default SaveDocument
