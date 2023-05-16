<script>
    import AddTax from './components/AddTax.svelte';
    
    export let data;
    
    let current = "gst_input"
    let addingTax = false;
</script>

{#if addingTax}
    <AddTax on:close={()=>{addingTax=false}}/>
{/if}
<section class="flex flex-col">
    <div class="title flex-sb">
        <button class="back" on:click={()=>{history.back()}}>Back</button>
        <h4>Taxes</h4>
        <button class="new" on:click={()=>addingTax=true}>Add New Tax</button>
    </div>
    <div class="tabs flex-cc">
        <button class="{current === "gst_input"?'active':''}" on:click={()=>{current='gst_input'}}>GST Input</button>
        <button class="{current === "gst_output"?'active':''}" on:click={()=>{current='gst_output'}}>GST Output</button>
        <button class="{current === "igst_input"?'active':''}" on:click={()=>{current='igst_input'}}>IGST Input</button>
        <button class="{current === "igst_output"?'active':''}" on:click={()=>{current='igst_output'}}>IGST Output</button>
    </div>
    <div class="header">
        <span>#</span>
        <span>Name</span>
        <span>Rate</span>
    </div>
    <div class="rows">
        {#each data.taxes[current] as tax, i}
            <div class="row">
                <span>{i+1}</span>
                <span>{tax.name}</span>
                <span style="text-align: right;">{tax.rate.toFixed(2)} %</span>
            </div>
        {/each}
    </div>
</section>

<style>
    section {
        gap: 1rem;
    }
    .title {
        width: 100%;
        padding: 1rem;
        text-align: center;
    }
    .title .new,
    .title .back {
        color: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .title .new {
        background: var(--ok);
    }
    .title .back {
        background: var(--wheat);
    }
    .tabs {
        width: 100%;
        padding: 1rem;
        font-size: 1rem;
        font-weight: 500;
        gap: 1rem;
    }
    .tabs button {
        width: 180px;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .header,
    .rows .row {
        width: 40%;
        margin: 0 auto;
        padding: .2rem 1rem;
        font-size: 1rem;
        display: grid;
        grid-template-columns: 1fr 4fr 1fr;
        place-items: center;
        gap: 1rem;
    }
    .header {
        font-weight: 700;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .rows .row {
        font-weight: 500;
        margin-top: 7px;
    }
    .active {
        color: var(--white);
        background: var(--primary);
    }
</style>