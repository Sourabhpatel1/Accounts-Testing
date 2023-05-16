/** @type {import('./$types').PageServerLoad} */

import { apiUrls } from '$lib/utils/urls';

export async function load({ fetch }) {
    try {
        const res = await fetch(apiUrls.accounts)
        const accounts = await res.json()
        
        if (res.ok) {
            return {
                status : true,
                primary : accounts.primary_accounts,
                group : accounts.group_accounts,
                sub : accounts.sub,
                accounts : accounts.accounts,
            }
        }
        return {
            staus : false,
            message : accounts.detail
        }
    } catch (error) {
        console.log(error)
    }
}