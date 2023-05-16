<script>
    import { browser } from '$app/environment'
    import { apiUrls } from '$lib/utils/urls'
    import {post, emptyObj, checkEmpty, validateEmail, validatePhone, validateGst, validatePin } from '$lib/utils/helpers'
    import { party } from './partyStore'

    import Alert from '$lib/components/Alert.svelte'

    let current = "Customer"

    let customerError = {};
    let vendorError = {};

    let message;
    let error = false;
    let showAlert = false;
    
    let editedVendor = false;
    let editedCustomer = false;

    const changeVendorEdited = () =>{
        if (current === "Vendor") {
            if (browser) {
                document.querySelectorAll('input').forEach(i=>{
                    i.addEventListener('keydown', ()=>{
                        editedVendor = true;
                    })
                })
            }
        }
    }

    const changeCustomerEdited = () =>{
        if (current === "Customer") {
            if (browser) {
                document.querySelectorAll('input').forEach(i=>{
                    i.addEventListener('keydown', ()=>{
                        editedCustomer = true;
                    })
                })
            }
        }
    }

    const clear = () => {
        if (current === "Customer") {
            $party.Customer = emptyObj($party.Customer)
            customerError = {};
            editedCustomer = false
        } else if (current === "Vendor") {
            $party.Vendor = emptyObj($party.Vendor)
            vendorError = {};
            editedVendor = false;
        }
    }
    const save = async () => {
        let post_url;
        if (current === "Customer") {
            
            vendorError = {};
            customerError = {};
            
            changeCustomerEdited()

            post_url = apiUrls.customer;

            customerError = checkEmpty($party.Customer);
            if (Object.keys(customerError).length > 0) {
                message = "Fields marked with red background are required, if gst number for a party is not available please type N/A in the gst field.";
                error = true;
                showAlert = true;
                return;
            }
            if (!validatePhone($party.Customer.phone)) {
                message = "Phone number must be atleast 10 digits long, please enter a valid phone number.";
                error = true;
                showAlert = true;
                return;
            }
            if (!validateEmail($party.Customer.email)) {
                message = "Please enter a valid email id, if email is not available please enter a@b.com";
                error = true;
                showAlert = true;
                return;
            }
            if (!validateGst($party.Customer.gst)) {
                message = "Please enter a valid gst number, if gst number for a party is not available please type N/A in the gst field.";
                error = true;
                showAlert = true;
                return
            }
            if (!validatePin($party.Customer.postal_code)) {
                message = "Please enter a valid postal code, postal code must be numerical and must be 5 digits long.";
                error = true;
                showAlert = true;
                return;
            }
        }
        if (current === "Vendor") {
            
            vendorError = {}
            customerError = {}
            
            changeVendorEdited()

            post_url = apiUrls.vendor;

            vendorError = checkEmpty($party.Vendor);
            if (Object.keys(vendorError).length > 0) {
                message = "Fields marked with red background are required, if gst number for a party is not available please type N/A in the gst field.";
                error = true;
                showAlert = true;
                return;
            }
            if (!validatePhone($party.Vendor.phone)) {
                message = "Phone number must be atleast 10 digits long, please enter a valid phone number.";
                error = true;
                showAlert = true;
                return;
            }
            if (!validateEmail($party.Vendor.email)) {
                message = "Please enter a valid email id, if email is not available please enter a@b.com";
                error = true;
                showAlert = true;
                return;
            }
            if (!validateGst($party.Vendor.gst)) {
                message = "Please enter a valid gst number, if gst number for a party is not available please type N/A in the gst field.";
                error = true;
                showAlert = true;
                return
            }
            if (!validatePin($party.Vendor.postal_code)) {
                message = "Please enter a valid postal code, postal code must be numerical and must be 5 digits long.";
                error = true;
                showAlert = true;
                return;
            }
        }
        try {
            let body = current === "Customer" ? $party.Customer : current === "Vendor" ? $party.Vendor : null
            if (! body) {
                error = true;
                message = `Could not get the field values for ${current}`
                showAlert = true;
                return;
            }
            const res = await post(post_url, body)
            if (res.status) {
                error = false;
                message = `${current} ${body.name} added succesfully`
                showAlert = true;
                clear()
            } else {
                error = true;
                message = res.response.detail;
                showAlert = true;
                return
            }
        } catch (error) {
            console.log(error)
        }
    }
