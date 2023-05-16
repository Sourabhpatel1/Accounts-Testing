<script>
    import Select from 'svelte-select'
    import ViewStock from './components/ViewStock.svelte';
    
    export let data;
    
    let inventory = data.inventory;
    let stocks = data.stocks;
    
    let stock;
    let viewingStock = false;

    let availableUnits = []

    let name;
    let unit;

    inventory.forEach(item=>{
        if (!availableUnits.includes(item.unit)) {
            availableUnits.push({
                'label' : item.unit, 'value' : item.id
            })
        }
    })

    const filter = () => {
        inventory = data.inventory;
        if (name) {
            inventory = inventory.filter(i=>i.name === name)
        }
        if (unit) {
            inventory = inventory.filter(i=>i.unit === unit)
        }
    }

</script>

{#if viewingStock}
    <ViewStock {stock} on:close={()=>{viewingStock=false;}}/>
{/if}

<section class="flex flex-col">
    <div class="header">
        <h4>Inventory Items</h4>
    </div>
    <div class="filters">
        <div class="group">
            <label for="name">Filter By Name</label>
            <Select
                class='select'
                id='name'
                items={inventory}
                itemId='id'
                label='name'
                placeholder={"Enter Name To Filter"}
                on:change={(e)=>{name=e.detail.name; filter()}}
                on:clear = {()=>{name=""; filter()}}
            />
        </div>
        <div class="group">
            <label for="unit">Fillter By Unit</label>
            <Select
                class='select'
                id='unit'
                items={availableUnits}
                placeholder={"Enter Unit To Filter"}
                on:change = {(e)=>{unit = e.detail.label; filter()}}
                on:clear = {()=>{unit=""; filter()}}
            />
        </div>
    </div>
    <div class="items flex flex-col">
        <div class="header">
            <span>#</span>
            <span>Name</span>
            <span>Unit</span>
            <span>Stock</span>
            <span>Actions</span>
        </div>
        {#each inventory as item, i (i+1)}
            <div class="row">
                <span>{i+1}</span>
                <span>{item.name}</span>
                <span>{item.unit}</span>
                <span>{item.available_stock}</span>
                <button 
                    class="flex-cc" 
                    on:click = {()=>{
                        stock = stocks.filter(s=>s.item_id === item.id)
                        viewingStock=true
                    }}
                >
                    View Details
                </button>
            </div>
        {/each}
    </div>
</section>

<style>
    section {
        width: 100%;
        padding: 2rem 0;
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
        width: 1000px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    .filters .group {
        padding: .5rem;
        display: grid;
        gap: .5rem;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .filters .group label {
        font-size: 1rem;
        font-weight: 500;
    }
    .items {
        height: 75dvh;
        padding: 0 1rem;
        gap: .2rem;
        overflow: scroll;
    }
    .items .header,
    .items .row {
        width: 1000px;
        margin: 0 auto;
        padding: .2rem 1rem;
        display: grid;
        grid-template-columns: 1fr 3fr 3fr 3fr 2fr;
        align-content: center;
        justify-items: center;
    }
    .items .header {
        margin-top: 5px;
        font-size: 1rem;
        font-weight: 600;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .items .row {
        font-size: 1rem;
        font-weight: 500;
    }
    .items .row button {
        height: 25px;
        font-size: .8rem;
        background: var(--wheat);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
</style>