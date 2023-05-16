<script>
    import { createEventDispatcher } from "svelte";
    import { onMount, onDestroy } from "svelte";
    import { keepNumeric, emptyObj, post } from '$lib/utils/helpers'
    import { apiUrls } from '$lib/utils/urls'
    import { receiptVoucher } from '../receiptStore'

    import Select from "svelte-select";
    import Alert from "$lib/components/Alert.svelte";

    export let currentInvoice

    $receiptVoucher.receipt_voucher.doc_type = "Receipt Voucher";
    $receiptVoucher.receipt_voucher.narration = `Being payment received from ${currentInvoice.customer.name} for sale of goods against invoice number S.Inv.-${currentInvoice.invoice.doc_number}`
    
    $receiptVoucher.receipt_request.customer_id = currentInvoice.customer.id;
    $receiptVoucher.receipt_request.si_id = currentInvoice.invoice.id;

    let receiptErrors = {};

    let invoiceValue = currentInvoice.value + currentInvoice.tax - currentInvoice.discount - currentInvoice.invoice.rounded_off
    let balance = invoiceValue - currentInvoice.receipt_amount
    
    let showAlert = false;
    let error = false;
    let message = "";


    const dispatch = createEventDispatcher()

    onMount(()=>{
        document.body.style.overflow = 'hidden'
    })
    onDestroy(()=>{
        document.body.style.overflow = 'visible'
        emptyObj($receiptVoucher)
    })

    const clear = () => {
        receiptErrors = {};
        $receiptVoucher.receipt_voucher.doc_date = "";
        $receiptVoucher.receipt_voucher.doc_number = "";
        $receiptVoucher.receipt_voucher.amount = "";
    }

    const save = async () => {
        receiptErrors = {}

        if (!$receiptVoucher.receipt_voucher.doc_date) {
            receiptErrors.doc_date = true;
        }
        if (!$receiptVoucher.receipt_voucher.doc_number) {
            receiptErrors.doc_number = true;
        }
        if (!$receiptVoucher.receipt_request.receipt_account_id) {
            receiptErrors.receipt_account_id = true;
        }
        if (!$receiptVoucher.receipt_request.amount) {
            receiptErrors.amount = true;
        }
        if (Object.keys(receiptErrors).length > 0) {
            error = true;
            message = "Fields marked by red background are required, please fill up the required field and try again."
            showAlert = true;
            return;
        }
        if ($receiptVoucher.receipt_request.amount > balance) {
            receiptErrors.amount = true;
            message = `Receipt Amount of ${Number($receiptVoucher.receipt_request.amount).toFixed(2)} is more than the Invoice Balance Due of ${balance.toFixed(2)}.`
            error = true;
            showAlert = true;
            return;
        }
        try {
            const res = await post(apiUrls.sales + "receipt", $receiptVoucher)
            if (res.status) {
                error = false;
                message = `Receipt of ${$receiptVoucher.receipt_request.amount} from ${currentInvoice.customer.name} against Sales Invoice Number S.Inv.-${currentInvoice.invoice.doc_number} is succesfull.`
                showAlert=true;
                return
            } else {
                error = true;
                message = `Receipt of ${$receiptVoucher.receipt_request.amount} to ${currentInvoice.customer.name} against Sales Invoice Number S.Inv.-${currentInvoice.invoice.doc_number} failed.\n${res.response.detail}`
                showAlert=true;
                return;
            }
        } catch (err) {
            console.log(err)
        }
    }

</script>

