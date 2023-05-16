import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
    try {
        const piId = params.id
        const res = await fetch(apiUrls.purchase + "invoice/" + piId)
        const invoice = await res.json()
        if (res.ok) {
            return {
                status : true,
                invoice : invoice
            }
        }
        return {
            status : false,
            message : "Failed to load data from the server."
        }
    } catch (error) {
        console.log(error)
    }
}