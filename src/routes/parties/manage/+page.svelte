<script>
    export let data;
    
    let customers = data.customers;
    let vendors = data.vendors;

    let current = "customers"
    let editingRow = null

    let name;
    let phone;
    let email;
    let gst;
    let state;
    let code;



    
    const filter = () => {
        customers = data.customers;
        vendors = data.vendors;

        let party = current === "customers" ? customers : current === "vendors" ? vendors : null
        
        if (!party) {
            alert("Could not determine parties")
        }
        if (name) {
            party = party.filter(p=>p.name.toLowerCase().includes(name.toLowerCase()))
        }
        if (phone) {
            party = party.filter(p=>String(p.phone).includes(phone))
        }
        if (email) {
            party = party.filter(p=>p.email.toLowerCase().includes(email.toLowerCase()))
        }
        if (gst) {
            party = party.filter(p=>p.gst.toLowerCase().includes(gst.toLowerCase()))
        }
        if (state) {
            party = party.filter(p=>p.state.toLowerCase().includes(state.toLowerCase()))
        }
        if (code) {
            party = party.filter(p=>String(p.postal_code).includes(code))
        }
        if (current === 'customers') {
            customers = party
        }
        if (current === 'vendors') {
            vendors = party
        }
    }

    const save = async () => {
        let party = current === "customers" ? customers[editingRow] : current === "vendors" ? vendors[editingRow] : null
        if (!party) {
            alert("Could not determine party")
        }
        console.log(party)
    }

</script>

<section class="flex flex-col">
    <div class="header">
        <h4>Manage Parties</h4>
    </div>
    <div class="tabs flex-cc">
        <button class="{current==='customers'?'active':''}" on:click={()=>{current = "customers"; editingRow=null}}>Customers</button>
        <button class="{current==='vendors'?'active':''}" on:click={()=>{current="vendors"; editingRow = null}}>Vendors</button>
    </div>
    <div class="filters">
        <div class="group">
            <label for="name">Filter by name</label>
            <input type="text" name="name" id="name" bind:value={name} on:keyup={filter} autocomplete="off">
        </div>
        <div class="group">
            <label for="phone">Filter by phone number</label>
            <input type="text" name="phone" id="phone" bind:value={phone} on:keyup={filter} autocomplete="off">
        </div>
        <div class="group">
            <label for="email">Filter by email</label>
            <input type="text" name="email" id="email" bind:value={email} on:keyup={filter} autocomplete="off">
        </div>
        <div class="group">
            <label for="gst">Filter by gst number</label>
            <input type="text" name="gst" id="gst" bind:value={gst} on:keyup={filter} autocomplete="off">
        </div>
        <div class="group">
            <label for="state">Filter by state</label>
            <input type="text" name="state" id="state" bind:value={state} on:keyup={filter} autocomplete="off">
        </div>
        <div class="group">
            <label for="code">Filter by postal code</label>
            <input type="text" name="code" id="code" bind:value={code} on:keyup={filter} autocomplete="off">
        </div>
    </div>
    <div class="parties">
        <div class="header">
            <span>#</span>
            <span>Name</span>
            <span>Phone</span>
            <span>Email</span>
            <span>GST No.</span>
            <span>Address</span>
            <span>City</span>
            <span>Sate</span>
            <span>Country</span>
            <span>Postal Code</span>
            <span>Actions</span>
        </div>
        {#each current==="customers"?customers : current === "vendors"? vendors : [] as party, i (i+1)}
            <div class="row" id="{i}">
                <span>{i+1}</span>
                <input type="text" class="party-field" bind:value="{party.name}" disabled>
                <input type="text" class="party-field" bind:value="{party.phone}" disabled={editingRow!==i}>
                <input type="text" class="party-field" bind:value="{party.email}" disabled={editingRow!==i}>
                <input type="text" class="party-field" bind:value="{party.gst}" disabled={editingRow!==i}>
                <input type="text" class="party-field" bind:value="{party.street_address}" disabled={editingRow!==i}>
                <input type="text" class="party-field" bind:value="{party.city}" disabled={editingRow!==i}>
                <input type="text" class="party-field" bind:value="{party.state}" disabled={editingRow!==i}>
                <input type="text" class="party-field" bind:value="{party.country}" disabled={editingRow!==i}>
                <input type="text" class="party-field" bind:value="{party.postal_code}" disabled={editingRow!==i}>
                <div class="actions">
                    {#if editingRow !== i}
                        <button on:click={()=>{editingRow = i}}>Edit</button>
                    {/if}
                    {#if  editingRow === i}
                        <button class="save" on:click={()=>{save()}}>Save</button>
                        <button class="cancel" on:click={()=>{editingRow=null}}>X</button>
                    {/if}
                </div>
            </div>
        {/each}
        
    </div>
</section>

<style>
    section {
        height: 100%;
        padding: .5rem 1rem;
        gap: .5rem;
        overflow: scroll;
    }
    section .header {
        width: 100%;
        padding: .5rem 1rem;
    }
    section .header h4 {
        width: 100%;
        text-align: center;

    }
    .tabs {
        width: 100%;
        gap: 1rem;
    }
    .tabs button {
        width: 200px;
        font-size: 1rem;
        font-weight: 500;
        background: white;
        box-shadow: var(--bsm);
        border-radius: var(--radius);
    }
    .filters {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 1rem;
    }
    .filters .group {
        width: 100%;
        display: grid;
        gap: .5rem;
    }
    .filters .group label {
        font-size: 1rem;
        font-weight: 500;
    }
    .parties {
        position: relative;
        width: 100%;
        height: 78vh;
        overflow: scroll;
    }
    .parties .header,
    .parties .row {
        width: 100%;
        padding: .2rem 1rem;
        display: grid;
        grid-template-columns: 1fr 2fr 2fr 2fr 2fr 4fr 2fr 2fr 2fr 2fr .5fr;
        gap: .5rem;
        align-content: center;
        justify-items: center;
    }
    .parties .header {
        position: sticky;
        top: 0;
        font-size: 1rem;
        font-weight: 700;
        background: var(--bg-color);
        box-shadow: var(--bsm);
        border-radius: var(--radius);
    }
    .parties .row button {
        font-size: .7rem;
        padding: .5rem 1rem;
        background: var(--wheat);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .parties .row .actions {
        max-width: 100%;
        display: grid;
        gap: 2px;
        align-content: center;
        justify-items: flex-end;
    }
    .parties .row .actions button {
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .party-field {
        padding: 0;
        font-size: .75rem;
        text-align: center;
        box-shadow: none;
        background: var(--bg-color);
    }
    .party-field:not(:disabled) {
        box-shadow: var(--bsm);
    }
    .save {
        background: var(--ok) !important;
        color: var(--white);
    }
    .cancel {
        background:  var(--warning) !important;
        color: var(--white);
    }
    .active {
        background: var(--primary) !important;
        color: var(--white);
    }
</style>
