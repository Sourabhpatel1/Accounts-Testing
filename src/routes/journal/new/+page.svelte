<script>
    import Select from 'svelte-select'
    import AddEntries from '$lib/components/AddEntries.svelte';
    import Alert from '$lib/components/Alert.svelte'

    import { emptyObj, keepNumeric, checkEmpty, post } from '$lib/utils/helpers'
    import {masterEntry, entry, entries, journal, rowErrors } from './entrystore'
    import { apiUrls } from '$lib/utils/urls'

    export let data;
    
    const journalNum = data.journals.length + 1;
    const journalTypes = [
        "Journal Voucher",
        "Cash Voucher",
        "Bank Voucher",
        "Debit Note",
        "Credit Note",
        "Contra Voucher",
        "Receipt Voucher",
        "Payment Voucher",
        "Depriciation Voucher",
        "Tax Voucher"
    ]
    const accounts = data.accounts;

    let clear = false;

    let errJournal = {};
    let errMasterEntry = {};

    let showAlert = false;
    let error = false;
    let message = "";

    const clearForm = () => {
        $entries = [{...$entry}]
        $masterEntry = emptyObj($masterEntry)
        $journal = emptyObj($journal)
        $rowErrors = []
        clear = !clear
        errJournal = {}
        errMasterEntry = {}
    }

    const updateTotal = ()=>{
        let amount = 0
        $entries.forEach(e=>amount += Number(e.amount))
        $masterEntry.amount = amount
    }

    const save = async () => {
        errJournal = checkEmpty($journal)
        errMasterEntry = checkEmpty($masterEntry)
        $rowErrors = [];
        $entries.forEach(e=>{
            if (Object.keys(checkEmpty(e)).length > 0) {
                $rowErrors = [...$rowErrors, e.sr]
            }
        })
        if (!errJournal == {} || errMasterEntry == {} || $rowErrors.length > 0) {
            error = true;
            message = `Please fill out the fields marked by red background`
            showAlert = true;
            return;
        }
       
        const body = {
            'journal' : $journal,
            'master_entry' : $masterEntry,
            'entries' : $entries
        }
        
        const res = await post(apiUrls.journal, body)

       if (!res.status) {
            error = true;
            message = res.response.detail;
            showAlert = true;
            return;
       } else {
            error = false;
            message = `Journal ${$journal.doc_prefix}${$journal.doc_number} saved succesfully`
            showAlert = true;
            clearForm()
            return;
       }
    }

