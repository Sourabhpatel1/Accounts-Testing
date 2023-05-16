<script>
    import { apiUrls } from '$lib/utils/urls'
    import { writable } from 'svelte/store';
    
    import {post, emptyObj, checkEmpty, validateEmail, validatePhone, validateGst, validatePin } from '$lib/utils/helpers'
    import Alert from '$lib/components/Alert.svelte'
    import Select from 'svelte-select/Select.svelte';

    $: start_day = null;
    $: start_month = null;

    $: end_day = null;
    $: end_month = null;

    let newBusiness = writable({
        name : "",
        gst : "",
        phone : "",
        email : "",
        street_address : "",
        city : "",
        state : "",
        country : "",
        postal_code : "",
        fy_start : "",
        fy_end : ""
    })

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    let businessError = {};

    let message;
    let error = false;
    let showAlert = false;

    const clear = () => {
        $newBusiness = emptyObj($newBusiness)
        businessError = {};
    }

    const save = async () => {
        businessError = {}

        let post_url = apiUrls.business;
        
        $newBusiness.fy_start = (start_day && start_month)?`${start_day}-${start_month}`:""
        $newBusiness.fy_end = (end_day && end_month)?`${end_day}-${end_month}`:""

        businessError = checkEmpty($newBusiness);
        
        if (Object.keys(businessError).length > 0) {
            message = "Fields marked with red background are required, if gst number for a party is not available please type N/A in the gst field.";
            error = true;
            showAlert = true;
            return;
        }
        if (!validatePhone($newBusiness.phone)) {
            message = "Phone number must be atleast 10 digits long, please enter a valid phone number.";
            error = true;
            showAlert = true;
            return;
        }
        if (!validateEmail($newBusiness.email)) {
            message = "Please enter a valid email id, if email is not available please enter a@b.com";
            error = true;
            showAlert = true;
            return;
        }
        if (!validateGst($newBusiness.gst)) {
            message = "Please enter a valid gst number, if gst number for a party is not available please type N/A in the gst field.";
            error = true;
            showAlert = true;
            return
        }
        if (!validatePin($newBusiness.postal_code)) {
            message = "Please enter a valid postal code, postal code must be numerical and must be 5 digits long.";
            error = true;
            showAlert = true;
            return;
        }
        
        const check = document.getElementById('fy_next').checked
        $newBusiness.next_year = check
        
        try {
            let body = $newBusiness
            if (!body) {
                error = true;
                message = `Could not get the field values`
                showAlert = true;
                return;
            }
            const res = await post(post_url, body)
            if (res.status) {
                error = false;
                message = `Business ${body.name} created succesfully`
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
    <div class="header flex-sb">
        <button on:click={()=>{history.back()}}>back</button>
        <h4>Business</h4>
        <span></span>
    </div>
    <div class="create-form flex flex-col">
        <div class="header flex-sb">
            <h4>Create New Business</h4>
            <div class="actions flex-sb">
                <button class="clear flex-cc" on:click={clear}>Clear</button>
                <button class="save flex-cc" on:click={save}>Save</button>
            </div>
        </div>
        <div class="group {businessError.name?'error':''}">
            <label for="name">Business Name</label>
            <input type="text" name="name" id="name" bind:value={$newBusiness.name}>
        </div>
        <div class="group {businessError.phone?'error':''}">
            <label for="phone">Business Phone</label>
            <input type="text" name="phone" id="phone" bind:value={$newBusiness.phone}>
        </div>
        <div class="group {businessError.email?'error':''}">
            <label for="email">Business Email</label>
            <input type="text" name="email" id="email" bind:value={$newBusiness.email}>
        </div>
        <div class="group {businessError.gst?'error':''}">
            <label for="gst">Business GST No.</label>
            <input type="text" name="gst" id="gst" bind:value={$newBusiness.gst}>
        </div>
        <div class="group {businessError.street_address?'error':''}">
            <label for="address">Street Address</label>
            <input type="text" name="address" id="address" bind:value={$newBusiness.street_address}>
        </div>
        <div class="group {businessError.city?'error':''}">
            <label for="city">City </label>
            <input type="text" name="city" id="city" bind:value={$newBusiness.city}>
        </div>
        <div class="group {businessError.state?'error':''}">
            <label for="state">State </label>
            <input type="text" name="state" id="state" bind:value={$newBusiness.state}>
        </div>
        <div class="group {businessError.country?'error':''}">
            <label for="country">Country </label>
            <input type="text" name="country" id="country" bind:value={$newBusiness.country}>
        </div>
        <div class="group {businessError.postal_code?'error':''}">
            <label for="code">Postal Code</label>
            <input type="text" name="code" id="code" bind:value={$newBusiness.postal_code}>
        </div>
        <div class="group date {businessError.fy_start?'error':''}">
            <label for="start">FY Start</label>
            <Select
                class="select"
                items = {Array.from(Array(31).keys()).map(i=>i+1)}
                placeholder="DD"
                clearable={false}
                on:change = {(e)=>{start_day=e.detail.value}}
            />
            <Select
                class="select"
                items={months}
                placeholder="MM"
                clearable={false}
                on:change = {(e)=>{start_month=e.detail.value}}
            />
        </div>
        <div class="group date {businessError.fy_end?'error':''}">
            <label for="start">FY End</label>
            <Select
                class="select"
                items = {Array.from(Array(31).keys()).map(i=>i+1)}
                placeholder="DD"
                clearable={false}
                on:change = {(e)=>{end_day=e.detail.value}}
            />
            <Select
                class="select"
                items={months}
                placeholder="MM"
                clearable={false}
                on:change = {(e)=>{end_month=e.detail.value}}
            />
        </div>
        <div class="group check">
            <label for="next_year">FY Ends Next Year</label>
            <input type="checkbox" id="fy_next">
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
    section > .header > h4 {
        margin-left: -100px;
        text-align: center;
    }
    section > .header button {
        width: 125px;
        font-size: 1rem;
        font-weight: 500;
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .create-form {
        width: 55%;
        margin: 0 auto;
        padding: 1rem;
        box-shadow: var(--bsm);
        border-radius: var(--radius);
        gap: .5rem;
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
    .create-form .group.date {
        width: 40%;
        grid-template-columns: 2.25fr 1fr 1fr;
        gap: 1rem;
    }
    .create-form .group.check {
        width: 30.5%;
        grid-template-columns: 5fr 4fr;
    }
    .create-form .group.check input {
        border: none;
        outline: none;
        border-radius: 50%;
        cursor: pointer;
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
