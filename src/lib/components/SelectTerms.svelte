<script>
    import { onMount, onDestroy } from "svelte";
    import { createEventDispatcher } from "svelte";
    import { fly, fade } from "svelte/transition";
    
    export let terms;

    const dispatch = createEventDispatcher()

    let currentIndex = 0;

    onMount(()=>{
        document.body.style.overflow = 'hidden'
    })
    onDestroy(()=>{
        document.body.style.overflow = 'visible'
    })

</script>

<div class="wrapper" transition:fade="{{duration : 150}}">
    <div class="term-card flex flex-col">
        <div class="header flex-sb">
            <div class="actions">
                <button style="background: var(--primary);" disabled={currentIndex===0} on:click={()=>{if (!currentIndex<=0)currentIndex--}}>Prev.</button>
                <button style="background: var(--primary);" disabled={(currentIndex + 1) >= terms.length} on:click={()=>{if (!currentIndex+1>=terms.length)currentIndex++}}>Next</button>
            </div>
            <h4>Select Terms and Conditions</h4>
            <div class="select">
                <button style="background: var(--ok);" on:click={()=>{dispatch('select', terms[currentIndex])}}>Select</button>
            </div>
        </div>
        <div class="term-text flex flex-col">
            {#each terms[currentIndex].terms.split("\n") as line, i (i+1)}
                <p>{line}</p>
            {/each}
        </div>
    </div>
</div>

<style>
    .wrapper {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur 1px;
        z-index: 1;
    }
    .wrapper .term-card {
        width: 60%;
        min-height: 75dvh;
        padding: 1rem;
        gap: 1rem;
        background: var(--bg-color);
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .wrapper .term-card .header {
        padding: .2rem 1rem;
        border-radius: var(--radius);
    }
    .wrapper .term-card .header .actions,
    .wrapper .term-card .header .select {
        display: flex;
        gap: .5rem;
    }
    .wrapper .term-card .header .actions button,
    .wrapper .term-card .header .select button {
        font-size: .8rem;
        font-weight: 500;
        color: var(--white);
        box-shadow: var(--bsm);
        border-radius: var(--radius);
    }
    .wrapper .term-card .term-text {
        width: 80%;
        margin: 15px auto;
        font-size: 1rem;
        gap: .5rem;
    }
</style>