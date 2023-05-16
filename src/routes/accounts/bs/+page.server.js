import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const res = await fetch(apiUrls.reports + "balance_sheet")
    const sheet = await res.json()
    if (res.ok) {
        return {
            status : true,
            sheet : sheet
        }
    }
    return {
        status : false,
        message : "Failed to load data from server."
    }
}