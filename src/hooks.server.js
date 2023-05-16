import { apiUrls } from './lib/utils/urls'
import { redirect } from '@sveltejs/kit'

export async function handle ({ event, resolve }) {
    
    const allRes = await fetch(apiUrls.business + "all")
    const activeRes = await fetch(apiUrls.business)

    const businesses = await allRes.json()
    const active = activeRes.json()
    
    if (businesses?.length <= 0 && event.route.id !== "/settings/business/new") {
        throw redirect(303, "/settings/business/new")
    }
    
    if (!active && event.route.id !== "/settings/business/select") {
        throw redirect(303, "/settings/business/select")
    }
    
    const response = await resolve(event)

    return response

}