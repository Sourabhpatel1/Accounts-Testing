import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const res = await fetch(apiUrls.journal)
        const journals = await res.json()
        if (res.ok) {
            return {
                status : true,
                journals : journals
            }
        }
        return {
            status : false,
            message : journals.detail
        }
    } catch (error) {
        console.log(error)
    }
}