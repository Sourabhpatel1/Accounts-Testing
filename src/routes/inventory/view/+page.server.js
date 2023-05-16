import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load( { fetch } ) {
    try {
        const res = await fetch(apiUrls.inventory)
        const stocksRes = await fetch(apiUrls.inventory + "stocks/")

        const inventory = await res.json()
        const stocks = await stocksRes.json() 

        if (res.ok && stocksRes.ok) {
            return {
                status : true,
                inventory : inventory,
                stocks : stocks
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