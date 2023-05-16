import { writable } from 'svelte/store'

export let journal  = writable({
    doc_date : "",
    doc_prefix : "",
    doc_number : "",
    doc_type : "",
    narration : ""
})

export let masterEntry = writable({
    account_id : "",
    account_name : "",
    amount : "",
    entry_type : ""
})

export let entry = writable({
    sr : 1,
    account_id : "",
    amount : "",
    entry_type : "",
    account_name : ""
})

export let entries = writable(
    [
        {
            sr : 1,
            account_id : "",
            amount : "",
            entry_type : "",
            account_name : ""
        }
    ]
)

export let rowErrors = writable([])