import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const res = await fetch(apiUrls.purchase + "orders")
        const venRes = await fetch(apiUrls.vendor)
        const itemRes = await fetch(apiUrls.inventory)
        const termsRes = await fetch(apiUrls.terms + "po")

        const orders = await res.json();
        const vendors = await venRes.json();
        const inventory = await itemRes.json();
        const terms = await termsRes.json();

        if (res.ok && venRes.ok && itemRes.ok && termsRes.ok) {
            return {
                status : true,
                orders : orders,
                vendors : vendors,
                inventory : inventory,
                terms : terms
            }
        }
        return {
            status : false,
            message : orders.detail
        }
    } catch (error) {
        console.log(error)
    }
}