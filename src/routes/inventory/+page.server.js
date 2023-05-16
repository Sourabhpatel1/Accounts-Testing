import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load( { fetch } ) {
    try {
        const res = await fetch(apiUrls.inventory)
        const inventory = await res.json()
        if (res.ok) {
            return {
                status : true,
                inventory : inventory
            }
        }
        return {
            status : false,
            message : inventory.detail
        }
    } catch (error) {
        console.log(error)
    }
}