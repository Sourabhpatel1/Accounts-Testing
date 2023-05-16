<script>
	import { apiUrls } from '$lib/utils/urls';
	import Alert from '$lib/components/Alert.svelte';
	import Select from 'svelte-select';
    import { onMount, tick } from 'svelte';
    
    export let data;

    const current = data?.businesses?.filter(b=>b.is_active)[0] || []

    let selectedActiveId = null;
    let selectError = false;

    let message = "";
    let error = false;
    let showAlert = false;

    const changeActive = async () => {
        selectError = false;
        if (!selectedActiveId) {
            message = "Please select and active business from the dropdown in the area marked by red border";
            error = true;
            showAlert = true;
            selectError = true;
            return;
        }
        try {
            const res = await fetch(apiUrls.business + selectedActiveId, {
                method : "PATCH"
            })
            const response = await res.json()

            if (res.ok) {
                message = "Active business changed succesfully."
                error = false;
                showAlert=true;
                return
            } else {

                message = response.detail;
                error = true;
                showAlert = true;
                return
            }
        } catch (error) {
            
        }
    }

    onMount( async ()=>{
        await tick()
        const address = document.getElementById('address')
        const colon = document.getElementById('colon')
        const addressValue = document.getElementById('addressValue')

        address.style.height = addressValue.clientHeight + "px"
        colon.style.height = addressValue.clientHeight + "px"
    })

</script>

{#if showAlert}
    <Alert {error} {message} on:close={()=>{showAlert=false}}/>
{/if}

<section class="flex flex-col">
    <div class="header flex-sb">
        <button on:click={()=>{history.back()}}>Back</button>
        <h4>Manage Businesses</h4>
        <button class="add">
            <a href="/settings/business/new">
                Add New
            </a> 
        </button>
    </div>
    <div class="current flex flex-col">
        <h5>Current Active Business</h5>
        <div class="info">
            <div class="fields">
                <span>Name</span>
                <span>GST No.</span>
                <span>Contact</span>
                <span>Email</span>
                <span id="address">Address</span>
                <span>City</span>
                <span>State</span>
                <span>Country</span>
                <span>Postal Code</span>
            </div>
            <div class="colons">
                <span>:</span>
                <span>:</span>
                <span>:</span>
                <span>:</span>
                <span id="colon">:</span>
                <span>:</span>
                <span>:</span>
                <span>:</span>
                <span>:</span>
            </div>
            <div class="values">
                <span>{current.name}</span>
                <span>{current.gst}</span>
                <span>{current.phone}</span>
                <span>{current.email}</span>
                <span id="addressValue">{current.street_address}</span>
                <span>{current.city}</span>
                <span>{current.state}</span>
                <span>{current.country}</span>
                <span>{current.postal_code}</span>
            </div>
        </div>
    </div>
    <div class="change {selectError?'error':''}">
        <h5>Change Active Business</h5>
        <div class="set flex-cc flex-col">
            <Select
                class="select"
                id="select"
                items={data.businesses}
                itemId="id"
                label="name"
                placeholder="Please Select A Business To Set As Active"
                on:change = {(e)=>{selectedActiveId=e.detail.id}}
                on:clear = {()=>{selectedActiveId=null}}
            />
            <button on:click={changeActive}>Change Active</button>
        </div>
    </div>
</section>

<style>
    section {
        width: 100%;
        padding: 1rem;
        gap: .5rem;
        align-items: center;
    }
    section > .header {
        width: 100%;
        padding: .5rem 1rem;                       
    }
    section .header button {
        font-size: 1rem;
        font-weight: 500;
        width: 125px;
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .add {
        color: var(--white);
        background: var(--ok);
    }
    .add > a {
        text-decoration: none;
        color: currentColor;
    }
    section .header h4 {
        width: 100%;
        text-align: center;

    }
    .current,
    .change {
        width: 450px;
        max-height: 700px;
        padding: 1rem;
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .current h5,
    .change h5 {
        padding: .2rem 0 ;
        text-align: center;
        border-bottom: 3px solid;
    }
    .current .info {
        display: grid;
        grid-template-columns: 4fr 1fr 1fr;
        gap: .2rem;
        border-bottom: 3px solid;
    }
    .current .info .fields,
    .current .info .values,
    .current .info .colons {
        width: 100%;
        padding: 1rem;
        font-size: 1rem;
        display: grid;
        align-content: flex-start;
        gap: 1rem;
    }
    .current .info .fields span:nth-child(5),
    .current .info .values span:nth-child(5),
    .current .info .colons span:nth-child(5) {
        max-height: 75px;
    }
    .change .set {
        margin-top: 10px;
        padding: .5rem;
        gap: 3rem;
    }
    .change .set button {
        font-size: .9rem;
        font-weight: 500;
        color: var(--white);
        background: var(--ok);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
        width: 200px;
    }
    .error {
        border: var(--warning) 2px solid;
    }
</style>