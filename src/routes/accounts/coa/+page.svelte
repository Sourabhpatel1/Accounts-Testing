<script>
    import { apiUrls } from '$lib/utils/urls'
    import { post } from '$lib/utils/helpers'
    import Alert from '$lib/components/Alert.svelte';
    import { onMount } from 'svelte';

    export let data;

    let primary = data.primary;
    let group = data.group;
    let sub = data.sub;
    let accounts = data.accounts;
    let balances = [];

    let loaded = false;

    onMount(async () => {
        await accounts.forEach(async a=>{
            const bRes = await fetch(apiUrls.accounts + "account_balances/" + a.id)
            const balance = await bRes.json()
            if (bRes.ok) {
                console.log(balance)
                balances = [...balances, balance]
            }
        })
        loaded = true
        console.log(loaded)
    })

    let selectedPrimary = 1;
    let selectedGroup = 10;
    let selectedSub = 100;

    let subGroupName;
    let accountName;

    let addingAccount = false;
    let addingAccountTo = null;

    let showAlert = false;

    let error;
    let message;

    const refetch = async () => {
        try {
            const res = await fetch(apiUrls.accounts)
            const a = await res.json()
            let balances = [];
            a.accounts.forEach(async acc=>{
                const res = await fetch(apiUrls.accounts + "account_balances/" + acc.id)
                const balance = await res.json()
                if (res.ok) {
                    balances.push(balance)
                }
            })
            if (res.ok) {
                    primary = a.primary_accounts;
                    group = a.group_accounts;
                    sub = a.sub;
                    accounts = a.accounts;
                    balances = balances;
                    addingAccount = false;
                    addingAccountTo = null;
            } else {
                error = true;
                message = accounts.detail;
                showAlert = true;
                return
            }
        } catch (err) {
            console.log(err)
        }
    }

    const dismissAlert = ()=>{
        if (!error) {
            accountName = "";
            refetch();
            showAlert = false;
        } else {
            showAlert = false;
        }
    }

    const addAccount = async ()=>{
        if (!accountName || accountName.length < 2) {
            error = true;
            message = "Account name must  be atleast 2 characters long ans can not be empty."
            showAlert = true;
            return
        }
        try {
            const r= await post(apiUrls.addAccount, {
                name : accountName,
                sub_group_id : selectedSub
            })
            if (r.status) {
                error = false;
                message = `Account ${accountName} created succesfully.`
                showAlert = true;
            } else {
                error = true;
                message = r.response.detail
                showAlert = true;
            }
        } catch (error) {
            console.log(error)
        }
    }

</script>

{#if showAlert}
    <Alert {message} {error} on:close={()=>{dismissAlert()}}/>
{/if}
{#if  loaded}
<section class="flex flex-col">
    <div class="header">
        <h4>Charts of Accounts</h4>
    </div>
    <div class="coa">
        <div class="primary">
            <div class="header">
                <h5>Primary Accounts</h5>
            </div>
            <div class="accounts">
                {#each primary as p}
                    <button
                        class="{selectedPrimary === p.id?'active':''}" 
                        on:click={()=>{selectedPrimary=p.id; selectedGroup=p.id*10; selectedSub=selectedGroup*10}}
                    >
                        {p.name}
                    </button>
                {/each}
            </div>
        </div>
        <div class="group">
            <div class="header flex-sb">
                <h5>Group Accounts</h5>
            </div>
            <div class="accounts">
                {#each group as g}
                    {#if g.primary_account_id === selectedPrimary}
                        <button
                            class="{selectedGroup===g.id?'active':''}" 
                            on:click={()=>{selectedGroup=g.id; selectedSub=selectedGroup*10}}
                        >
                            {g.name}
                        </button>
                    {/if}
                {/each}
            </div>
        </div>
        <div class="sub">
            <div class="header flex-sb">
                <h5>Accounts Sub Groups</h5>
            </div>
            <div class="accounts">
                {#each sub as s}
                    {#if s.group_account_id === selectedGroup}
                        <button
                            class="{selectedSub===s.id?'active':''}" 
                            on:click={()=>{selectedSub=s.id;}}
                        >
                            {s.name}
                        </button>
                    {/if}
                {/each}
            </div>
        </div>
        <div class="account">
            <div class="header flex-sb">
                <h5>Accounts</h5>
                    <button 
                        class="flex-cc"
                        on:click={()=>{
                            addingAccount = true;
                            addingAccountTo = selectedSub;
                        }}
                    >
                        + add account
                    </button>
            </div>
            <div class="accounts">
                {#if addingAccount && addingAccountTo === selectedSub} 
                    <div class="add">
                        <input type="text" placeholder="Enter Account Name" bind:value={accountName}>
                        <button class="flex-cc add-btn" on:click={addAccount}>+</button>
                        <button class="flex-cc cancel-btn" on:click={()=>{addingAccount=false}}>X</button>
                    </div>
                {/if}
                {#each accounts as a}
                    {#if a.sub_group_id === selectedSub}
                        <button>
                        <span>
                            {a.name} 
                        </span>
                        {#if a.id}
                            <span style="text-align:right;">
                                {balances.filter(acc=>a.id == acc.id)[0]?.balance.toFixed(3) || "0.00"}
                            </span>
                        {/if}
                        {#if a}
                            <span style="text-align:right;">
                                {balances.filter(acc=>a.id == acc.id)[0]?.type || "-"}
                            </span>
                        {/if}
                        </button>
                    {/if}
                {/each}
            </div>
        </div>
    </div>
</section>
{:else}
    <h1>Loading ...</h1>
{/if}
        
<style>
    section {
        width: 100%;
        padding: 1rem;
        gap: 1rem;
    }
    section > .header {
        padding: .5rem 1rem;
    }
    section .header h4 {
        width: 100%;
        text-align: center;
    }
    .coa {
        width: 100%;
        padding: .5rem 1rem;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
    .coa .header {
        width: 95%;
        margin: 0 auto;
        margin-top: 5px;
        padding: .5rem 1rem;
        text-align: left;
        /* color: var(--wheat); */
        background: var(--white);
        box-shadow: var(--bsm);
        border-radius: var(--radius);
    }
    .coa .header button {
        height: 24px;
    }
    .coa .header button,
    .add button {
        font-size: .9rem;
        font-weight: 600;
        color: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--bss);
        background: var(--ok);
    }
    .add button {
        height: 35px;
    }
    .primary,
    .group,
    .sub,
    .account {
        max-height: 800px;
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: scroll;
    }
    .primary .header,
    .group .header,
    .sub .header,
    .account .header {
        position: sticky;
        top: 0;
    }
    .accounts {
        display: grid;
        gap: .5rem;
    }
    .accounts button {
        width: 95%;
        margin: 0 auto;
        padding: .5rem 1rem;
        font-size: .9rem;
        text-align: left;
        background: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--bsl);
    }
    .accounts button:active {
        transform: scale(1);
    }
    .account .accounts > button {
        width: 100%;
        display: grid;
        grid-template-columns: 7fr 3fr 1fr;
    }
    .add {
        width: 95%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 6fr 2fr 2fr;
        gap: .5rem;
        align-content: center;
    }
    .add .add-btn {
        background: var(--ok);
        color: var(--white);
    }
    .add .cancel-btn {
        background: var(--warning);
        color: var(--white);
    }
    .active {
        color: var(--white);
        background: var(--primary) !important;
    }
</style>