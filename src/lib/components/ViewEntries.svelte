<script>
    export let drEntries;
    export let crEntries;

    let entries = [];

    drEntries.forEach(e=>{
        entries.push({
            account_name : e.account_name,
            amount : e.amount,
            entry_type  : "dr"
        })
    })

    crEntries.forEach(e=>{
        entries.push({
            account_name : e.account_name,
            amount : e.amount,
            entry_type : "cr"
        })
    })
    let total = drEntries.reduce((a,b)=>a + b.amount, 0)
</script>

<section class="printable">
    <div class="header">
        <span>#</span>
        <span>Account</span>
        <span>Dr. Amount</span>
        <span>Cr. Amount</span>
    </div>
    {#each entries as entry, i (i+1)}
        <div class="row">
            <span>{i+1}</span>
            <span>{entry.account_name}</span>
            <span>{entry.entry_type === "dr"?"₹ "+entry.amount.toFixed(2):""}</span>
            <span>{entry.entry_type === "cr"?"₹ "+entry.amount.toFixed(2):""}</span>
        </div>    
    {/each}
    <div class="total">
        <span>Total</span>
        <span>₹ {total.toFixed(2)}</span>
        <span>₹ {total.toFixed(2)}</span>
    </div>
</section>

<style>
    section {
        width: 100%;
        font-size: 1rem;
    }
    section .header,
    section .row {
        width: 100%;
        padding: .2rem 0rem;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
    section .header {
        font-weight: 600;
        border-bottom: 2px solid;
    }
    .total {
        padding: .2rem 0rem;
        font-size: 1rem;
        font-weight: 600;
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        border-top: 2px solid;
        border-bottom: 2px solid;
    }
    .total span:nth-child(1) {
        text-align: center;
    }
    @media print {
        .printable {
            visibility: visible;
        }
        .printable * {
            visibility: visible;
            box-shadow: 0;
        }
    }
</style>