<script>
    import Select from 'svelte-select'
    import Alert from '$lib/components/Alert.svelte'
    import AddItems from '$lib/components/AddItems.svelte'
    import SelectTerms from '$lib/components/SelectTerms.svelte'

    import { apiUrls } from '$lib/utils/urls'
    import { emptyObj, keepNumeric, checkEmpty, post } from '$lib/utils/helpers'
    import {so, items, item} from '../orderStore'

    export let data;
    
    const orders = data.orders;
    const customers = data.customers;
    const inventory = data.inventory;
    const terms = data.terms;

    const orderNum = orders.length + 1;
    
    const stateTypes = [{label : "Intra", value :1}, {label : "Inter", value : 2}]
    
    let errOrder = {};
    let getRowErrors;

    let clear = false;
    let showAlert = false;
    let error = false;
    let message = "";

    let selectingTerms = false;

    $: selectedTerms = $so.terms_id?terms.filter(t=>t.id === $so.terms_id)[0]:"";


    const clearForm = () => {
        clear = !clear
        emptyObj($so)
        errOrder = {}
        $items = [{...item}]
        selectedTerms = "";
    }

    const save = async () => { 
        let rowErrors =  getRowErrors()
        errOrder = checkEmpty($so)
        if (Object.keys(errOrder).length > 0 || rowErrors.length > 0) {
            error = true;
            message = "Fields marked by red background are required, please fill out the required fields and try again."
            showAlert = true;
            return;
        }
        console.log($items)
        console.log($so)
        try {
            let body = {
                "order" : {...$so},
                "line_items" : $items
            }
            const res = await post(apiUrls.sales + "order", body)
            if (res.status) {
                error = false;
                message = `Sales Order so-${$so.doc_number} saved succesfully`;
                showAlert = true;
                clearForm()
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
    <Alert {error} {message} on:close={()=>{showAlert=false}}/>
{/if}
{#key clear}
<section class="flex flex-col">
    <div class="header flex-sb">
        <h4 class="flex">New Sales Order <span># {orderNum}</span></h4>
        <div class="actions">
            <button class="clear" on:click={()=>{clearForm()}}>- clear</button>
            <button class="save" on:click={save}>+ save</button>
        </div>
    </div>
    <div class="order flex flex-col">
        <div class="info">
            <div class="title">
                <h5>Sales Order Information</h5>
            </div>
            <div class="group {errOrder.doc_number?'error':''}">
                <label for="number">Order Number</label>
                <input type="text" name="number" id="number" inputmode="numeric" on:keydown={(e)=>{keepNumeric(e)}} bind:value={$so.doc_number}>
            </div>
            <div class="group {errOrder.doc_date?'error':''}">
                <label for="date">Order Date</label>
                <input type="date" name="date" id="date" bind:value={$so.doc_date}>
            </div>
            <div class="group {errOrder.customer_id?'error':''}">
                <label for="customer">Order Customer</label>
                <Select
                    class='select'
                    id='customer'
                    items={customers}
                    itemId="id"
                    label="name"
                    value={customers.filter(c=>c.id === $so.customer_id)[0]}
                    on:change={(e)=>{$so.customer_id = e.detail.id}}
                    on:clear={()=>{$so.customer_id=""}}
                />
            </div>
            <div class="group {errOrder.state_type?'error':''}">
                <label for="state">Sale State</label>
                <Select
                    class='select'
                    id='state'
                    items={stateTypes}
                    bind:value={$so.state_type_object}
                    on:change = {(e)=>{$so.state_type=e.detail.value;}}
                    on:clear={()=>{$so.state_type=""}}
                />
            </div>
        </div>
        <div class="items">
            <div class="title">
                <h5>Items</h5>
            </div>
            <AddItems itemParent={"so"} {inventory} bind:checkError={getRowErrors}/>
        </div>
        <div class="footer">
            <div class="terms flex flex-col">
                <div class="title">
                    <h5 class="{errOrder.terms_id?'error':''}">Terms and Conditions</h5>
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
                {#if $so.state_type === 1}
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
                {:else if $so.state_type === 2}
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
            </div>
        </div>
    </div>
</section>
{/key}
{#if selectingTerms}
    <SelectTerms {terms} on:select={(e)=>{$so.terms_id=e.detail.id; selectingTerms=false;}}/>
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
    }
    .total > div span {
        text-align: right;
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