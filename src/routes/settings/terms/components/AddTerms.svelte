<script>
	import { apiUrls } from '$lib/utils/urls';
	import { post } from '$lib/utils/helpers';
    import { createEventDispatcher } from "svelte";
	import Alert  from '$lib/components/Alert.svelte';

    export let current;

    const dispatch = createEventDispatcher()

    let terms;

    let message = "";
    let error = false;
    let showAlert = false;

    const param = current.includes("po")?"po":current.includes("pi")?"pi":current.includes("so")?"so":current.includes("si")?"si":""

    const scrollBoth = (e) => {
        let currentElem = e.target
        let prevElem = e.target.previousElementSibling;
        prevElem.scrollTop = currentElem.scrollTop
    }
    const enterLineNum = (e) => {
        let currentElem = e.target;
        let prevElem = e.target.previousElementSibling;
        let lines = terms.split("\n");
        let numbers = "";
        for (let num = 0; num < lines.length; num++) {
            numbers += (num+1) + "\n"
        }
        prevElem.value = numbers
        prevElem.scrollTop = currentElem.scrollTop
    } 
    const save = async () => {
        if (terms?.length < 10 || !terms) {
            message = "Terms and Conditions must be atleast 10 characters long."
            error = true;
            showAlert = true;
            return
        }
        try {
            const res = await post(apiUrls.terms + param, {'terms' : terms})
            if (res.status) {
                message = `${param.toUpperCase()} Terms added succesfully.`
                error = false;
                showAlert = true;
                return
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
    <Alert {error} {message} on:close={()=>{showAlert=false;}} />
{/if}

<section class="flex flex-col">
    <div class="new flex flex-col">
        <div class="header flex-sb">
            <h4>Add  New {param==="po"?"Purchase Order":param==="pi"?"Purchase Invoice":param==="so"?"Sales Order":param==="si"?"Sales Invoice":""} Terms</h4>
            <button class="add" on:click={save}>add</button> 
        </div>
        <div class="text">
            <textarea readonly disabled on:scroll={()=>{console.log("Scrolling")}} style="text-align:center"></textarea>
            <textarea bind:value={terms} on:scroll={(e)=>{scrollBoth(e)}} on:keyup={(e)=>{enterLineNum(e)}}></textarea>
        </div>
        <button class="close flex-cc" on:click={()=>{dispatch('close')}}>X</button>
    </div>
</section>

<style>
    section {
        position: absolute; 
        inset: 0;
        padding: 1rem;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: 10px blur;
    }
    .new {
        position: relative;
        width: 800px;
        height: 800px;
        margin: auto;
        padding: 1rem;
        gap: 1rem;
        background: var(--bg-color);
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .new .header {
        padding: 0 1rem;
    }
    .new .text {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 2fr 22fr;
        gap: .5rem;
    }
    .new .text textarea {
        width: 100%;
        height: 100%;
        resize: none;
        border: none;
        background: var(--wheat);
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .new .close {
        position: absolute;
        top: -15px;
        right: -15px;
        width: 40px;
        height: 40px;
        font-size: 1.25rem;
        font-weight: 800;
        border-radius: 50%;
        color: var(--white);
        background: var(--warning);
    }
    .add {
        font-size: .9rem;
        font-weight: 500;
        color: var(--white);
        background: var(--ok);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
</style>