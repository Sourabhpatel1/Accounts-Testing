<script>
    import { onMount, onDestroy } from "svelte";
    import { createEventDispatcher } from "svelte";

    export let stock;

    onMount(()=>{
        document.body.style.overflow = 'hidden'
    })
    onDestroy(()=>{
        document.body.style.overflow = 'visible'
    })

    const dispatch = createEventDispatcher()
</script>

<section class="flex-cc">
    <div class="card">
        <div class="title flex-cc">
            <h4>Stock Details</h4>
        </div>
        <div class="header">
            <span>#</span>
            <span>Name</span>
            <span>Unit</span>
            <span>Purchase Date</span>
            <span>Purchase Invoice</span>
            <span>Purchase Price</span>
            <span>Purchase Quantity</span>
            <span>Available Stock</span>
        </div>
        <div class="rows">
            {#each stock as s, i (i+1)}
                <div class="row">
                    <span>{i+1}</span>
                    <span>{s.name}</span>
                    <span>{s.unit}</span>
                    <span>{s.purchase_date}</span>
                    <span>P.Inv.-{s.purchase_invoice}</span>
                    <span>{s.price.toFixed(2)}</span>
                    <span>{s.quantity}</span>
                    <span>{s.available_stock}</span>
                </div>
            {/each}
        </div>
        <button class="flex-cc" on:click={()=>{dispatch('close')}}>X</button>
    </div>
</section>

<style>
    section {
        position: absolute;
        inset: 0;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur 5px;
    }
    .card {
        position: relative;
        max-width: 95%;
        padding: 1rem;
        font-size: .85rem;
        background: var(--bg-color);
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .card .title {
        width: 100%;
        padding: .3rem 1rem;
    }
    .card .rows {
        max-height: 75vh;
        margin-top: 1rem;
        overflow-y: scroll;
    }
    .card > button {
        position: absolute;
        top: -15px;
        right: -15px;
        width: 40px;
        height: 40px;
        font-size: 1rem;
        font-weight: 700;
        color: var(--white);
        background: var(--warning);
        border-radius: 50%;
    }
    .card .header {
        font-weight: 600;
        box-shadow: var(--bss);
        border-radius: var(--radius);
    }
    .card .header,
    .card .row {
        width: 100%;
        padding: .2rem 1rem;
        display: grid;
        grid-template-columns: 1fr 5fr 3fr 3fr 3fr 3fr 3fr 2fr;
        align-content: center;
        justify-items: center;
    }
</style>