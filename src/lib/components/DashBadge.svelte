<script>
    export let name;
    export let value;
</script>

<div class="badge flex-col flex-sb">
    <h6>{name}</h6>
    <h6>{value.toFixed(2)} %</h6>
</div>

<style>
    .badge {
        min-width: 170px;
        max-height: 100px;
        height: 100%;
        text-align: center;
        color: var(--white);
        background: var(--dark-gray);
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .badge h6 {
        width: 100%;
        height: 50%;
        margin: auto;
        font-size: .80rem;
        margin-bottom: 1rem;
        border-radius: var(--radius);
    }
    .badge h6:nth-of-type(1) {
        padding: 1rem;
        background: var(--ok);
    }
</style>