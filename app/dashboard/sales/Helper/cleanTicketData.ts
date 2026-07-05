import { CartItem } from "@/types/sales"

export function getDueDate(){
const currentDate = new Date();

// Add 2 days
currentDate.setDate(currentDate.getDate() + 2);

// Format to yyyy-mm-dd
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
const day = String(currentDate.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`;
return formattedDate
}

export function cleanTicketData(data:any){

const ticketData:any = {}

ticketData.receiptType = data.receiptType

ticketData.articles =  data.cartItems?.map((item:CartItem) => {
    return{
          articleId: item.articleId,
          article_productId: item.article_productId,
          nameAtPurchase: item.nameAtPurchase,
          quantityAtPurchase: item.quantityAtPurchase,
          singleUnitPrice_vatExclude: item.singleUnitPrice_vatExclude,
          rateOfVat_atPurchase: item.rateOfVat_atPurchase,
          codeOfVat_atPurchase: item.codeOfVat_atPurchase,
          articleCategory: item.articleCategory
    }
})

ticketData.paymentMethods = data.paymentMethods
ticketData.customer = data.customer
ticketData.perceivedAmount = data.receivedAmount

if(data.dueDate) ticketData.dueDate = data.dueDate
if(data.status) ticketData.status = data.status
if(data.register) ticketData.register = data.register

return ticketData


}