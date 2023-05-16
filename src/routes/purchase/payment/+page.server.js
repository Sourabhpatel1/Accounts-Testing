import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const res = await fetch(apiUrls.purchase + 'invoices')
    const vendorRes = await fetch(apiUrls.vendor)

    let invoices = await res.json()
    const vendors = vendorRes.json()
    invoices = invoices.filter(inv=>inv.invoice.transaction_type===3)
    if (res.ok) {
        return {
            status : true,
            invoices : invoices,
            vendors : vendors
        }
    }

    return {
        status : false,
        message : "Failed to fetch data from the server."
    }

}