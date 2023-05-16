import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const custRes = await fetch(apiUrls.customer)
        const venRes = await fetch(apiUrls.vendor)
        const customers = await custRes.json()
        const vendors = await venRes.json()

        if (custRes.ok && venRes.ok) {
            return {
                status : true,
                customers : customers,
                vendors : vendors
            }
        }
        return {
            status : false,
            message : !custRes.ok ? customers.detail : !venRes.ok ? vendors.detail : "Failed to fetch data from server."
        }
    } catch (error) {
        console.log(error)
    }
}