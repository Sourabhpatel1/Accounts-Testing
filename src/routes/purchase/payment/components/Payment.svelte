<script>
    import { createEventDispatcher } from "svelte";
    import { onMount, onDestroy } from "svelte";
    import { keepNumeric, emptyObj, post } from '$lib/utils/helpers'
    import { apiUrls } from '$lib/utils/urls'
    import { paymentVoucher } from '../paymentStore'

    import Select from "svelte-select";
    import Alert from "$lib/components/Alert.svelte";

    export let currentInvoice

    $paymentVoucher.payment_voucher.doc_type = "Payment Voucher";
    $paymentVoucher.payment_voucher.narration = `Being payment made to ${currentInvoice.vendor.name} for purchase of goods against invoice number P.Inv.-${currentInvoice.invoice.doc_number}`
    
    $paymentVoucher.payment_request.vendor_id = currentInvoice.vendor.id;
    $paymentVoucher.payment_request.pi_id = currentInvoice.invoice.id;

    let paymentErrors = {};

    let invoiceValue = currentInvoice.value + currentInvoice.tax - currentInvoice.discount - currentInvoice.invoice.rounded_off
    let balance = invoiceValue - currentInvoice.payment_amount
    
    let showAlert = false;
    let error = false;
    let message = "";


    const dispatch = createEventDispatcher()

    onMount(()=>{
        document.body.style.overflow = 'hidden'
    })
    onDestroy(()=>{
        document.body.style.overflow = 'visible'
        emptyObj($paymentVoucher)
    })

    const clear = () => {
        paymentErrors = {};
        $paymentVoucher.payment_voucher.doc_date = "";
        $paymentVoucher.payment_voucher.doc_number = "";
        $paymentVoucher.payment_request.amount = "";
    }

    const save = async () => {
        paymentErrors = {}

        if (!$paymentVoucher.payment_voucher.doc_date) {
            paymentErrors.doc_date = true;
        }
        if (!$paymentVoucher.payment_voucher.doc_number) {
            paymentErrors.doc_number = true;
        }
        if (!$paymentVoucher.payment_request.payment_account_id) {
            paymentErrors.payment_account_id = true;
        }
        if (!$paymentVoucher.payment_request.amount) {
            paymentErrors.amount = true;
        }
        if (Object.keys(paymentErrors).length > 0) {
            error = true;
            message = "Fields marked by red background are required, please fill up the required field and try again."
            showAlert = true;
            return;
        }
        if ($paymentVoucher.payment_request.amount > balance) {
            paymentErrors.amount = true;
            message = `Payment Amount of ${Number($paymentVoucher.payment_request.amount).toFixed(2)} is more than the Invoice Balance Due of ${balance.toFixed(2)}.`
            error = true;
            showAlert = true;
            return;
        }
        try {
            const res = await post(apiUrls.purchase + "payment", $paymentVoucher)
            if (res.status) {
                error = false;
                message = `Payment of ${$paymentVoucher.payment_request.amount} to ${currentInvoice.vendor.name} against Purchase Invoice Number P.Inv.-${currentInvoice.invoice.doc_number} is succesfull.`
                showAlert=true;
                return
            } else {
                error = true;
                message = `Payment of ${$paymentVoucher.payment_request.amount} to ${currentInvoice.vendor.name} against Purchase Invoice Number P.Inv.-${currentInvoice.invoice.doc_number} failed.\n${res.response.detail}`
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
            <h3>New Payment</h3>
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
                <input type="text" value="Payment Voucher" disabled>
            </div>
            <div class="group {paymentErrors.doc_date?'error':''}">
                <label for="date">Payment Date</label>
                <input type="date" bind:value={$paymentVoucher.payment_voucher.doc_date}>
            </div>
            <div class="group {paymentErrors.doc_number?'error':''}">
                <label for="number">Payment Voucher Number</label>
                <input type="text" bind:value={$paymentVoucher.payment_voucher.doc_number} on:keydown={(e)=>{keepNumeric(e)}}>
            </div>
        </div>
        <div class="title">
            <h5>Payment Information</h5>
        </div>
        
        <div class="entry-info">
            <div class="group">
                <label for="vendor">Payment To</label>
                <input type="text" value="{currentInvoice.vendor.name}" disabled>
            </div>
            <div class="group">
                <label for="invoice">Payment Against Invoice</label>
                <input type="text" value="P.Inv.-{currentInvoice.invoice.doc_number}" disabled>
            </div>
            <div class="group">
                <label for="inv-date">Invoice Date</label>
                <input type="text" value="{currentInvoice.invoice.doc_date}" disabled>
            </div>
            <div class="group {paymentErrors.payment_account_id?'error':''}">
                <label for="method">Payment Mode</label>
                <Select
                    class='select'
                    id='method'
                    items={[{label : "Cash", value : 3210}, {label : "Bank", value : 3211}]}
                    on:change = {(e)=>{$paymentVoucher.payment_request.payment_account_id=e.detail.value}}
                    on:clear = {()=>{$paymentVoucher.payment_request.payment_account_id=""}}
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
                <label for="previous-payment">Previous Payment</label>
                <input type="text" value="{currentInvoice.payment_amount.toFixed(2)}" disabled>
            </div>
            <div class="group">
                <label for="balance">Invoice Balance Due</label>
                <input type="text" value="{balance.toFixed(2)}" disabled>
            </div>
            <div class="group {paymentErrors.amount?'error':''}">
                <label for="payment-amount">Payment Amount</label>
                <input type="text" placeholder="Enter Payment Amount" bind:value={$paymentVoucher.payment_request.amount} on:keydown={(e)=>{keepNumeric(e)}}>
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