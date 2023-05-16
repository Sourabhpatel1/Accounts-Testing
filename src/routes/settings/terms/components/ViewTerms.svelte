<script>
    export let terms;

    let currentIndex = 0;
</script>

<div class="view flex flex-col">
    <div class="actions flex-sb">
        <button disabled="{currentIndex <= 0}" on:click={()=>{if (currentIndex > 0) currentIndex--}}>Previous</button>
        <button disabled = "{currentIndex >= terms.length - 1}" on:click={()=>{if (currentIndex < terms.length - 1) currentIndex++}}>Next</button>
    </div>
    <div class="terms flex flex-col">
        {#each terms[currentIndex].terms.split("\n") as line, i}
            <p><span>{i+1}</span><span>:</span><span>{line}</span></p>
        {/each}
    </div>
</div>

<style>
    .view {
        width: 47%;
        margin: 0 auto;
        padding: 1rem;
        gap: 1rem;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .view .actions button {
        color: var(--white);
        background: var(--primary);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .view .terms {
        min-height: 400px;
        max-height: 70dvh;
        font-size: 1rem;
        font-weight: 500;
        gap: 7px;
        overflow-y: scroll;
    }
    .view .terms p {
        display: grid;
        grid-template-columns: 1fr 1fr 16fr;
    }
</style>