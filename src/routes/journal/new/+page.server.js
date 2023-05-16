import { apiUrls } from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const jRes = await fetch(apiUrls.journal)
        const aRes = await fetch(apiUrls.accounts)
        const journalRes = await jRes.json()
        const accRes = await aRes.json()
        if (jRes.ok && aRes.ok) {
            return {
                status : true,
                journals : journalRes,
                accounts : accRes.accounts
            }
        }
        return {
            status : false,
            message : journalRes.detail
        }
    } catch (error) {
        console.log(error)
    }
}