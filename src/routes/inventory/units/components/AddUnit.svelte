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
        'name' : ""
    }
    
    const save = async () =>{
         if (!body.name) {
            message = "Unit name is required, please enter an unit name and try again.";
            error = true;
            showAlert = true;
            return
         }
         try {
            const res = await post(apiUrls.inventory+"units", body)
            if (res.status) {
                message = `New Unit ${body.name} has been added succesfully.`;
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
            <h4>Add New Unit</h4>
        </div>
        <div class="field">
            <label for="name">New Unit Name</label>
            <input type="text" bind:value={body.name}>
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
        grid-template-columns: 2fr 4fr;
        place-items: center;
        gap: 0rem;
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