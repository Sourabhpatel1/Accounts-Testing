import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const res = await fetch(apiUrls.reports + "profit_and_loss")
    const pl = await res.json()
    if (res.ok) {
        return {
            status : true,
            pl : pl
        }
    }
    return {
        status : false,
        message : "Failed to load data from server."
    }
}