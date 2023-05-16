import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const piRes = await fetch(apiUrls.purchase + "invoices")
    const invRes = await fetch(apiUrls.inventory)   
    const taxRes = await fetch(apiUrls.taxes)
    const venRes = await fetch(apiUrls.vendor)

    const invoices = await piRes.json();
    const inventory = await invRes.json();
    const taxes = await taxRes.json();
    const vendors = await venRes.json()

    if (piRes.ok && invRes.ok && taxRes.ok && venRes.ok) {
        return {
            status : true,
            invoices : invoices,
            inventory : inventory,
            taxes : taxes,
            vendors : vendors
        }
    }
    return {
        status : false,
        message : "Failed to load data from the server."
    }
}