</script>
{#if showAlert}
    <Alert {error} {message} on:close={()=>{showAlert=false}}/>
{/if}
{#key clear}
<section class="flex flex-col">
    <div class="header flex-sb">
        <h4 class="flex">New Journal <span># {journalNum}</span></h4>
        <div class="actions">
            <button class="clear" on:click={()=>{clearForm()}}>- clear</button>
            <button class="save" on:click={save}>+ save</button>
        </div>
    </div>
    <div class="journal flex flex-col">
        <div class="info">
            <div class="title">
                <h5>Journal Information</h5>
            </div>
            <div class="group {errJournal.doc_type?'error':''}">
                <label for="type">Journal Type</label>
                <Select 
                class="select"
                id="type"
                items={journalTypes}
                value = {$journal.doc_type}
                on:change={(e)=>{
                    let prefix_array = e.detail.value.split(" ")
                    $journal.doc_type = e.detail.value;
                    $journal.doc_prefix = prefix_array[0][0] + prefix_array[1][0] + "-"
                    if (e.detail.value === "Contra Voucher") {
                        $journal.doc_prefix = prefix_array[0].slice(0,2) + prefix_array[1][0] + "-"
                    } 
                }}
                on:clear = {()=>{$journal.doc_type=""; $journal.doc_prefix=""}}
                />
            </div>
            <div class="group {errJournal.doc_prefix?'error':''}">
                <label for="prefix">Journal Prefix</label>
                <input type="text" name="prefix" id="prefix" disabled bind:value={$journal.doc_prefix}>
            </div>
            <div class="group {errJournal.doc_number?'error':''}">
                <label for="number">Journal Reference Number</label>
                <input type="text" name="number" id="number" bind:value={$journal.doc_number} on:keydown={(e)=>{keepNumeric(e)}}>
            </div>
            <div class="group {errJournal.doc_date?'error':''}">
                <label for="date">Journal Date</label>
                <input type="date" name="date" id="date" bind:value={$journal.doc_date}>
            </div>
        </div>
        <div class="master">
            <div class="title">
                <h5>Journal Account</h5>
            </div>
            <div class="group {errMasterEntry.account_id?'error':''}">
                <label for="m-account">Account Name</label>
                <Select 
                    class="select" 
                    id="m-account" 
                    items={accounts} 
                    label={"name"} 
                    itemId="id" 
                    value = {accounts.filter(a=>a.id === $masterEntry.account_id)[0]}
                    on:change={
                        (e)=>{
                            $masterEntry.account_id = e.detail.id;
                            $masterEntry.account_name = e.detail.name;
                        }
                    }
                />
                </div>
                <div class="group {errMasterEntry.entry_type?'error':''}">
                    <label for="entry">Entry Type</label>
                    <Select 
                    class="select" 
                    id="entry" 
                    items={[{value : "dr", label : "Debit"}, {value : "cr", label : "Credit"}]}
                    value={$masterEntry.entry_type} 
                    on:change={
                        (e)=>{
                            $masterEntry.entry_type = e.detail.value; 
                            $entries.forEach(en=>{
                                en.entry_type = $masterEntry.entry_type === "dr"?"cr":$masterEntry.entry_type==="cr"?"dr":""
                            }) 
                            $entries = [...$entries]}
                        }
                    on:clear={()=>{$masterEntry.entry_type=""}}
                    />
            </div>
            <div class="group {errMasterEntry.amount?'error':''}">
                <label for="amount">Journal Amount</label>
                <input type="text" name="amount" id="amoaunt" disabled bind:value={$masterEntry.amount}>
            </div>
        </div>
        <div class="entries">
            <div class="title">
                <h5>Entries</h5>
            </div>
            <div class="header">
                <span>#</span>
                <span>Entry Account</span>
                <span>Entry Type</span>
                <span>Amount</span>
            </div>
            <AddEntries {accounts} {updateTotal}/>
        </div>
        <div class="narration">
            <label for="narration">Journal Narration</label>
            <textarea name="narration" id="narration" bind:value={$journal.narration}></textarea>
        </div>
    </div>
</section>
{/key}

<style>
    section {
        width: 100%;
        padding: 1rem 0;
    }
    section .header {
        width: 100%;
        padding: .5rem 1rem;
    }
    section .header h4 {
        gap: 2rem;                       
    }
    .journal {
        width: 85%;
        margin: 0 auto;
        padding: .5rem 1rem;
        gap: .5rem;
    }
    .journal .info,
    .journal .master {
        display: grid;
        gap: .5rem;
        grid-template-columns: 3fr 1fr 3fr 3fr;
    }
    .journal .info .title,
    .journal .master .title {
        grid-column: 1/5;
    }
    .journal .info .group,
    .journal .master .group {
        padding: .2rem;
        display: grid;
        gap: .3rem;
    }
    .journal .info .group label,
    .journal .master .group label,
    .journal .narration label {
        font-size: 14px;
        font-weight: 500;
    }
    .journal .entries .header {
        display: grid;
        grid-template-columns: 1fr 6fr 3fr 6fr;
    }
    .journal .entries .header span {
        text-align: center;
    }
    .journal .narration {
        width: 100%;
        display: grid;
    }
    .journal .narration textarea {
        min-height: 56px;
        resize: none;
        border: none;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    section .header .actions button {
        font-size: .875rem;
        font-weight: 500;
        color: var(--white);
        border-radius: var(--radius);
    }
    .clear {
        background: var(--warning);
    }
    .save {
        background: var(--ok);
    }
    .error {
        background: var(--warning);
        border-radius: var(--radius);
    }
</style>