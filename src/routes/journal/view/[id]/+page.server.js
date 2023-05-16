import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
    try {
        const res = await fetch(apiUrls.journal + params.id)
        const journal = await res.json()
        if (res.ok) {
            return {
                status : true,
                journal : journal
            }
        }
        return {
            staus : false,
            message : journal.detail
        }
    } catch (error) {
        console.log(error)
    }
}