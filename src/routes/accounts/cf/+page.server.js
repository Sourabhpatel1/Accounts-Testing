import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const res = await fetch(apiUrls.reports + "cash_flow")
    const flow = await res.json()
    if (res.ok) {
        return {
            status : true,
            flow : flow
        }
    }
    return {
        status : false,
        message : "Failed to load data from server."
    }
}