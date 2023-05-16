import {apiUrls} from '$lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const res = await fetch(apiUrls.accounts)
        const accounts = await res.json()
        if (res.ok) {
            return {
                status : true,
                accounts : accounts
            }
        }
        return {
            status : false,
            message  : "Failed to load data from the server."
        }
    } catch (error) {
        console.log(error)
    }
}