import { writable } from 'svelte/store'

export const party = writable(
   {
    'Customer' : {
            "name" : "",
            "gst" : "",
            "phone" : "",
            "email" : "",
            "street_address" : "",
            "city" : "",
            "state" : "",
            "country" : "",
            "postal_code" : ""
        },
    'Vendor' : {
            "name" : "",
            "gst" : "",
            "phone" : "",
            "email" : "",
            "street_address" : "",
            "city" : "",
            "state" : "",
            "country" : "",
            "postal_code" : ""
        }
    }
)