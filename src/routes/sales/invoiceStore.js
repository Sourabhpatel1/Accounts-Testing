import { writable } from 'svelte/store'

export let si = writable(
    {
        'doc_date' : '',
        'doc_number' : '',
        'customer_id' : '',
        'state_type' : '',
        'terms_id' : '',
        'so_id' : '',
        'transaction_type' : '',
        'rounded_off' : 0,
        'state_type_object' : ''
    }
)

export let item = {
    'sr' : 1,
    'item_id' : '',
    'unit_name' : '',
    'price' : '',
    'quantity' : '',
    'gst_rate' : '',
    'gst_amount' : '',
    'discount_rate' : '',
    'discount_amount' : '',
    'total' : 0.00
}

export let items = writable(
    [
        {...item}
    ]
)