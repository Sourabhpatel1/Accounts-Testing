import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const res = await fetch(apiUrls.sales + "invoices")
        const orderRes = await fetch(apiUrls.sales + "orders")
        const cusRes = await fetch(apiUrls.customer)
        const itemRes = await fetch(apiUrls.inventory)
        const termsRes = await fetch(apiUrls.terms + "si")

        const invoices = await res.json();
        const orders = await orderRes.json();
        const customers = await cusRes.json();
        const inventory = await itemRes.json();
        const terms = await termsRes.json();

        if (res.ok && cusRes.ok && itemRes.ok && termsRes.ok) {
            return {
                status : true,
                invoices : invoices,
                orders : orders,
                customers : customers,
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