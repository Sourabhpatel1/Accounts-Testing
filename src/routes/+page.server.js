import { apiUrls } from '../lib/utils/urls'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const liquidityRes = await fetch(apiUrls.dash + "liquidity")
    const profitRes = await fetch(apiUrls.dash + "profitability")
    const debtRes = await fetch(apiUrls.dash + "debt")
    const cashRes = await fetch(apiUrls.dash + "cash_data")
    const itemRes = await fetch(apiUrls.dash + "item_quantity")
    const partyRes = await fetch(apiUrls.dash + "party_data")


    const lRatio = await liquidityRes.json()
    const pRatio = await profitRes.json()
    const dRatio = await debtRes.json()
    const cash_data = await cashRes.json()
    const items = await itemRes.json()
    const party_data = await partyRes.json()

    const cIn = cash_data.c_dr
    const cOut = cash_data.c_cr
    const bIn = cash_data.b_dr
    const bOut = cash_data.b_cr

    if (liquidityRes.ok && profitRes.ok && debtRes.ok && cashRes.ok) {
        return {
            status : true,
            ratio : {
                l : lRatio,
                p : pRatio,
                d : dRatio,
            },
            cash : {
                cIn : cIn,
                cOut : cOut,
                bIn : bIn,
                bOut : bOut
            },
            items : items,
            party : party_data
        }
    }
    return {
        status : false,
        message : "Failed to fetch data from the server."
    }
}

