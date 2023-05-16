import { writable } from 'svelte/store'

export const item = writable({
    'name' : "",
    'unit_id' : "",
    'gst_input_id' : "",
    'gst_output_id' : "",
    'igst_input_id' : "",
    'igst_output_id' : "",
    'tax_rate' : "",
    'inventory_account_id' : "",
    'item_type' : "",
    "item_category" : ""
})