<script>
    import { onMount, onDestroy } from "svelte";
    import { createEventDispatcher } from "svelte";
    import { fly, fade } from "svelte/transition";
    
    export let error;
    export let message;

    const dispatch = createEventDispatcher()

    onMount(()=>{
        document.body.style.overflow = 'hidden'
    })
    onDestroy(()=>{
        document.body.style.overflow = 'visible'
    })
</script>

<div class="wrapper" transition:fade="{{duration : 150}}">
    <div class="alert flex-col flex-cc" transition:fly="{{y:-50, duration : 250}}">
        <div class="header">
            {#if error}
                <h4 style="color:var(--warning)">ERROR</h4>
            {:else}
                <h4 style="color:var(--ok)">SUCCESS</h4>
            {/if}
        </div>
        <div class="message">
            <p>{message}</p>
        </div>
        <button class="flex-cc" on:click={()=>{dispatch('close')}}>X</button>
    </div>
</div>

<style>
    .wrapper {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur 1px;
        z-index: 10;
    }
    .alert {
        position: relative;
        width: 75%;
        margin: 10px auto;
        padding: 1rem;
        font-size: 1rem;
        gap: .5rem;
        background: rgb(240, 240, 240);
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .alert > button {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 35px;
        height: 35px;
        font-size: 1rem;
        font-weight: 900;
        border-radius: 50%;
        background: var(--danger);
        color: var(--white);
    }
    .message p {
        font-size: 1.25rem;
    }
</style>