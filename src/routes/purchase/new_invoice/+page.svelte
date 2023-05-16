<script>
    import Select from 'svelte-select'
    import Alert from '$lib/components/Alert.svelte'
    import AddItems from '$lib/components/AddItems.svelte'
    import SelectTerms from '$lib/components/SelectTerms.svelte'

    import { apiUrls } from '$lib/utils/urls'
    import { emptyObj, keepNumeric, checkEmpty, post } from '$lib/utils/helpers'
    import {pi, items, item} from '../invoiceStore'
    
    export let data;
    
    console.log(data)

    const invoices = data.invoices;
    let pending_orders = data.orders.filter(o=>o.order.status==0)
    const orders = pending_orders.map((a)=>{
        return {
            'value' : a.order.id,
            'label' : "PO-" + a.order.doc_number
        }
    })

    const vendors = data.vendors;
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

    $: selectedTerms = $pi.terms_id !== ""?terms.filter(t=>t.id === $pi.terms_id)[0]:"";

    const setItems = (id) => {
        const order = data.orders.filter(o=>o.order.id === id)[0]
        const order_invoices = invoices.filter(inv=>order.purchase_invoice_id.includes(inv.invoice.id))
        
        let purchased_items = {}

        order_invoices.forEach(inv=>{
            inv.items.forEach(itm=>{
                if (itm.quantity){
                    if (purchased_items[itm.id]){
                        purchased_items[itm.id] += itm.quantity
                    } else {
                        purchased_items[itm.id] = itm.quantity
                    }
                }
            })
        })
        
        $pi.po_id = id
        $pi.vendor_id = order.order.vendor_id
        $pi.state_type = order.order.state_type
        $pi.state_type_object = stateTypes.filter(s=>s.value === $pi.state_type)[0]
        $items = [];
        order.items.forEach((orderItem,i)=>{
            let value = (orderItem.price * (orderItem.quantity-(purchased_items[orderItem.id]?purchased_items[orderItem.id]:0)))
            let discount = value * orderItem.discount_rate / 100
            let value_after_discount = value - discount
            let tax_amount = value_after_discount * orderItem.tax_rate / 100
            let newItem = {
                'sr' : i+1,
                'item_id' : orderItem.id,
                'unit_name' : orderItem.unit_name,
                'price' : orderItem.price,
                'quantity' : orderItem.quantity - (purchased_items[orderItem.id]?purchased_items[orderItem.id]:0),
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
        errInvoice = checkEmpty($pi, 'po_id')
        if (Object.keys(errInvoice).length > 0 || rowErrors.length > 0) {
            error = true;
            message = "Fields marked by red background are required, please fill out the required fields and try again."
            showAlert = true;
            return;
        }
        try {
            let body = {
                "invoice" : {...$pi},
                "line_items" : $items
            }
            if (!$pi.po_id) {
                delete body.invoice['po_id']
            }
            const res = await post(apiUrls.purchase + "invoice", body)
            if (res.status) {
                error = false;
                message = `Purchase Invoice PI-${$pi.doc_number} saved succesfully`;
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
        <h4 class="flex">New Purchase Invoice<span># {invoiceNum}</span></h4>
        <div class="actions">
            <button class="clear" on:click={()=>{window.location.reload()}}>- clear</button>
            <button class="save" on:click={save}>+ save</button>
        </div>
    </div>
    <div class="order flex flex-col">
        <div class="info">
            <div class="title">
                <h5>Purchase Invoice Information</h5>
            </div>
            <div class="group {errInvoice.doc_number?'error':''}">
                <label for="number">Invoice Number</label>
                <input type="text" name="number" id="number" inputmode="numeric" on:keydown={(e)=>{keepNumeric(e)}} bind:value={$pi.doc_number}>
            </div>
            <div class="group {errInvoice.doc_date?'error':''}">
                <label for="date">Invoice Date</label>
                <input type="date" name="date" id="date" bind:value={$pi.doc_date}>
            </div>
            <div class="group {errInvoice.vendor_id?'error':''}">
                <label for="vendor">Invoice Vendor</label>
                <Select
                    class='select'
                    id='vendor'
                    items={vendors}
                    itemId="id"
                    label="name"
                    value={vendors.filter(v=>v.id === $pi.vendor_id)[0]}
                    on:change={(e)=>{$pi.vendor_id = e.detail.id}}
                    on:clear={()=>{$pi.vendor_id=""}}
                />
            </div>
            <div class="group {errInvoice.state_type?'error':''}">
                <label for="state">Purchase State</label>
                <Select
                    class='select'
                    id='state'
                    items={stateTypes}
                    bind:value={$pi.state_type_object}
                    on:change = {(e)=>{$pi.state_type=e.detail.value;}}
                    on:clear={()=>{$pi.state_type=""}}
                />
            </div>
            <div class="group {errInvoice.po_id?'error':''}">
                <label for="po">Against Purchase Order</label>
                <Select
                    class='select'
                    id='po'
                    items={orders}
                    on:change = {(e)=>{setItems(e.detail.value)}}
                    on:clear = {() => {$pi.vendor_id=""; $pi.state_type=""; $pi.state_type_object=""; $items = [{...item}]}}
                />
            </div>
            <div class="group {errInvoice.transaction_type?'error':''}">
                <label for="trnasaction">Transaction Type</label>
                <Select
                    class='select'
                    id='transaction'
                    items={transactionTypes}
                    value={transactionTypes.filter(t=>t.value===$pi.transaction_type)[0]}
                    on:change ={(e)=>{$pi.transaction_type = e.detail.value;}}
                    on:clear = {()=>{$pi.transaction_type=""}}
                />
            </div>
        </div>
        <div class="items">
            <div class="title">
                <h5>Items</h5>
            </div>
            <AddItems itemParent={"pi"} {inventory} bind:checkError={getRowErrors}/>
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
                {#if $pi.state_type === 1}
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
                {:else if $pi.state_type === 2}
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
                    <input type="text" class="round" bind:value={$pi.rounded_off}>
                </div>
                <div class="final-total">
                    <span>Final</span>
                    <span>:</span>
                    <span>{($items.reduce((a,b)=>a+Number(b.total),0) - $pi.rounded_off).toFixed(2)}</span>
                </div>
            </div>
        </div>
    </div>
</section>
{/key}
{#if selectingTerms}
    <SelectTerms {terms} on:select={(e)=>{$pi.terms_id=e.detail.id; selectingTerms=false;}}/>
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