<script>
    import {entries, entry, rowErrors} from '../../routes/journal/new/entrystore'
    import { keepNumeric } from "$lib/utils/helpers"

    import Select from "svelte-select";

    export let accounts;
    export let updateTotal;
    
    let selectAccounts = []

    accounts.forEach(a=>{
        selectAccounts.push({
            value : a.id,
            label : a.name
        })
    })

    const addRow = () => {
        if ($entries.length >= 10) {
            return
        }
        $entries = [...$entries, {...$entry, sr : $entries.length + 1, entry_type : $entries[0].entry_type}]
    }
    const removeRow  = (sr) => {
        if ($entries.length  <= 1) {
            return
        }
        let new_entries = $entries.filter(e=>e.sr !== sr)
        new_entries.forEach((e, i)=>e.sr = i+1)
        $entries = [...new_entries]
    }
</script>

<section>
    {#each $entries as entry, i (entry.sr)}
    <div class="rows {$rowErrors.includes(entry.sr)?'error':''}">
            <button on:click={()=>{removeRow(entry.sr)}}>{entry.sr}</button>
            <Select 
                class="select" 
                items={accounts}
                itemId = "id"
                label = {"name"}
                value={accounts.filter(a=>a.id === $entries[i].account_id)[0]}
                on:change={
                    (e)=>{
                        $entries[i].account_id = e.detail.id;
                        $entries[i].account_name = e.detail.name;
                    }
                } 
            />
            <span class="flex-cc">{entry.entry_type=="dr"?"Debit":entry.entry_type=="cr"?"Credit":""}</span>
            <input type="text" name="a" id="a" bind:value={$entries[i].amount} on:keydown={(e)=>{keepNumeric(e)}} on:keyup={()=>{updateTotal()}}>
        </div>
        {/each}
    <button class="add-row {$entries.length >= 10?'disabled':''}" on:click={addRow}>+ add row</button>
</section>

<style>
    section {
        width: 100%;
        padding: .5rem 1rem;
    }
    .rows {
        width: 100%;
        margin-top: .5rem;
        padding: .1rem;
        display: grid;
        grid-template-columns: 1fr 6fr 3fr 6fr;
        gap: .5rem;
    }
    button {
        position: relative;
        background: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .add-row {
        margin-top: 5px;
        width: 6.35rem;
        font-weight: 500;
        color: var(--white);
        background: var(--ok);
    }
    .add-row.disabled {
        background: var(--gray);
        color: var(--primary);
    }
    .add-row.disabled:active {
        transform: none;
    }
    .rows > button::after {
        content: "X";
        position: absolute;
        inset: 0;
        background: var(--warning);
        color: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        font-weight: 600;
        border-radius: inherit;
        opacity: 0;
        transition: 0.25s ease-in;
    }
    .rows > button:hover::after {
        opacity: 1;
    }
    .rows span {
        width: 100%;
        font-size: 14px;
        font-weight: 500;
    }
    .error {
        background: var(--warning);
        border-radius: var(--radius);
    }
</style>