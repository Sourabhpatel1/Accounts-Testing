<script>
    import { keepNumeric } from '$lib/utils/helpers'
    import Select from 'svelte-select'

    export let data;

    let orders = data.orders;
    let vendors = data.vendors;


    let startDate;
    let endDate;
    let minAmount;
    let maxAmount;
    let vendor_id;
    let orderNum;

    const filter = () => {
        orders = data.orders;

        if (startDate) {
            orders = orders.filter(o=>o.order.doc_date>=startDate)
        }
        if (endDate) {
            orders = orders.filter(o=>o.order.doc_date<=endDate)
        }
        if (minAmount) {
           orders = orders.filter(o=>o.value>= Number(minAmount))
        }
        if (maxAmount) {
            orders = orders.filter(o=>o.value <= Number(maxAmount))    
        }
        if (vendor_id) {
            orders = orders.filter(o=>o.order.vendor_id===vendor_id)
        }
        if (orderNum) {
            orders = orders.filter(o=>o.order.doc_number===Number(orderNum))
        }
    }

</script>

<section class="flex flex-col">
    <div class="header">
        <h4>Purchase Orders</h4>
    </div>
    <div class="filters">
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
        <div class="group">
            <span>Filter By Order Value</span>
            <div class="field">
                <label for="min">Min Amount</label>
                <input type="text" bind:value={minAmount} on:keydown={(e)=>{keepNumeric(e)}} on:keyup={()=>{filter()}}>
            </div>
            <div class="field">
                <label for="max">Max Amount</label>
                <input type="text" bind:value={maxAmount} on:keydown={(e)=>{keepNumeric(e)}} on:keyup={()=>{filter()}}>
            </div>
        </div>
        <div class="group single">
            <label for="vendor">Filter by vendor</label>
            <Select
            class='select'
            id='vendor'
            items={vendors}
            itemId="id"
            label="name"
            containerStyles={'grid-column:1/3'}
            on:change={(e)=>{vendor_id=e.detail.id; filter()}}
            on:clear={()=>{vendor_id=""; filter()}}
            />
        </div>
        <div class="group single">
            <label for="number">Filter by Order No.</label>
            <input type="text" bind:value={orderNum} on:keydown={(e)=>{keepNumeric(e)}} on:keyup={()=>{filter()}}>
        </div>
    </div>
    <div class="orders">
        <div class="header">
            <span>#</span>
            <span>Po. No.</span>
            <span>Date</span>
            <span>Vendor</span>
            <span>Sale State</span>
            <span>Order Value (₹)</span>
            <span>Discount (₹)</span>
            <span>GST (₹)</span>
            <span>Total</span>
            <span>Actions</span>
        </div>
        {#each orders as order, i (i+1)}
        <div class="row">
            <span>{i+1}</span>
            <span>PO-{order.order.doc_number}</span>
            <span>{order.order.doc_date}</span>
            <span>{order.vendor.name}</span>
            <span>{order.order.state_type===1?'Intra':'Inter'}</span>
            <span>{order.value.toFixed(2)}</span>
            <span>{order.discount.toFixed(2)}</span>
            <span>{order.tax.toFixed(2)}</span>
            <span>{(order.value + order.tax - order.discount).toFixed(2)}</span>
            <div class="actions">
                <a href="/purchase/view_po/{order.order.id}">
                    <button class="flex-cc">View</button>
                </a>
            </div>
        </div>
        {/each}
    </div>
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
        width: 100%;
        display: grid;
        grid-template-columns: 4fr 4fr 2fr 2fr;
        gap: 1rem;
    }
    .filters .group {
        width: 100%;
        height: 100%;
        padding: .5rem;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
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
    .filters .single input {
        grid-column: 1/3;
    }
    .filters .group .field {
        display: flex;
    }
    .orders {
        position: relative;
        padding: 0 1rem;
        height: 78dvh;
        overflow: scroll;
    }
    .orders .header,
    .orders .row {
        margin: 0 auto;
        padding: .1rem 1rem;
        font-size: 1rem;
        display: grid;
        grid-template-columns: 1fr 2fr 3fr 4fr 2fr 4fr 2fr 3fr 4fr 1fr;
        align-content: center;
        justify-items: center;
    }
    .orders .header {
        position: sticky;
        top: 0;
        padding: .4rem 1rem;
        background: var(--bg-color);
    }
    .orders .header span,
    .orders .row span {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .orders .header {
        margin-bottom: 5px;
        font-weight: 600;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .orders .row {
        margin-top: 7px;
    }
    .orders .row a {
        text-decoration: none;
        color: currentColor;
    }
    .orders .row button {
        height: 25px;
        background: var(--wheat);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
</style>