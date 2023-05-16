<script>
    import {page} from '$app/stores'
    $: current = $page.route.id
</script>

<nav class="flex flex-col">
    <div class="logo flex-cc">
        <a href="/" class="flex-cc">
            <h4>Accounts</h4>
        </a>
    </div>
    <div class="menus flex flex-col">
        <a href="/" class="flex-cs {current === "/"?'active':''}" role="button">Dashboard</a>
        <a href="/accounts" class="flex-cs {current.includes("/accounts")?'active':''}" role="button">Accounts</a>
        <a href="/journal" class="flex-cs {current.includes("/journal")?'active':''}" role="button">Journals</a>
        <a href="/parties" class="flex-cs {current.includes("/parties")?'active':''}" role="button">Parties</a>
        <a href="/inventory" class="flex-cs {current.includes("/inventory")?'active':''}" role="button">Inventory</a>
        <a href="/purchase" class="flex-cs {current.includes("/purchase")?'active':''}" role="button">Purchase</a>
        <a href="/sales" class="flex-cs {current.includes("/sales")?'active':''}" role="button">Sales</a>
    </div>
    <div class="settings flex flex-col">
        <div class="header">
            <h5>Settings</h5>
        </div>
        <a href="/settings" class="{current.includes("/settings")?'active':''}" role="button">Settings</a>
    </div>
</nav>

<style>
    nav {
        position: relative;
        width: 200px;
        height: 100dvh;
        padding: .4rem;
        gap: 1rem;
        overflow-y: scroll !important;
    }
    .logo {
        width: 100%;
        padding: .5rem;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
        background: var(--bg-color);
    }
    .logo a {
        width: 100%;
        height: 100%;
        text-decoration: none;
        color: currentColor;
        text-align: center;
    }
    .menus {
        height: 100%;
        /* flex-grow: 1; */
    }
    .menus,
    .settings {
        width: 100%;
        padding: 1rem;
        gap: 1rem;
        box-shadow: var(--bsm);
        border-radius: var(--radius);
    }
    .settings .header {
        width: 100%;
        text-align: center;
    }
    .menus a,
    .settings a {
        width: 100%;
        padding: .6rem 1rem;
        font-size: .9rem;
        font-weight: 500;
        text-decoration: none;
        color: currentColor;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
        transition: background 0.5s ease;
    }
    .active {
        background: var(--primary);
        color: white !important;
    }
</style>