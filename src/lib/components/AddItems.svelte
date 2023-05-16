<script>
    import { items as poItems, item} from '../../routes/purchase/orderStore'
    import { items as piItems } from '../../routes/purchase/invoiceStore' 
    import {items as soItems} from '../../routes/sales/orderStore'
    import {items as siItems} from '../../routes/sales/invoiceStore'

    import { checkEmpty } from '$lib/utils/helpers'

    import Select from 'svelte-select';

    export let itemParent = "po"
    export let inventory;

    let rowErrors = []

    const updateTotalPo = (rowNum) => {
        const total = Number($poItems[rowNum].price) * Number($poItems[rowNum].quantity)
        
        const discountRate = Number($poItems[rowNum].discount_rate) / 100
        const gstRate = Number($poItems[rowNum].gst_rate) / 100
        
        const discountAmount = discountRate * total
        const gstAmount = (total - discountAmount) * gstRate 

        $poItems[rowNum].discount_amount = discountAmount
        $poItems[rowNum].gst_amount = gstAmount
        $poItems[rowNum].total = total - discountAmount + gstAmount
    }

    const updateTotalPi = (rowNum) =>{
        const total = Number($piItems[rowNum].price) * Number($piItems[rowNum].quantity)
        
        const discountRate = Number($piItems[rowNum].discount_rate) / 100
        const gstRate = Number($piItems[rowNum].gst_rate) / 100
        
        const discountAmount = discountRate * total
        const gstAmount = (total - discountAmount) * gstRate 

        $piItems[rowNum].discount_amount = discountAmount
        $piItems[rowNum].gst_amount = gstAmount
        $piItems[rowNum].total = total - discountAmount + gstAmount
    }

    const updateTotalSo = (rowNum) => {
        const total = Number($soItems[rowNum].price) * Number($soItems[rowNum].quantity)
        
        const discountRate = Number($soItems[rowNum].discount_rate) / 100
        const gstRate = Number($soItems[rowNum].gst_rate) / 100
        
        const discountAmount = discountRate * total
        const gstAmount = (total - discountAmount) * gstRate 

        $soItems[rowNum].discount_amount = discountAmount
        $soItems[rowNum].gst_amount = gstAmount
        $soItems[rowNum].total = total - discountAmount + gstAmount
    }

    const updateTotalSi = (rowNum) => {
        const total = Number($siItems[rowNum].price) * Number($siItems[rowNum].quantity)
        
        const discountRate = Number($siItems[rowNum].discount_rate) / 100
        const gstRate = Number($siItems[rowNum].gst_rate) / 100
        
        const discountAmount = discountRate * total
        const gstAmount = (total - discountAmount) * gstRate 

        $siItems[rowNum].discount_amount = discountAmount
        $siItems[rowNum].gst_amount = gstAmount
        $siItems[rowNum].total = total - discountAmount + gstAmount
    }

    const setItems = (rowNum, e) => {
        if (itemParent === "po") {
            $poItems[rowNum].unit_name = e.detail.unit
            $poItems[rowNum].gst_rate = e.detail.gst_rate   
        }
        if (itemParent === "pi") {
            $piItems[rowNum].unit_name = e.detail.unit
            $piItems[rowNum].gst_rate = e.detail.gst_rate   
        }
        if (itemParent === "so") {
            $soItems[rowNum].unit_name = e.detail.unit
            $soItems[rowNum].gst_rate = e.detail.gst_rate       
        }
        if (itemParent === "si") {
            $siItems[rowNum].unit_name = e.detail.unit
            $siItems[rowNum].gst_rate = e.detail.gst_rate           
        }
    }

    const addRow = () => {
        if (itemParent == "po") {
            if ($poItems.length > 10) {
                return
            }
            $poItems = [...$poItems, {...item, sr:$poItems.length + 1}]
        }
        if (itemParent == "pi") {
            if ($piItems.length > 10) {
                return
            }
            $piItems = [...$piItems, {...item, sr:$piItems.length + 1}]
        }
        if (itemParent === "so") {
            if ($soItems.length > 10) {
                return
            }
            $soItems = [...$soItems, {...item, sr:$soItems.length + 1}]
        }
        if (itemParent === "si") {
            if ($siItems.length > 10) {
                return
            }
            $siItems = [...$siItems, {...item, sr:$siItems.length + 1}]    
        }
    }

    const removeRow = (sr) => {
        if (itemParent === "po") {
            if ($poItems.length <= 1) {
                $poItems = [{...item}]
                return
            }
            let newItems = $poItems.filter(item=>item.sr !== sr)
            newItems.forEach((item, i)=>item.sr = i+1)
            $poItems = newItems
        }
        if (itemParent === "pi") {
            if ($piItems.length <= 1) {
                $piItems = [{...item}]
                return
            }
            let newItems = $piItems.filter(item=>item.sr !== sr)
            newItems.forEach((item, i)=>item.sr = i+1)
            $piItems = newItems
        }
        if (itemParent === "so") {
            if ($soItems.length <= 1) {
                $soItems = [{...item}]
                return
            }
            let newItems = $soItems.filter(item=>item.sr !== sr)
            newItems.forEach((item, i)=>item.sr = i+1)
            $soItems = newItems
        }
        if (itemParent === "si") {
            if ($siItems.length <= 1) {
                $siItems = [{...item}]
                return
            }
            let newItems = $siItems.filter(item=>item.sr !== sr)
            newItems.forEach((item, i)=>item.sr = i+1)
            $siItems = newItems
        }
    }

    export const checkError = () => {
        rowErrors = [];
        if (itemParent === "po") {
            $poItems.forEach(item => {
                if (Object.keys(checkEmpty(item)).length > 0) {
                    rowErrors = [...rowErrors, item.sr]
                }
            })
        }
        if (itemParent === "pi") {
            $piItems.forEach(item=>{
                if (Object.keys(checkEmpty(item)).length > 0) {
                    rowErrors = [...rowErrors, item.sr]
                }
            })
        }
        if (itemParent === "so") {
            $soItems.forEach(item=>{
                if (Object.keys(checkEmpty(item)).length > 0) {
                    rowErrors = [...rowErrors, item.sr]
                }
            })
        }
        if (itemParent === "si") {
            $siItems.forEach(item=>{
                if (Object.keys(checkEmpty(item)).length > 0) {
                    rowErrors = [...rowErrors, item.sr]
                }
            })
        }
        return rowErrors
    }
