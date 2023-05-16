<script>
    import Select from 'svelte-select'
    import Alert from '$lib/components/Alert.svelte'
    import AddItems from '$lib/components/AddItems.svelte'
    import SelectTerms from '$lib/components/SelectTerms.svelte'

    import { apiUrls } from '$lib/utils/urls'
    import { emptyObj, keepNumeric, checkEmpty, post } from '$lib/utils/helpers'
    import {si, items, item} from '../invoiceStore'
    
    export let data;
    
    const invoices = data.invoices;
    const pending_orders = data.orders.filter(o=>o.order.status === 0)
    const orders = pending_orders.map((a)=>{
        return {
            'value' : a.order.id,
            'label' : "SO-" + a.order.doc_number
        }
    })

    const customers = data.customers;
    const inventory = data.inventory;
    const terms = data.terms;

    const invoiceNum = invoices.length + 1;
    
    const stateTypes = [{label : "Intra", value :1}, {label : "Inter", value : 2}]
    const transactionTypes = [{label : "Cash", value : 1}, {label : "Bank", value : 2}, {label : "Credit", value : 3}];

    let errInvoice = {};
    let getRowErrors;

    let clear = false;
    let showAlert = false;
    let error = false;
    let message = "";

    let selectingTerms = false;

    $: selectedTerms = $si.terms_id !== ""?terms.filter(t=>t.id === $si.terms_id)[0]:"";

    const setItems = (id) => {
        const order = data.orders.filter(o=>o.order.id === id)[0]
        const order_invoices = invoices.filter(inv=>order.sales_invoice_id.includes(inv.invoice.id))
        
        let sold_items = {}

        order_invoices.forEach(inv=>{
            inv.items.forEach(itm=>{
                if (itm.quantity){
                    if (sold_items[itm.id]){
                        sold_items[itm.id] += itm.quantity
                    } else {
                        sold_items[itm.id] = itm.quantity
                    }
                }
            })
        })

        $si.so_id = id
        $si.customer_id = order.customer.id
        $si.state_type = order.order.state_type
        $si.state_type_object = stateTypes.filter(s=>s.value === $si.state_type)[0]
        $items = [];
        order.items.forEach((orderItem,i)=>{
            let value = (orderItem.price * (orderItem.quantity-(sold_items[orderItem.id]?sold_items[orderItem.id]:0)))
            let discount = value * orderItem.discount_rate / 100
            let value_after_discount = value - discount
            let tax_amount = value_after_discount * orderItem.tax_rate / 100
            let newItem = {
                'sr' : i+1,
                'item_id' : orderItem.id,
                'unit_name' : orderItem.unit_name,
                'price' : orderItem.price,
                'quantity' : orderItem.quantity-(sold_items[orderItem.id]?sold_items[orderItem.id]:0),
                'gst_rate' : orderItem.tax_rate,
                'gst_amount' : tax_amount,
                'discount_rate' : orderItem.discount_rate,
                'discount_amount' : discount,
                'total' : value - discount + tax_amount
            }
            $items = [...$items, newItem];
        })
    }

    const save = async () => { 
        let rowErrors =  getRowErrors()
        errInvoice = checkEmpty($si, 'so_id')
        if (Object.keys(errInvoice).length > 0 || rowErrors.length > 0) {
            error = true;
            message = "Fields marked by red background are required, please fill out the required fields and try again."
            showAlert = true;
            return;
        }
        try {
            let body = {
                "invoice" : {...$si},
                "line_items" : $items
            }
            if (!$si.so_id) {
                delete body.invoice['so_id']
            }
            const res = await post(apiUrls.sales + "invoice", body)
            if (res.status) {
                error = false;
                message = `Sales Invoice SI-${$si.doc_number} saved succesfully`;
                showAlert = true;
                return;
            } else {
                error = true;
                message = res.response.detail;
                showAlert = true;
                return;
            }
        } catch (error) {
            console.log(error)
        }
    }

