<script>
    export let data;
</script>

<section>
    <div class="print flex-cc">
        <a href="/sales/view_invoice">
            <button style="background: var(--wheat); color:black">Back</button>
        </a>
        <button on:click={()=>{window.print()}}>Print</button>
    </div>
    <div class="invoice printable">
        <div class="header flex-cc">
            <h4>Sales invoice</h4>
        </div>
        <div class="company flex-sb">
            <div class="info">
                <span style="font-weight: 700;">Company :</span>
                <span>ABC Ltd.</span>
                <span>XYZ street, 123 Lane</span>
                <span>Raigarh, Chhattisgarh</span>
                <span>PIN - 496001</span>
                <span>9867543654</span>
                <span>test@test.com</span>
            </div>
            <div class="invoice-info" style="margin-right: 24px;">
                <span style="font-weight: 700;">invoice Details :</span>
                <span>Date : {data.invoice.invoice.doc_date}</span>
                <span>Sales Inv. # : S.Inv-{data.invoice.invoice.doc_number}</span>
            </div>
        </div>
        <hr>
        <div class="customer flex-sb">
            <div class="customer-info">
                <span style="font-weight: 700;">Customer :</span>
                <span>{data.invoice.customer.name}</span>
                <span>{data.invoice.customer.street_address}</span>
                <span>{data.invoice.customer.city}, {data.invoice.customer.state}</span>
                <span>PIN - {data.invoice.customer.postal_code}</span>
                <span>{data.invoice.customer.phone}</span>
                <span>{data.invoice.customer.email}</span>
            </div>
            <div class="ship-info">
                <span style="font-weight: 700;">Shipping Address :</span>
                <span>{data.invoice.customer.name}</span>
                <span>{data.invoice.customer.street_address}</span>
                <span>{data.invoice.customer.city}, {data.invoice.customer.state}</span>
                <span>PIN - {data.invoice.customer.postal_code}</span>
                <span>{data.invoice.customer.phone}</span>
                <span>{data.invoice.customer.email}</span>
            </div>
        </div>
        <div class="items">
            <div class="title">
                <h5 style="width: 100%; text-align:center; font-size:1.2rem">invoice Items</h5>
            </div>
            <hr style="margin-top: 10px;">
            <div class="header">
                <span>#</span>
                <span>Item</span>
                <span>Unit</span>
                <span>Quantity</span>
                <span>Price</span>
                <span>Disc.(%)</span>
                <span>Disc.(₹)</span>
                {#if data.invoice.invoice.state_type === 1}
                    <span>GST (%)</span>
                    <span>GST (₹)</span>
                {/if}
                {#if data.invoice.invoice.state_type === 2}
                    <span>IGST (%)</span>
                    <span>IGST (₹)</span>    
                {/if}
                <span>Total</span>
            </div>
            <hr>
            {#each data.invoice.items as item, i (i+1)}
                <div class="row">
                    <span>{i+1}</span>
                    <span>{item.name}</span>
                    <span>{item.unit_name}</span>
                    <span>{item.quantity}</span>
                    <span>{item.price}</span>
                    <span>{item.discount_rate.toFixed(2)}</span>
                    <span>{item.discount_amount.toFixed(2)}</span>
                    <span>{item.tax_rate.toFixed(2)}</span>
                    <span>{item.tax_amount.toFixed(2)}</span>
                    <span>{((item.price * item.quantity) + item.tax_amount - item.discount_amount).toFixed(2)}</span>
                </div>
            {/each}
        </div>
        <hr>
        <div class="total">
            <p><span>Gross Amount : </span><span>{data.invoice.value.toFixed(2)}</span></p>
            <p><span>Discount : </span><span>{data.invoice.discount.toFixed(2)}</span></p>
            {#if data.invoice.invoice.state_type === 1}
                <p><span>CGST : </span><span>{(data.invoice.tax/2).toFixed(2)}</span></p>
                <p><span>SGST : </span><span>{(data.invoice.tax/2).toFixed(2)}</span></p>
            {/if}
            {#if data.invoice.invoice.state_type === 2}
                <p><span> IGST : </span><span>{data.invoice.tax.toFixed(2)}</span></p>
            {/if}
            <p><span>Total : </span><span>{(data.invoice.value + data.invoice.tax - data.invoice.discount).toFixed(2)}</span></p>
            <p><span>Round Off :</span><span>{data.invoice.invoice.rounded_off.toFixed(2)}</span></p>
            <p><span>Final :</span><span>{(data.invoice.value + data.invoice.tax - data.invoice.discount - data.invoice.invoice.rounded_off).toFixed(2)}</span></p>
        </div>
        <hr>
        <div class="terms">
            <div class="title">
                <h5>Terms and Conditions :</h5>
            </div>
            <div class="text">
                {#each data.invoice.terms.split("\n") as line}
                    <p>{line}</p>
                {/each}
            </div>
        </div>
    </div>
</section>

<style>
    section {
        width: 100%;
        height: 100%;
        padding: .5rem;
    }
    section .print {
        gap: 1rem;
        margin-bottom: 5px;
        width: 100%;
    }
    section .print button {
        font-size: .85rem;
        color: var(--white);
        background: var(--ok);
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .invoice {
        width: 90%;
        margin: auto;
        padding: .5rem;
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .header {
        width: 100%;
    }
    .invoice hr {
        width: 100%;
        margin: auto;
        border: 2px solid;
    }
    .invoice .company,
    .invoice .customer {
        font-size: .75rem;
        margin: 5px 10px;
        /* binvoice-bottom: 2px solid; */
    }
    .invoice .company .info,
    .invoice .company .invoice-info,
    .invoice .customer .customer-info,
    .invoice .customer .ship-info {
        display: grid;
        gap: .1rem;
    }
    .invoice .items .header,
    .invoice .items .row {
        width: 80%;
        margin-left: 125px;
        padding: .1rem 1rem;
        font-size: .9rem;
        display: grid;
        grid-template-columns: 1fr 3fr 2fr 2fr 2fr 2fr 2fr 2fr 2fr 3fr;
        /* align-content: center;
        justify-items: center; */
    }
    .invoice .items .header span,
    .invoice .items .row span {
        width: 100%;
        text-align: right;
    }
    .invoice .items .header {
        font-weight: 600;
    }
    .invoice .total {
        width: 100%;
        margin-top: 10px;
        padding-right: 187px;
        font-size: .9rem;
        text-align: right;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
    }
    .invoice .total p {
        width: 200px;
        display: grid;
        grid-template-columns: 3fr 2fr;

    }
    .invoice .terms {
        width: 100%;
        margin: auto;
        text-align: left;
        /* page-break-before: always !important; */
    }
    @media print {
        .printable {
            width: 100%;
            position: fixed;
            top: 20px;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 1rem;
            visibility: visible;
            /* overflow: hidden; */
            box-shadow: none;
        }
        .printable, .printable * {
            height: auto;
            visibility: visible;
            box-shadow: none;
            box-shadow: none;
        }
        .printable h4 {
            font-size: 24px !important;
        }
        .printable h5 {
            font-size: 18px !important;
        }
        .invoice {
            width: 100% !important;
        }
        .invoice .items .header,
        .invoice .items .row {
            width: 100%;
            margin-left: 0px;
            padding: .2rem 1rem;
            font-size: .9rem;
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            /* align-content: center;
            justify-items: center; */
        }
        .invoice .total {
            padding-right: 15px !important;
        }
    }
</style>