import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const poRes = await fetch(apiUrls.terms + "po")
        const piRes = await fetch(apiUrls.terms + "pi")
        const soRes = await fetch(apiUrls.terms + "so")
        const siRes = await fetch(apiUrls.terms + "si")
    
        const poTerms = await poRes.json()
        const piTerms = await piRes.json()
        const soTerms = await soRes.json()
        const siTerms = await siRes.json()
    
        if (poRes.ok && piRes.ok  && soRes.ok && siRes.ok) {
            return {
                poTerms : poTerms,
                piTerms : piTerms,
                soTerms : soTerms,
                siTerms : siTerms
            }
        }
        return {
            status : false,
            message : "Failed to fetch data from the server."
        }
    } catch (error) {
        console.log(error)
    }
}