</script>
{#if showAlert}
    <Alert {error} {message} on:close={()=>{error = false; showAlert = false;}}/>
{/if}
<section class="flex flex-col">
    <div class="header">
        <h4>Create Parties</h4>
    </div>
    <div class="select flex-cc">
        <button 
            class="{current==="Customer"?'active':''}" 
            on:click={()=>{
                current="Customer"; 
                if (editedCustomer) {
                    customerError = checkEmpty($party.Customer); 
                }
                vendorError = {};
            }}
        >
            Create Customer
        </button>
        <button 
            class="{current==="Vendor"?'active':''}" 
            on:click={()=>{
                current = "Vendor"
                if (editedVendor){
                    vendorError = checkEmpty($party.Vendor)
                }
                customerError = {};
            }}
        >
            Create Vendor
        </button>
    </div>
    <div class="create-form flex flex-col">
        <div class="header flex-sb">
            <h4>Create {current}</h4>
            <div class="actions flex-sb">
                <button class="clear flex-cc" on:click={clear}>Clear</button>
                <button class="save flex-cc" on:click={save}>Save</button>
            </div>
        </div>
        <div class="group {customerError.name?'error':''} {vendorError.name?'error':''}">
            <label for="name">{current} Name</label>
            <input type="text" name="name" id="name" bind:value={$party[current].name}>
        </div>
        <div class="group {customerError.phone?'error':''} {vendorError.phone?'error':''}">
            <label for="phone">{current} Phone</label>
            <input type="text" name="phone" id="phone" bind:value={$party[current].phone}>
        </div>
        <div class="group {customerError.email?'error':''} {vendorError.email?'error':''}">
            <label for="email">{current} Email</label>
            <input type="text" name="email" id="email" bind:value={$party[current].email}>
        </div>
        <div class="group {customerError.gst?'error':''} {vendorError.gst?'error':''}">
            <label for="gst">{current} GST No.</label>
            <input type="text" name="gst" id="gst" bind:value={$party[current].gst}>
        </div>
        <div class="group {customerError.street_address?'error':''} {vendorError.street_address?'error':''}">
            <label for="address">Street Address</label>
            <input type="text" name="address" id="address" bind:value={$party[current].street_address}>
        </div>
        <div class="group {customerError.city?'error':''} {vendorError.city?'error':''}">
            <label for="city">City </label>
            <input type="text" name="city" id="city" bind:value={$party[current].city}>
        </div>
        <div class="group {customerError.state?'error':''} {vendorError.state?'error':''}">
            <label for="state">State </label>
            <input type="text" name="state" id="state" bind:value={$party[current].state}>
        </div>
        <div class="group {customerError.country?'error':''} {vendorError.country?'error':''}">
            <label for="country">Country </label>
            <input type="text" name="country" id="country" bind:value={$party[current].country}>
        </div>
        <div class="group {customerError.postal_code?'error':''} {vendorError.postal_code?'error':''}">
            <label for="code">Postal Code</label>
            <input type="text" name="code" id="code" bind:value={$party[current].postal_code}>
        </div>
    </div>
</section>

<style>
    section {
        width: 100%;
        padding: 1rem 0;
        gap: .5rem;
    }
    section > .header {
        padding: .5rem 1rem;                       
    }
    section .header h4 {
        width: 100%;
        text-align: center;

    }
    .select {
        width: 100%;
        padding: 1rem 1rem 1rem 1rem;
        gap: 2rem;
    }
    .select button {
        min-width: 200px;
        max-width: 300px;
        flex-grow: 1;
        padding: 1rem;
        font-size: 1rem;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .select button.active {
        background: var(--primary);
        color: var(--white);
    }
    .create-form {
        width: 50%;
        margin: 0 auto;
        padding: 1rem;
        box-shadow: var(--bsm);
        border-radius: var(--radius);
        gap: 1rem;
    }
    .create-form .header {
        width: 100%;
        padding: .5rem 1rem;
        text-transform: uppercase;
        border-bottom: 2px solid;
    }
    .create-form .header h4 {
        width: 100%;
        text-align: left;
    }
    .create-form .header .actions {
        gap: .5rem;
    }
    .create-form .group {
        width: 100%;
        padding: .5rem 1rem;
        display: grid;
        grid-template-columns: 1fr 4fr;
        align-content: center;
        justify-items: center;
    }
    .create-form .group label {
        width: 100%;
        font-size: 1rem;
        font-weight: 500;
        display: flex;
        align-items: center;
    }
    .save,
    .clear {
        height: 30px;
        font-size: 1rem;
        font-weight: 500;
        color: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .save {
        background: var(--ok);
    }
    .clear {
        background: var(--warning);
    }
    .error {
        background: var(--warning);
        border-radius: var(--radius);
    }
</style>
