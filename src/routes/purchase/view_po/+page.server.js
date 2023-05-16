import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const poRes = await fetch(apiUrls.purchase + "orders")
    const invRes = await fetch(apiUrls.inventory)   
    const taxRes = await fetch(apiUrls.taxes)
    const venRes = await fetch(apiUrls.vendor)

    const orders = await poRes.json();
    const inventory = await invRes.json();
    const taxes = await taxRes.json();
    const vendors = await venRes.json()

    if (poRes.ok && invRes.ok && taxRes.ok && venRes.ok) {
        return {
            status : true,
            orders : orders,
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

