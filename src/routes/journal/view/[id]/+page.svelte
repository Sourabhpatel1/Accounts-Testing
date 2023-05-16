<script>
    import ViewEntries from '$lib/components/ViewEntries.svelte';
    export let data;
    let journal = data.journal.journal;
    let drEntries = data.journal.dr_entries;
    let crEntries = data.journal.cr_entries;
    let total = drEntries.reduce((a,b)=>a + b.amount, 0)

</script>

<section class="printable">
    {#if data.status}
    <div class="journal">
        <div class="header">
            <h3>XYZ Ltd.</h3>
            <h4>Address Line 1, Raigarh, Chhattisgarh</h4>
            <h4>{journal.doc_type}</h4>
        </div>
        <div class="info">
            <span>Voucher No. - {journal.doc_prefix}{journal.doc_number}</span>
            <span>Date : {journal.doc_date}</span>
        </div>
        <div class="entries">
            <ViewEntries {drEntries} {crEntries}/>
        </div>
        <div class="narration">
            <span>Narration : {journal.narration}</span>
        </div>
        <div class="signatures">
            <p>Sd/-<br> Manager</p>
            <p>Sd/-<br> Accountant</p>
        </div>
    </div>
    {/if}        
    <button class="print" on:click={()=>{window.print()}}>print</button>
</section>

<style>
    section {
        position: relative;
        width: 900px;
        margin: auto;
        padding: 1rem;
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    section .journal{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .journal .header {
        width: 100%;
        text-align: center;
    }
    .journal .info {
        width: 100%;
        padding: .2rem 1rem;
        font-size: 1rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 2px solid;
        border-bottom: 2px solid;
    }
    .journal .entries {
        width: 100%;
        padding: .5rem;
    }
    .journal .narration {
        padding: .5rem;
        width: 100%;
        font-size: 1rem;
        font-weight: 500;
        border-bottom: 2px solid;
    }
    .journal .signatures {
        width: 100%;
        min-height: 120px;
        padding: .5rem 1rem;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }
    .journal .signatures p {
        font-size: .9rem;
    }
    .print {
        position: absolute;
        top: -20%;
        left: 50%;
        transform: translateX(-50%);
        width: 150px;
        font-size: 1rem;
        font-weight: 600;
        color: var(--white);
        background: var(--ok);
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    @media print {
        .printable {
            position: fixed;
            top: 20px;
            left: 0;
            width: 100%;
            height: 100%;
            visibility: visible;
            overflow: hidden;
            box-shadow: none;
            page-break-after: 0;
        }
        .printable, .printable * {
            margin: 0;
            padding: 0;
            height: auto;
            visibility: visible;
            box-shadow: none;
            box-shadow: none;
        }
    }
</style>