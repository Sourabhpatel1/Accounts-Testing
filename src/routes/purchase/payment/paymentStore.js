import { writable } from 'svelte/store'

export let paymentVoucher = writable(
    {
       payment_voucher : {
            doc_date : "",
            doc_prefix : "Pay.V-",
            doc_number : "",
            doc_type : "",
            narration : ""
       },
       "payment_request" : {
            payment_account_id : "",
            vendor_id : "",
            pi_id : "",
            amount : ""
       }
    }
)