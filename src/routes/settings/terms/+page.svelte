<script>
	import AddTerms from './components/AddTerms.svelte';
    import ViewTerms from './components/ViewTerms.svelte';
    
    export let data;

    let current = "poTerms"
    let addingTerms = false; 
</script>

{#if addingTerms}
    <AddTerms {current} on:close={()=>{addingTerms=false; window.location.reload()}}/>
{/if}

<section class="flex flex-col">
    <div class="header flex-sb">
        <button class="back" on:click={()=>{history.back()}}>Back</button>
        <h4>Terms and Conditions</h4>
        <button class="add" on:click={()=>{addingTerms=true}}>Add New</button>
    </div>
    <div class="tabs flex-cc">
        <button class="{current==="poTerms"?'active':''}" on:click={()=>{current='poTerms'}}>Purchase Order Terms</button>
        <button class="{current==="piTerms"?'active':''}" on:click={()=>{current='piTerms'}}>Purchase Invoice Terms</button>
        <button class="{current==="soTerms"?'active':''}" on:click={()=>{current='soTerms'}}>Sales Order Terms</button>
        <button class="{current==="siTerms"?'active':''}" on:click={()=>{current='siTerms'}}>Sales Invoice Terms</button>
    </div>
    <div class="terms flex-cc flex-col">
        <div class="header">
            <h5>Terms and Conditions</h5>
        </div>
        {#key current}
            <ViewTerms terms={data[current]}/>
        {/key}
    </div>
</section>

<style>
    section {
        padding: 1rem;
        gap: 1rem;
    }
    .header {
        padding: .5rem 1rem;   
    }
    .add,
    .back {
        width: 125px;
        font-size: .9rem;
        font-weight: 500;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
        color: var(--white);
    }
    .back {
        background: var(--wheat);
    }
    .add {
        background: var(--ok);
    }
    .tabs {
        gap: 1rem;
    }
    .tabs button {
        font-size: .9rem;
        font-weight: 500;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .terms {
        gap: 1rem;
    }
    .terms .header {
        width: 47%;
        text-align: center;
        box-shadow: var(--bsm);
        border-radius: var(--radius);
    }
    .active {
        color: var(--white);
        background: var(--primary);
    }
</style>