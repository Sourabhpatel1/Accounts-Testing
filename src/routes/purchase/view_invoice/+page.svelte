<script>
    import { keepNumeric } from '$lib/utils/helpers'
    import Select from 'svelte-select'

    export let data;

    let invoices = data.invoices;
    let vendors = data.vendors;


    let startDate;
    let endDate;
    let minAmount;
    let maxAmount;
    let vendor_id;
    let invoiceNum;

    const filter = () => {
        invoices = data.invoices;

        if (startDate) {
            invoices = invoices.filter(o=>o.invoice.doc_date>=startDate)
        }
        if (endDate) {
            invoices = invoices.filter(o=>o.invoice.doc_date<=endDate)
        }
        if (minAmount) {
           invoices = invoices.filter(o=>o.value>= Number(minAmount))
        }
        if (maxAmount) {
            invoices = invoices.filter(o=>o.value <= Number(maxAmount))    
        }
        if (vendor_id) {
            invoices = invoices.filter(o=>o.invoice.vendor_id===vendor_id)
        }
        if (invoiceNum) {
            invoices = invoices.filter(o=>o.invoice.doc_number===Number(invoiceNum))
        }
    }

</script>

<section class="flex flex-col">
    <div class="header">
        <h4>Purchase invoices</h4>
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
            <span>Filter By invoice Value</span>
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
            <label for="number">Filter by invoice No.</label>
            <input type="text" bind:value={invoiceNum} on:keydown={(e)=>{keepNumeric(e)}} on:keyup={()=>{filter()}}>
        </div>
    </div>
    <div class="invoices">
        <div class="header">
            <span>#</span>
            <span>PI. No.</span>
            <span>Date</span>
            <span>Vendor</span>
            <span>Sale State</span>
            <span>P.O.</span>
            <span>invoice Value (₹)</span>
            <span>Discount (₹)</span>
            <span>GST (₹)</span>
            <span>Round Off(₹)</span>
            <span>Total</span>
            <span>Actions</span>
        </div>
        {#each invoices as invoice, i (i+1)}
        <div class="row">
            <span>{i+1}</span>
            <span>P.Inv-{invoice.invoice.doc_number}</span>
            <span>{invoice.invoice.doc_date}</span>
            <span>{invoice.vendor.name}</span>
            <span>{invoice.invoice.state_type===1?'Intra':'Inter'}</span>
            <span>PO-{invoice.order_number}</span>
            <span>{invoice.value.toFixed(2)}</span>
            <span>{invoice.discount.toFixed(2)}</span>
            <span>{invoice.tax.toFixed(2)}</span>
            <span>{invoice.invoice.rounded_off.toFixed(2)}</span>
            <span>{(invoice.value + invoice.tax - invoice.discount - invoice.invoice.rounded_off).toFixed(2)}</span>
            <div class="actions">
                <a href="/purchase/view_invoice/{invoice.invoice.id}">
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
    .invoices {
        position: relative;
        padding: 0 1rem;
        height: 78dvh;
        overflow: scroll;
    }
    .invoices .header,
    .invoices .row {
        margin: 0 auto;
        padding: .1rem 1rem;
        font-size: 1rem;
        display: grid;
        grid-template-columns: 1fr 2fr 3fr 4fr 2fr 2fr 4fr 2fr 3fr 2fr 4fr 1fr;
        align-content: center;
        justify-items: center;
    }
    .invoices .header {
        position: sticky;
        top: 0;
        padding: .4rem 1rem;
        background: var(--bg-color);
    }
    .invoices .header span,
    .invoices .row span {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .invoices .header {
        margin-bottom: 5px;
        font-weight: 600;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .invoices .row {
        margin-top: 7px;
    }
    .invoices .row a {
        text-decoration: none;
        color: currentColor;
    }
    .invoices .row button {
        height: 25px;
        background: var(--wheat);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
</style>