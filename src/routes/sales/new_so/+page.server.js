import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const res = await fetch(apiUrls.sales + "orders")
        const custRes = await fetch(apiUrls.customer)
        const itemRes = await fetch(apiUrls.inventory)
        const termsRes = await fetch(apiUrls.terms + "so")

        const orders = await res.json();
        const customers = await custRes.json();
        const inventory = await itemRes.json();
        const terms = await termsRes.json();

        if (res.ok && custRes.ok && itemRes.ok && termsRes.ok) {
            return {
                status : true,
                orders : orders,
                customers : customers,
                inventory : inventory,
                terms : terms
            }
        }
        return {
            status : false,
            message : "Failed to fetch data from the server."
        }
    } catch (error) {
        console.log(error)
    }
}