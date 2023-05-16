import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const res = await fetch(apiUrls.taxes)
    const taxes = await res.json()
    if (res.ok) {
        return {
            status : true,
            taxes : taxes
        }
    }
    return {
        status : false,
        message : "Failed to load date from the server."
    }
}