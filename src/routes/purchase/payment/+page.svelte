<script>
    import { keepNumeric } from '$lib/utils/helpers'
    
    import Select from 'svelte-select'
    import Payment from './components/Payment.svelte';

    export let data;
    
    let invoices = data.invoices
    let vendors = data.vendors

    let currentInvoice;

    let startDate;
    let endDate;
    let minAmount;
    let maxAmount;
    let minBalance;
    let maxBalance;
    let vendor_id;
    let invoiceNum;

    let makingPayment = false;

    const filter = () => {
        invoices = data.invoices;

        if (startDate) {
            invoices = invoices.filter(i=>i.invoice.doc_date>=startDate)
        }
        if (endDate) {
            invoices = invoices.filter(i=>i.invoice.doc_date<=endDate)
        }
        if (minAmount) {
           invoices = invoices.filter(i=>i.value>= Number(minAmount))
        }
        if (maxAmount) {
            invoices = invoices.filter(i=>i.value <= Number(maxAmount))    
        }
        if (minBalance) {
            invoices = invoices.filter(i=>((i.value + i.tax - i.discount) - i.payment_amount) >= minBalance)
        }
        if (maxBalance) {
            invoices = invoices.filter(i=>((i.value + i.tax - i.discount) - i.payment_amount) <= maxBalance)
        }
        if (vendor_id) {
            invoices = invoices.filter(i=>i.invoice.vendor_id===vendor_id)
        }
        if (invoiceNum) {
            invoices = invoices.filter(i=>i.invoice.doc_number===Number(invoiceNum))
        }
    }

</script>

{#if makingPayment}
    <Payment {currentInvoice} on:close={()=>{makingPayment = false}}/>
{/if}

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
            <span>Filter By Invoice Value</span>
            <div class="field">
                <label for="min">Min Amount</label>
                <input type="text" bind:value={minAmount} on:keydown={(e)=>{keepNumeric(e)}} on:keyup={()=>{filter()}}>
            </div>
            <div class="field">
                <label for="max">Max Amount</label>
                <input type="text" bind:value={maxAmount} on:keydown={(e)=>{keepNumeric(e)}} on:keyup={()=>{filter()}}>
            </div>
        </div>
        <div class="group">
            <span>Filter By Invoice Balance</span>
            <div class="field">
                <label for="min">Min Amount</label>
                <input type="text" bind:value={minBalance} on:keydown={(e)=>{keepNumeric(e)}} on:keyup={()=>{filter()}}>
            </div>
            <div class="field">
                <label for="max">Max Amount</label>
                <input type="text" bind:value={maxBalance} on:keydown={(e)=>{keepNumeric(e)}} on:keyup={()=>{filter()}}>
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
            <span>Invoice No.</span>
            <span>Date</span>
            <span>Vendor</span>
            <span>Value</span>
            <span>Discount</span>
            <span>GST</span>
            <span>Round Off</span>
            <span>Invoice Total</span>
            <span>Previous Payment</span>
            <span>Invoice Balance</span>
            <span>Actions</span>
        </div>
        <div class="rows">
            {#each invoices as inv, i (i+1)}
                {#if (inv.value - inv.discount + inv.tax - inv.invoice.rounded_off)-inv.payment_amount > 0}
                    <div class="row">
                        <span>{i+1}</span>
                        <span>{inv.invoice.doc_prefix}{inv.invoice.doc_number}</span>
                        <span>{inv.invoice.doc_date}</span>
                        <span>{inv.vendor.name}</span>
                        <span>{inv.value.toFixed(2)}</span>
                        <span>{inv.discount.toFixed(2)}</span>
                        <span>{inv.tax.toFixed(2)}</span>
                        <span>{inv.invoice.rounded_off.toFixed(2)}</span>
                        <span>{(inv.value - inv.discount + inv.tax - inv.invoice.rounded_off).toFixed(2)}</span>
                        <span>{inv.payment_amount.toFixed(2)}</span>
                        <span>{((inv.value - inv.discount + inv.tax)-inv.payment_amount-inv.invoice.rounded_off).toFixed(2)}</span>
                        <button class="flex-cc" on:click={()=>{currentInvoice=inv; makingPayment=true}}>Pay</button>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</section>

<style>
     section {
        width: 100%;
        padding: 1rem;
        gap: 1rem;
    }
    section input {
        font-size: .75rem;
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
        grid-template-columns: 2fr 2fr 2fr 1fr 1fr;
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
        width: 100%;
    }
    .invoices .rows {
        height: 75dvh;
        overflow: scroll;
    }
    .invoices .header,
    .invoices .row {
        margin-top: 5px;
        padding: .2rem 0;
        padding-right: 4rem;
        font-size: .85rem;
        display: grid;
        grid-template-columns: 1fr repeat(10, 2fr) 1fr;
        align-content: center;
        justify-items: flex-end;
    }
    .invoices .header {
        font-weight: 600;
        box-shadow: var(--bsm);
        border-radius: var(--radius);
    }
    .row span {
        width: 100%;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .row button {
        height: 30px;
        background: var(--wheat);
        border-radius: var(--radius);
    }
</style>