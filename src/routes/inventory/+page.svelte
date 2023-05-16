<script>
    
</script>

<section class="flex flex-col">
    <div class="header">
        <h4>Inventory Items</h4>
    </div>
    <div class="links flex-cc">
        <a href="/inventory/view">View Items</a>
        <a href="/inventory/add">Add New Item</a>
        <a href="/inventory/units">Inventory Units</a>
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