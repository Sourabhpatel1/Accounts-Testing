import { writable } from 'svelte/store'

export let receiptVoucher = writable(
    {
       "receipt_voucher" : {
            doc_date : "",
            doc_prefix : "Rec.V-",
            doc_number : "",
            doc_type : "",
            narration : ""
       },
       "receipt_request" : {
            receipt_account_id : "",
            customer_id : "",
            si_id : "",
            amount : ""
       }
    }
)