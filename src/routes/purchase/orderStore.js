import { writable } from 'svelte/store'

export let po = writable(
    {
        'doc_date' : '',
        'doc_number' : '',
        'vendor_id' : '',
        'state_type' : '',
        'terms_id' : '',
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