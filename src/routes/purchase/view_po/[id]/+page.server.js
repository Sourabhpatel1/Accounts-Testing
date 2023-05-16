import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
    try {
        const poId = params.id
        const res = await fetch(apiUrls.purchase + "order/" + poId)
        const order = await res.json()
        if (res.ok) {
            return {
                status : true,
                order : order
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