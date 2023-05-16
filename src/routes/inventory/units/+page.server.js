import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const res = await fetch(apiUrls.inventory + "units/")
        const units = await res.json()
        if (res.ok) {
            return {
                status : true,
                units : units
            }
        }
        return {
            status : false,
            message : "Failed to load data from server."
        }
    } catch (error) {
        console.log(error)
    }
}