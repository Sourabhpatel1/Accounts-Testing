<script>
    import { apiUrls } from  '$lib/utils/urls'

    import Select from 'svelte-select'
    import Alert from '$lib/components/Alert.svelte'

    export let data;

    let accounts = data.accounts.accounts;
    let ledger;
    let entries=[];
    let entriesOriginal=[];
    let debitTotal = 0;
    let creditTotal = 0;
    let balance;
    let balanceType;
    let loaded = false;  

    let message = ""
    let error = false;
    let showAlert = false;

    let startDate;
    let endDate;

    const fetchLedger = async (id) => {
        entries = [];
        debitTotal = 0;
        creditTotal = 0;
        balance = 0;
        loaded = false;
        try {
            const res = await fetch(apiUrls.accounts + 'ledger/' + id)
            if (!res.ok) {
                error = true;
                message = "Failed to load ledger. \n" + ledger.detail;
                showAlert = true;
            }
            ledger = await res.json()
            ledger.debits.forEach(entry=>{
                entries.push({...entry, "type" : "dr"})
                debitTotal += entry.amount
            })
            ledger.credits.forEach(entry=>{
                entries.push({...entry, "type" : "cr"})
                creditTotal += entry.amount
            })
            balance = debitTotal - creditTotal;
            balanceType = balance>0?"Debit":balance<0?"Credit":""
            entries.sort((a,b)=>{
                if (a.doc_date > b.doc_date) return 1
                if (a.doc_date < b.doc_date) return -1
                if (a.doc_date === b.doc_date) return 0
            })
            entriesOriginal = [...entries]
            loaded = true;
        } catch (error) {
            console.log(error)
        }
    }
    const filter = () => {
        entries = [...entriesOriginal]
        if (startDate) {
            entries = entries.filter(e=>e.date.split("T")[0]>=startDate)

        }
        if (endDate) {
            entries = entries.filter(e=>e.date.split("T")[0]<=endDate)
        }
    }
</script>

{#if showAlert}
    <Alert {error} {message} on:close={()=>{showAlert=false}} />
{/if}
<section class="flex flex-col">
    <div class="header">
        <h4>Ledgers</h4>
    </div>
    <div class="filters">
        <div class="group single">
            <label for="account">Select Account</label>
            <Select 
                class="select"
                id="accounts"
                items={accounts}
                itemId="id"
                label="name"
                on:change = {(e)=>{fetchLedger(e.detail.id)}}
                on:clear = {()=>{loaded=false; ledger={};}}
            />
        </div>
        <div class="group">
            <span>Filter By Date</span>
            <div class="field">
                <label for="start">Start Date</label>
                <input type="date" bind:value={startDate} on:change={filter}>
            </div>
            <div class="field">
                <label for="end">End Date</label>
                <input type="date" bind:value={endDate} on:change={filter}>
            </div>
        </div>
    </div>
    {#if loaded}
        <div class="ledger">
            <div class="title">
                <h4>Ledger For {ledger.account.name}</h4>
            </div>
            <div class="header">
                <span>#</span>
                <span>Date</span>
                <span>Account</span>
                <span>Document</span>
                <span class="right">Dr. Amount</span>
                <span class="right">Cr. Amount</span>
            </div>
            <div class="rows">
                {#each entries as entry, i (i+1)}
                    <div class="row">
                        <span>{i+1}</span>
                        <span>{entry.doc_date}</span>
                        <span>{entry.account_name}</span>
                        <span>{entry.doc}</span>
                        <span class="right">{entry.type==="dr"?entry.amount.toFixed(3):""}</span>
                        <span class="right">{entry.type==="cr"?entry.amount.toFixed(3):""}</span>
                    </div>
                {/each}
                <!-- <hr style="width: 50%; margin: 5px auto;"> -->
                <div class="footer">
                    <span>Total</span>
                    <span class="right">{debitTotal.toFixed(3)||""}</span>
                    <span class="right">{creditTotal.toFixed(3)||""}</span>
                </div>
                <div class="balance">
                    <span>Balance</span>
                    <span class="right">{Math.abs(balance).toFixed(3)}</span>
                    <span class="right">{balanceType}</span>
                </div>
            </div>
        </div>
    {/if}
</section>

<style>
    section {
        width: 100%;
        padding: 1rem 0;
        gap: 1rem;
    }
    section > .header {
        padding: .5rem 1rem;
    }
    section .header h4 {
        width: 100%;
        text-align: center;
    }
    .filters {
        width: 60%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    .filters .group {
        width: 100%;
        height: 100%;
        padding: .5rem;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        justify-items: center;
        align-content: center;
        gap: .5rem;
        box-shadow: var(--bsm);
        border-radius: var(--radius);
    }
    .filters .group > label,
    .filters .group span {
        font-size: 1rem;
        grid-column: 1/3;
    }
    .filters .group .field {
        display: flex;
    }
    .ledger {
        width: 100%;
        padding: 1rem;
    }
    .ledger .title {
        width: 100%;
        text-align: center;
    }
    .ledger .header,
    .ledger .rows .row {
        width: 50%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 2fr 6fr 2fr 4fr 4fr;
        align-content: center;
        justify-items: center;
    }
    .ledger .header,
    .ledger .footer {
        font-size: 1rem;
        font-weight: 600;
        padding: .2rem 1rem;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .ledger .rows {
        position: relative;
        height: 68dvh;
        overflow-y: scroll;
    }
    .ledger .row {
        font-size: .9rem;
        font-weight: 500;
        padding: .1rem 1rem;
    }
    .ledger span.right {
        width: 100%;
        text-align: right;
    }
    .footer {
        width: 50%;
        margin: 5px auto;
        display: grid;
        grid-template-columns: 11fr 4fr 4fr;
        align-content: center;
        justify-items: center;
    }
    .balance {
        width: 50%;
        margin: 5px auto;
        padding: .1rem 1rem;
        font-size: 1rem;
        font-weight: 500;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
    }
</style>