{#if showAlert}
    <Alert {error} {message} on:close={()=>{
        if (!error) {
            window.location.reload()
        } else {
            showAlert = false;
        }
    }}/>
{/if}
<section class="flex-cc">
    <div class="payment">
        <div class="header flex-sb">
            <h3>New Receipt</h3>
            <div class="actions">
                <button style="background:var(--warning)" on:click={()=>{clear()}}>Clear</button>
                <button style="background: var(--ok);" on:click={()=>{save()}}>Save</button>
            </div>
        </div>
        <hr>
        <div class="title">
            <h5>Voucher Information</h5>
        </div>
    
        <div class="voucher">
            <div class="group">
                <label for="type">Voucher Type</label>
                <input type="text" value="Receipt Voucher" disabled>
            </div>
            <div class="group {receiptErrors.doc_date?'error':''}">
                <label for="date">Receipt Date</label>
                <input type="date" bind:value={$receiptVoucher.receipt_voucher.doc_date}>
            </div>
            <div class="group {receiptErrors.doc_number?'error':''}">
                <label for="number">Receipt Voucher Number</label>
                <input type="text" bind:value={$receiptVoucher.receipt_voucher.doc_number} on:keydown={(e)=>{keepNumeric(e)}}>
            </div>
        </div>
        <div class="title">
            <h5>Receipt Information</h5>
        </div>
        
        <div class="entry-info">
            <div class="group">
                <label for="vendor">Receved From</label>
                <input type="text" value="{currentInvoice.customer.name}" disabled>
            </div>
            <div class="group">
                <label for="invoice">Receved Against Invoice</label>
                <input type="text" value="S.Inv.-{currentInvoice.invoice.doc_number}" disabled>
            </div>
            <div class="group">
                <label for="inv-date">Invoice Date</label>
                <input type="text" value="{currentInvoice.invoice.doc_date}" disabled>
            </div>
            <div class="group {receiptErrors.receipt_account_id?'error':''}">
                <label for="method">Receving Mode</label>
                <Select
                    class='select'
                    id='method'
                    items={[{label : "Cash", value : 3210}, {label : "Bank", value : 3211}]}
                    on:change = {(e)=>{$receiptVoucher.receipt_request.receipt_account_id=e.detail.value}}
                    on:clear = {()=>{$receiptVoucher.receipt_request.receipt_account_id=""}}
                />
            </div>
        </div>
        <div class="title">
            <h5>Amount</h5>
        </div>
        
        <div class="payment-info">
            <div class="group">
                <label for="inv-amount">Invoice Amount</label>
                <input type="text" value="{invoiceValue.toFixed(2)}" disabled>
            </div>
            <div class="group">
                <label for="previous-payment">Previous Receipt</label>
                <input type="text" value="{currentInvoice.receipt_amount.toFixed(2)}" disabled>
            </div>
            <div class="group">
                <label for="balance">Invoice Balance</label>
                <input type="text" value="{balance.toFixed(2)}" disabled>
            </div>
            <div class="group {receiptErrors.amount?'error':''}">
                <label for="payment-amount">Receved Amount</label>
                <input type="text" placeholder="Enter Payment Amount" bind:value={$receiptVoucher.receipt_request.amount} on:keydown={(e)=>{keepNumeric(e)}}>
            </div>
        </div>
        <button class="close flex-cc" on:click={()=>{dispatch('close')}}>X</button>
    </div>
</section>

<style>
    section {
        position: absolute;
        inset: 0;
        background: rgba(0 0 0 / 0.5);
        backdrop-filter: blur 5px;
        z-index: 9;
    }
    section .header {
        width: 100%;
        padding: 0 1rem;
    }
    section .header .actions button {
        font-size: .8rem;
        font-weight: 600;
        color: var(--white);
        border-radius: var(--radius);
    }
    section hr {
        border: 2px solid;
    }
    section input:disabled {
        background: var(--light-gray);
        box-shadow: var(--bsl);
    }
    section .title {
        width: 100%;
        padding: .2rem 1rem;
    }
    section .title h5 {
        font-size: 1.25rem !important;
    }
    section .payment {
        position: relative;
        width: 45%;
        padding: 1rem;
        background: var(--bg-color);
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .voucher,
    .entry-info,
    .payment-info {
        margin: 15px 0;
        padding: 0 1rem;
        display: grid;
        gap: 1rem;
    }
    .voucher {
        grid-template-columns: repeat(3, 1fr);
    }
    .entry-info {
        grid-template-columns: repeat(2, 1fr);
    }
    .payment-info {
        grid-template-columns: repeat(2, 1fr);
    }
    .group {
        width: 100%;
        padding: .5rem;
        display: grid;
        gap: .3rem;
    }
    .group label {
        width: 100%;
        font-size: 1rem;
        font-weight: 500;
        /* background: rebeccapurple; */
    }
    .close {
        position: absolute;
        top: -15px;
        right: -15px;
        width: 40px;
        height: 40px;
        font-size: 1.25rem;
        font-weight:800;
        background: var(--warning);
        color: var(--white);
        border-radius: 50%;
    }
    .error {
        background: var(--warning);
        border-radius: var(--radius);
    }
</style>