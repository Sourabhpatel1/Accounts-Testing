<script>
	import { apiUrls } from '$lib/utils/urls';
    import { createEventDispatcher } from "svelte";
	import { post } from '$lib/utils/helpers';
    
	import Alert from '$lib/components/Alert.svelte';
    
    const dispatch = createEventDispatcher();

    let message = '';
    let error = false;
    let showAlert = false;

    let body = {
        'rate' : ""
    }
    
    const save = async () =>{
         if (!body.rate) {
            message = "Tax Rate is required, please enter a tax rate and try again.";
            error = true;
            showAlert = true;
            return
         }
         try {
            const res = await post(apiUrls.taxes, body)
            if (res.status) {
                message = `New Tax with tax rate of ${body.rate} % has been added succesfully.`;
                error = false;
                showAlert = true;
            } else {
                message = res.response.detail;
                error = true;
                showAlert = true;
                return 
            }            
         } catch (error) {
            console.log(error)
         }
    }
</script>

{#if showAlert}
    <Alert {error} {message} on:close={()=>{if (!error) window.location.reload(); showAlert=false}}/>
{/if}
<section class="flex">
    <div class="new flex-col flex-sb">
        <div class="header">
            <h4>Add New Tax</h4>
        </div>
        <div class="field">
            <label for="rate">New Tax Rate</label>
            <input type="text" bind:value={body.rate}>
        </div>
        <button class="add" on:click={save}>Add</button>
        <button class="close flex-cc" on:click={()=>{dispatch('close')}}>X</button>
    </div>
</section>

<style>
    section {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur 5px;
    }
    section .new {
        position: relative;
        width: 500px;
        height: 200px;
        margin: 10% auto;
        padding: 1rem;
        gap: 1rem;
        background: var(--bg-color);
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .new .field {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: .5rem;
    }
    .new .field label {
        width: 100%;
        font-size: 1rem;
        font-weight: 500;
    }
    .add {
        font-size: .8rem;
        font-weight: 500;
        color: var(--white);
        background: var(--ok);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .close {
        position: absolute;
        top: -15px;
        right: -15px;
        width: 40px;
        height: 40px;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--white);
        background: var(--warning);
        border-radius: 50%;
        box-shadow: var(--bss);
    }
</style>