</script>
{#if showAlert}
    <Alert {error} {message} on:close={()=>{if (!error) window.location.reload(); showAlert=false}}/>
{/if}
{#key clear}
<section class="flex flex-col">
    <div class="header flex-sb">
        <h4 class="flex">New Sales Invoice<span># {invoiceNum}</span></h4>
        <div class="actions">
            <button class="clear" on:click={()=>{window.location.reload()}}>- clear</button>
            <button class="save" on:click={save}>+ save</button>
        </div>
    </div>
    <div class="order flex flex-col">
        <div class="info">
            <div class="title">
                <h5>Sales Invoice Information</h5>
            </div>
            <div class="group {errInvoice.doc_number?'error':''}">
                <label for="number">Invoice Number</label>
                <input type="text" name="number" id="number" inputmode="numeric" on:keydown={(e)=>{keepNumeric(e)}} bind:value={$si.doc_number}>
            </div>
            <div class="group {errInvoice.doc_date?'error':''}">
                <label for="date">Invoice Date</label>
                <input type="date" name="date" id="date" bind:value={$si.doc_date}>
            </div>
            <div class="group {errInvoice.vendor_id?'error':''}">
                <label for="vendor">Invoice Customer</label>
                <Select
                    class='select'
                    id='vendor'
                    items={customers}
                    itemId="id"
                    label="name"
                    value={customers.filter(c=>c.id === $si.customer_id)[0]}
                    on:change={(e)=>{$si.customer_id = e.detail.id}}
                    on:clear={()=>{$si.customer_id=""}}
                />
            </div>
            <div class="group {errInvoice.state_type?'error':''}">
                <label for="state">Sale State</label>
                <Select
                    class='select'
                    id='state'
                    items={stateTypes}
                    bind:value={$si.state_type_object}
                    on:change = {(e)=>{$si.state_type=e.detail.value;}}
                    on:clear={()=>{$si.state_type=""}}
                />
            </div>
            <div class="group {errInvoice.so_id?'error':''}">
                <label for="po">Against Sales Order</label>
                <Select
                    class='select'
                    id='po'
                    items={orders}
                    on:change = {(e)=>{setItems(e.detail.value)}}
                    on:clear = {() => {$si.vendor_id=""; $si.state_type=""; $si.state_type_object=""; $items = [{...item}]}}
                />
            </div>
            <div class="group {errInvoice.transaction_type?'error':''}">
                <label for="trnasaction">Transaction Type</label>
                <Select
                    class='select'
                    id='transaction'
                    items={transactionTypes}
                    value={transactionTypes.filter(t=>t.value===$si.transaction_type)[0]}
                    on:change ={(e)=>{$si.transaction_type = e.detail.value;}}
                    on:clear = {()=>{$si.transaction_type=""}}
                />
            </div>
        </div>
        <div class="items">
            <div class="title">
                <h5>Items</h5>
            </div>
            <AddItems itemParent={"si"} {inventory} bind:checkError={getRowErrors}/>
        </div>
        <div class="footer">
            <div class="terms flex flex-col">
                <div class="title">
                    <h5 class="{errInvoice.terms_id?'error':''}">Terms and Conditions</h5>
                </div>
                <div class="terms-text">
                    <div class="selected-term flex flex-col">
                        {#if selectedTerms}
                            {#each selectedTerms.terms.split("\n") as line}
                                <p>{line}</p>
                            {/each}
                        {/if}
                    </div>
                </div>
                <div class="terms-action">
                    <button on:click={()=>{selectingTerms=true}}>Select terms and conditions</button>
                </div>
            </div> 
            <div class="total">
                <div class="gross">
                    <span>Gross Total</span>
                    <span>:</span>
                    <span>{$items.reduce((a,b)=>a+Number(b.total)-Number(b.gst_amount)+Number(b.discount_amount),0).toFixed(2)}</span>
                </div>
                <div class="discount">
                    <span>Discount</span>
                    <span>:</span>
                    <span>{$items.reduce((a,b)=>a+Number(b.discount_amount),0).toFixed(2)}</span>
                </div>
                {#if $si.state_type === 1}
                    <div class="cgst">
                        <span>CGST</span>
                        <span>:</span>
                        <span>{($items.reduce((a,b)=>a+Number(b.gst_amount),0)/2).toFixed(2)}</span>
                    </div>
                    <div class="sgst">
                        <span>SGST</span>
                        <span>:</span>
                        <span>{($items.reduce((a,b)=>a+b.gst_amount,0)/2).toFixed(2)}</span>    
                    </div>
                {:else if $si.state_type === 2}
                    <div class="igst">
                        <span>IGST</span>
                        <span>:</span>
                        <span>{$items.reduce((a,b)=>a+Number(b.gst_amount),0).toFixed(2)}</span>
                    </div>
                {/if}
                <div class="final">
                    <span>Total</span>
                    <span>:</span>
                    <span>{$items.reduce((a,b)=>a+Number(b.total),0).toFixed(2)}</span>
                </div>
                <div class="roundoff {errInvoice.rounded_off?'error':''}">
                    <span>Round Off</span>
                    <span>:</span>
                    <input type="text" class="round" bind:value={$si.rounded_off}>
                </div>
                <div class="final-total">
                    <span>Final</span>
                    <span>:</span>
                    <span>{($items.reduce((a,b)=>a+Number(b.total),0) - $si.rounded_off).toFixed(2)}</span>
                </div>
            </div>
        </div>
    </div>
</section>
{/key}
{#if selectingTerms}
    <SelectTerms {terms} on:select={(e)=>{$si.terms_id=e.detail.id; selectingTerms=false;}}/>
{/if}
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
    section .header .actions button {
        font-size: .875rem;
        font-weight: 500;
        color: var(--white);
        border-radius: var(--radius);
    }
    .order {
        width: 85%;
        margin: 0 auto;
        padding: .5rem 1rem;
        gap: .5rem;
    }
    .order .info {
        display: grid;
        gap: .5rem;
        grid-template-columns: repeat(4, 1fr);
    }
    .order .info .title {
        grid-column: 1/5;
    }
    .order .info .group {
        padding: .1rem;
        display: grid;
        gap: .3rem;
    }
    .order .info .group label {
        font-size: 1rem;
        font-weight: 500;
    }
    .footer {
        display: grid;
        grid-template-columns: 6fr 2fr;
    }
    .total {
        width: 100%;
        font-size: .8rem;
        font-weight: 500;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
    }
    .total > * {
        width: 300px;
    }
    .total > div {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-content: center;
        justify-items: end;
    }
    .total > div span,
    .total > div input {
        text-align: right;
    }
    .total > div input {
        width: 45%;
        padding: 0;
        font-size: .8rem;
        align-self: flex-end;
        text-align: center;
    }
    .round {
        height: 25px;
        width: 50%;
    }
    .terms {
        gap: .5rem;
    }
    .terms-action button {
        font-size: .9rem;
        font-weight: 500;
        color: var(--white);
        background: var(--ok);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .selected-term {
        font-size: .9rem;
        gap: .5rem;
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