import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const siRes = await fetch(apiUrls.sales + "invoices")
    const invRes = await fetch(apiUrls.inventory)   
    const taxRes = await fetch(apiUrls.taxes)
    const cusRes = await fetch(apiUrls.customer)

    const invoices = await siRes.json();
    const inventory = await invRes.json();
    const taxes = await taxRes.json();
    const customers = await cusRes.json()

    if (siRes.ok && invRes.ok && taxRes.ok && cusRes.ok) {
        return {
            status : true,
            invoices : invoices,
            inventory : inventory,
            taxes : taxes,
            customers : customers
        }
    }
    return {
        status : false,
        message : "Failed to load data from the server."
    }
}
