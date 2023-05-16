<script>
    export let data;
</script>

<section>
    <div class="print flex-cc">
        <a href="/purchase/view_po">
            <button style="background: var(--wheat); color:black">Back</button>
        </a>
        <button on:click={()=>{window.print()}}>Print</button>
    </div>
    <div class="order printable">
        <div class="header flex-cc">
            <h4>Purchase Order</h4>
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
            <div class="order-info" style="margin-right: 24px;">
                <span style="font-weight: 700;">Order Details :</span>
                <span>Date : {data.order.order.doc_date}</span>
                <span>PO # : PO-{data.order.order.doc_number}</span>
            </div>
        </div>
        <hr>
        <div class="vendor flex-sb">
            <div class="vendor-info">
                <span style="font-weight: 700;">Vendor :</span>
                <span>{data.order.vendor.name}</span>
                <span>{data.order.vendor.street_address}</span>
                <span>{data.order.vendor.city}, {data.order.vendor.state}</span>
                <span>PIN - {data.order.vendor.postal_code}</span>
                <span>{data.order.vendor.phone}</span>
                <span>{data.order.vendor.email}</span>
            </div>
            <div class="ship-info">
                <span style="font-weight: 700;">Shipping Address :</span>
                <span>ABC Ltd.</span>
                <span>XYZ street, 123 Lane</span>
                <span>Raigarh, Chhattisgarh</span>
                <span>PIN - 496001</span>
                <span>9867543654</span>
                <span>test@test.com</span>
            </div>
        </div>
        <div class="items">
            <div class="title">
                <h5 style="width: 100%; text-align:center; font-size:1.2rem">Order Items</h5>
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
                {#if data.order.order.state_type === 1}
                    <span>GST (%)</span>
                    <span>GST (₹)</span>
                {/if}
                {#if data.order.order.state_type === 2}
                    <span>IGST (%)</span>
                    <span>IGST (₹)</span>    
                {/if}
                <span>Total</span>
            </div>
            <hr>
            {#each data.order.items as item, i (i+1)}
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
            <p><span>Gross Amount : </span><span>{data.order.value.toFixed(2)}</span></p>
            <p><span>Discount : </span><span>{data.order.discount.toFixed(2)}</span></p>
            {#if data.order.order.state_type === 1}
                <p><span>CGST : </span><span>{(data.order.tax/2).toFixed(2)}</span></p>
                <p><span>SGST : </span><span>{(data.order.tax/2).toFixed(2)}</span></p>
            {/if}
            {#if data.order.order.state_type === 2}
                <p><span> IGST : </span><span>{data.order.tax.toFixed(2)}</span></p>
            {/if}
            <p><span>Total : </span><span>{(data.order.value + data.order.tax - data.order.discount).toFixed(2)}</span></p>
        </div>
        <hr>
        <div class="terms">
            <div class="title">
                <h5>Terms and Conditions :</h5>
            </div>
            <div class="text">
                {#each data.order.terms.split("\n") as line}
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
    .order {
        width: 90%;
        margin: auto;
        padding: .5rem;
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .header {
        width: 100%;
    }
    .order hr {
        width: 100%;
        margin: auto;
        border: 2px solid;
    }
    .order .company,
    .order .vendor {
        font-size: .75rem;
        margin: 5px 10px;
        /* border-bottom: 2px solid; */
    }
    .order .company .info,
    .order .company .order-info,
    .order .vendor .vendor-info,
    .order .vendor .ship-info {
        display: grid;
        gap: .1rem;
    }
    .order .items .header,
    .order .items .row {
        width: 80%;
        margin-left: 125px;
        padding: .1rem 1rem;
        font-size: .9rem;
        display: grid;
        grid-template-columns: 1fr 3fr 2fr 2fr 2fr 2fr 2fr 2fr 2fr 3fr;
        /* align-content: center;
        justify-items: center; */
    }
    .order .items .header span,
    .order .items .row span {
        width: 100%;
        text-align: right;
    }
    .order .items .header {
        font-weight: 600;
    }
    .order .total {
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
    .order .total p {
        width: 200px;
        display: grid;
        grid-template-columns: 3fr 2fr;

    }
    .order .terms {
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
        .order {
            width: 100% !important;
        }
        .order .items .header,
        .order .items .row {
            width: 100%;
            margin-left: 0px;
            padding: .2rem 1rem;
            font-size: .9rem;
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            /* align-content: center;
            justify-items: center; */
        }
        .order .total {
            padding-right: 15px !important;
        }
    }
</style>