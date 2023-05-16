import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const res = await fetch(apiUrls.sales + 'invoices')
    const cusRes = await fetch(apiUrls.customer)

    let invoices = await res.json()
    const customers = cusRes.json()

    invoices = invoices.filter(inv=>inv.invoice.transaction_type===3)

    if (res.ok && cusRes.ok) {
        return {
            status : true,
            invoices : invoices,
            customers : customers
        }
    }

    return {
        status : false,
        message : "Failed to fetch data from the server."
    }

}