import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const res = await fetch(apiUrls.business + "all")
    const businesses = await res.json()
    
    if (res.ok) {
        return {
            businesses
        }
    }
    return {
        message : "Failed to load data from the server."
    }
}