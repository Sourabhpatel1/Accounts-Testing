<script>

</script>

<section class="flex flex-col">
    <div class="header">
        <h4>Purchase</h4>
    </div>
    <div class="links flex-cc">
        <a href="/purchase/new_po">New Purchase Order</a>
        <a href="/purchase/new_invoice">New Purchase Invoice</a>
        <a href="/purchase/view_po">View Purchase Orders</a>
        <a href="/purchase/view_invoice">View Purchase Invoices</a>
        <a href="/purchase/payment">Purchase Payment</a>
    </div>
</section>

<style>
    section {
        width: 100%;
        padding: 1rem 0;
        gap: .5rem;
    }
    section .header {
        padding: .5rem 1rem;
    }
    section .header h4 {
        width: 100%;
        text-align: center;

    }
    .links {
        padding: 1rem;
        gap: .5rem;
    }
    .links a {
        min-width: 200px;
        max-width: 300px;
        flex-grow: 1;
        padding: 1rem;
        font-size: 1rem;
        text-decoration: none;
        color: currentColor;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }                                          
</style>