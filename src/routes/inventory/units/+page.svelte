<script>
	import AddUnit from './components/AddUnit.svelte';
    
    export let data;

    let addingUnit = false;

</script>


{#if addingUnit}
    <AddUnit on:close={()=>{addingUnit=false}} />
{/if}

<section>
    <div class="header flex-sb">
        <button class="back" on:click={()=>{history.back()}}>Back</button>
        <h4>Inventory Units</h4>
        <button class="add" on:click={()=>{addingUnit=true}}>Add New</button>
    </div>
    <div class="units flex flex-col">
        <div class="head">
            <span>#</span>
            <span>Name</span>
        </div>
        <div class="rows">
            {#each data.units as unit, i}
                <div class="row">
                    <span>{i+1}</span>
                    <span>{unit.name}</span>
                </div>    
            {/each}
        </div>
    </div>
</section>

<style>
    section {
        padding: 1rem;
    }
    section .header {
        padding: .5rem 1rem;
    }
    .units {
        gap: .5rem;
    }
    .units .head,
    .units .rows .row {
        width: 12%;
        margin: 3px auto;
        font-size: 1rem;
        display: grid;
        grid-template-columns: 1fr 6fr;
        align-content: center;
        justify-items: center;
    }
    .head {
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .rows {
        min-height: 200px;
        max-height: 90dvh;
        overflow-y: scroll;
    }
    .row {
        padding: .2rem;
        box-shadow: var(--bss);
        border-radius: var(--radius);
    }
    .head span:nth-child(2),
    .row span:nth-child(2) {
        width: 100%;
        padding-left: 1.5rem;
        text-align: left;
    }
    .back,
    .add {
        width: 150px;
        font-size: 1rem;
        font-weight: 500;
        color: var(--white);
        box-shadow: var(--bss);
        border-radius: var(--radius);
    }
    .add {
        background: var(--ok);
    }
    .back {
        background: var(--wheat);
    }
</style>