</script>

<section class="flex flex-col">
    <div class="header">
        <span>#</span>
        <span>Item</span>
        <span>Unit</span>
        <span>Quantity</span>
        <span>Price</span>
        <span>Disc.(%)</span>
        <span>Disc.(₹)</span>
        <span>GST (%)</span>
        <span>GST (₹)</span>
        <span>Total</span>
    </div>
    {#if itemParent === "po"}
        {#each $poItems as item, i (i+1)}
            <div class="row {rowErrors.includes(item.sr)?'error':''}">
                <button on:click={()=>{removeRow(item.sr)}}>{item.sr}</button>
                <Select
                    class='select'
                    items={inventory}
                    itemId="id"
                    label="name"
                    value={inventory.filter(it=>it.id===$poItems[i].item_id)[0]}
                    on:change={(e)=>{$poItems[i].item_id = e.detail.id; setItems(i, e); updateTotalPo(i)}}
                    on:clear={()=>{$poItems[i].item_id=""}}
                />
                <span>{$poItems[i].unit_name}</span>
                <input type="text" bind:value={$poItems[i].quantity} on:keyup={updateTotalPo(i)}>
                <input type="text" bind:value={$poItems[i].price} on:keyup={updateTotalPo(i)}>
                <input type="text" bind:value={$poItems[i].discount_rate} on:keyup={updateTotalPo(i)}>
                <span>{Number($poItems[i].discount_amount).toFixed(2)}</span>
                <span>{$poItems[i].gst_rate}</span>
                <span>{Number($poItems[i].gst_amount).toFixed(2)}</span>
                <span>{Number($poItems[i].total).toFixed(2)}</span>
            </div>
        {/each}
        <button class="add-row" disabled={$poItems.length >= 10} on:click={addRow}>+ add row</button>
    {/if}
    {#if itemParent=="pi"}
        {#each $piItems as item, i (i+1)}
            <div class="row {rowErrors.includes(item.sr)?'error':''}">
                <button on:click={()=>{removeRow(item.sr)}}>{item.sr}</button>
                <Select
                    class='select'
                    items={inventory}
                    itemId="id"
                    label="name"
                    value={inventory.filter(it=>it.id===$piItems[i].item_id)[0]}
                    on:change={(e)=>{$piItems[i].item_id = e.detail.id; setItems(i, e); updateTotalPi(i)}}
                    on:clear={()=>{$piItems[i].item_id=""}}
                />
                <span>{$piItems[i].unit_name}</span>
                <input type="text" bind:value={$piItems[i].quantity} on:keyup={updateTotalPi(i)}>
                <input type="text" bind:value={$piItems[i].price} on:keyup={updateTotalPi(i)}>
                <input type="text" bind:value={$piItems[i].discount_rate} on:keyup={updateTotalPi(i)}>
                <span>{Number($piItems[i].discount_amount).toFixed(2)}</span>
                <span>{$piItems[i].gst_rate}</span>
                <span>{Number($piItems[i].gst_amount).toFixed(2)}</span>
                <span>{Number($piItems[i].total).toFixed(2)}</span>
            </div>
        {/each}
        <button class="add-row" disabled={$piItems.length >= 10} on:click={addRow}>+ add row</button>
    {/if}
    {#if itemParent === "so"}
        {#each $soItems as item, i (i+1)}
            <div class="row {rowErrors.includes(item.sr)?'error':''}">
                <button on:click={()=>{removeRow(item.sr)}}>{item.sr}</button>
                <Select
                    class='select'
                    items={inventory}
                    itemId="id"
                    label="name"
                    value={inventory.filter(it=>it.id===$soItems[i].item_id)[0]}
                    on:change={(e)=>{$soItems[i].item_id = e.detail.id; setItems(i, e); updateTotalSo(i)}}
                    on:clear={()=>{$soItems[i].item_id=""}}
                />
                <span>{$soItems[i].unit_name}</span>
                <input type="text" bind:value={$soItems[i].quantity} on:keyup={updateTotalSo(i)}>
                <input type="text" bind:value={$soItems[i].price} on:keyup={updateTotalSo(i)}>
                <input type="text" bind:value={$soItems[i].discount_rate} on:keyup={updateTotalSo(i)}>
                <span>{Number($soItems[i].discount_amount).toFixed(2)}</span>
                <span>{$soItems[i].gst_rate}</span>
                <span>{Number($soItems[i].gst_amount).toFixed(2)}</span>
                <span>{Number($soItems[i].total).toFixed(2)}</span>
            </div>
        {/each}
        <button class="add-row" disabled={$soItems.length >= 10} on:click={addRow}>+ add row</button>
    {/if}
    {#if itemParent === "si"}
        {#each $siItems as item, i (i+1)}
            <div class="row {rowErrors.includes(item.sr)?'error':''}">
                <button on:click={()=>{removeRow(item.sr)}}>{item.sr}</button>
                <Select
                    class='select'
                    items={inventory}
                    itemId="id"
                    label="name"
                    value={inventory.filter(it=>it.id===$siItems[i].item_id)[0]}
                    on:change={(e)=>{$siItems[i].item_id = e.detail.id; setItems(i, e); updateTotalSi(i)}}
                    on:clear={()=>{$soItems[i].item_id=""}}
                />
                <span>{$siItems[i].unit_name}</span>
                <input type="text" bind:value={$siItems[i].quantity} on:keyup={updateTotalSi(i)}>
                <input type="text" bind:value={$siItems[i].price} on:keyup={updateTotalSi(i)}>
                <input type="text" bind:value={$siItems[i].discount_rate} on:keyup={updateTotalSi(i)}>
                <span>{Number($siItems[i].discount_amount).toFixed(2)}</span>
                <span>{$siItems[i].gst_rate}</span>
                <span>{Number($siItems[i].gst_amount).toFixed(2)}</span>
                <span>{Number($siItems[i].total).toFixed(2)}</span>
            </div>
        {/each}
        <button class="add-row" disabled={$siItems.length >= 10} on:click={addRow}>+ add row</button>
    {/if}
</section>

<style>
    section {
        gap: 0rem;
    }
    .header,
    .row {
        display: grid;
        grid-template-columns: 1fr 5fr 2fr 3fr 3fr 1fr 2fr 2fr 2fr 2fr;
        gap: .5rem;
        align-content: center;
        justify-items: center;
    }
    .header {
        box-shadow: var(--bsm);
        border-radius: var(--radius);
        margin-bottom: 5px;
        background: var(--white);
    }
    .header span {
        font-weight: 500;
    }
    .header span,
    .row span {
        width: 100%;
        padding: .2rem 1rem;
        font-size: .85rem;
        font-weight: 500;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .row {
        padding: .2rem;
        border-radius: var(--radius);
    }
    .row button {
        position: relative;
        width: 100%;
        background: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .row button::after {
        content: "X";
        position: absolute;
        inset: 0;
        font-size: 1.25rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white);
        background: var(--warning);
        border-radius: inherit;
        opacity: 0;
        transition: opacity .25s ease-in-out;
    }
    .row button:hover::after {
        opacity: 1;
    }
    .add-row {
        width: 100px;
        margin-top: 5px;
        font-size: .8rem;
        font-weight: 500;
        color: var(--white);
        background: var(--ok);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .error {
        background: var(--warning);
    }
</style>