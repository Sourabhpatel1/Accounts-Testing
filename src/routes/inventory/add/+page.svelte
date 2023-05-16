<script>
    import { apiUrls } from '$lib/utils/urls'
    import { post, checkEmpty, emptyObj } from '$lib/utils/helpers'
    import { item } from './addInventoryStore'
    import Select from 'svelte-select'
    import Alert from '$lib/components/Alert.svelte';

    export let data;

    const units = data.units;
    const taxes = data.taxes

    const taxRates = [];
    const materialAccounts = [{value:3220, label:"Raw Material"}, {value:3221, label:"Unfinished Material"}, {value:3222, label:"Finished Material"}]

    taxes['gst_input'].forEach(tax=>taxRates.push(tax.rate))

    const setItemTax = (taxRate) => {
        $item.gst_input_id = taxes.gst_input.filter(t=>t.rate===taxRate)[0].id
        $item.igst_input_id = taxes.igst_input.filter(t=>t.rate===taxRate)[0].id
        $item.gst_output_id = taxes.gst_output.filter(t=>t.rate===taxRate)[0].id
        $item.igst_output_id = taxes.igst_output.filter(t=>t.rate===taxRate)[0].id
    }

    let itemError = {}

    let showAlert = false;
    let error = false;
    let message = ""

    const clear = () => {
        $item = emptyObj($item)
        itemError = {}
    }

    const save = async () => {
        $item.item_category = $item.inventory_account_id == 3220?0:$item.inventory_account_id==3221?1:2
        itemError = checkEmpty($item)
        if (Object.keys(itemError).length > 0) {
            message = "Fields marked with red background are required please fill up the required fields and try again."
            error = true;
            showAlert = true;
            return
        }
        try {
            const res = await post(apiUrls.inventory, $item)
            if (res.status) {
                message = `Item ${$item.name} added succesfully.`
                error = false
                showAlert = true;
                clear()
                return
            } else {
                message = res.response.detail;
                error = true;
                showAlert = true;
                return;
            }
        } catch (error) {
            console.log(error)
        }
    }

</script>

{#if showAlert}
    <Alert {error} {message} on:close={()=>{showAlert=false; error=false; message=""}}/>
{/if}

<section class="flex flex-col">
    <div class="header">
        <h4>Add New Inventory Item</h4>
    </div>
    <div class="add-container">
        <div class="header flex-sb">
            <h5>
                New Inventory Item 
            </h5>
            <div class="actions flex">
                <button on:click={clear}>Clear</button>
                <button on:click={save}>Save</button>
            </div>
        </div>
        <div class="fields">
            <div class="group {itemError.name ? 'error' : ''}">
                <label for="name">Item Name</label>
                <input type="text" bind:value={$item.name}>
            </div>
            <div class="group {itemError.unit_id ? 'error' : ''}">
                <label for="unit">Item Unit</label>
                <Select
                    class='select'
                    id='unit'
                    items = {units}
                    itemId='id'
                    label='name'
                    value = {units.filter(i=>i.id === $item.unit_id)[0]}
                    on:change={(e)=>{$item.unit_id = e.detail.id}}
                    on:clear={()=>{$item.unit_id=''}}
                />            
            </div>
            <div class="group {itemError.tax_rate ? 'error' : ''}">
                <label for="tax">GST Rate</label>
                <Select
                    class='select'
                    id='tax'
                    items={taxRates}
                    bind:value={$item.tax_rate}
                    on:change={(e)=>{setItemTax(e.detail.value)}}
                    on:clear={()=>{$item.tax_rate = ""}}
                />
            </div>
            <div class="group {itemError.inventory_account_id ? 'error' : ''}">
                <label for="type">Item Type</label>
                <Select
                    class='select'
                    id='type'
                    items={materialAccounts}
                    value={materialAccounts.filter(a=>a.value === $item.inventory_account_id)[0]}
                    on:change={(e)=>{$item.inventory_account_id=e.detail.value;}}
                    on:clear={()=>{$item.inventory_account_id = ""}}
                />
            </div>
            <div class="group {itemError.item_type ? 'error' : ''}">
                <label for="category">Item Category</label>
                <Select
                    class='select'
                    id='category'
                    items={["Trade", "Store"]}
                    value={$item.item_type}
                    on:change={(e)=>{$item.item_type=e.detail.value}}
                    on:clear={()=>{$item.item_type=""}}
                />
            </div>
        </div>
    </div>
</section>

<style>
    section {
        width: 100%;
        padding: 2rem 0;
        gap: 1rem;
    }
    section .header {
        padding: .5rem 1rem;                       
    }
    section .header h4 {
        width: 100%;
        text-align: center;

    }
    .add-container {
        width: 650px;
        margin: 0 auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .add-container > .header {
        width: 100%;
    }
    .add-container > .header .actions {
        gap: 1rem;
    }
    .add-container > .header .actions button {
        font-size: .75rem;
        font-weight: 500;
        color: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .add-container > .header .actions button:nth-child(1) {
        background: var(--warning);
    }
    .add-container > .header .actions button:nth-child(2) {
        background: var(--ok);
    }
    .add-container .fields {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .add-container .fields .group {
        padding: .2rem;
        display: grid;
        grid-template-columns: 1fr 4fr;
        align-content: center;
        justify-items: center;
    }
    .add-container label {
        width: 100%;
        height: 100%;
        padding: 0 .5rem;
        font-size: .9rem;
        font-weight: 500;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
    .error {
        background: var(--warning);
        border-radius: inherit;
    }
</style>

