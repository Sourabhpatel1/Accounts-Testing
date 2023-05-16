import { apiUrls } from "$lib/utils/urls";

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const unitRes = await fetch(apiUrls.inventory + "units/")
        const taxRes = await fetch(apiUrls.taxes)
        // const invRes = await fetch(apiUrls.inventory)
        
        // const inventory = await invRes.json()
        const units = await unitRes.json()
        const taxes = await taxRes.json()
        
        if (unitRes.ok && taxRes.ok) {
            return {
                status : true,
                units : units,
                taxes : taxes
            }
        }
        return {
            status : false,
            message : "Failed to fetch data from the database."
        }
        
    } catch (error) {
        console.log(error)
    }
}