<script>
    import Select from 'svelte-select';
    export let data;

    let journals = data.journals;
    
    const journalTypes = [
        "Journal Voucher",
        "Cash Voucher",
        "Bank Voucher",
        "Debit Note",
        "Credit Note",
        "Contra Voucher",
        "Receipt Voucher",
        "Payment Voucher",
        "Depriciation Voucher"
    ]

    let journalType;
    let startDate;
    let endDate;
    let minAmount;
    let maxAmount;

    const filter = () => {
        journals = data.journals;
        if (startDate) {
            journals = journals.filter(j=>{
                return j.journal.doc_date >= startDate;
            })
        }
        if (endDate) {
            journals = journals.filter(j=>{
                return j.journal.doc_date <= endDate;
            })
        }
        if (journalType) {
            journals = journals.filter(j=>{
                return j.journal.doc_type == journalType;
            })
        }
        if (minAmount) {
            journals = journals.filter(j=>{
                let total = j.dr_entries.reduce((a,b)=>{
                    return a.amount + b.amount
                })
                return total >= minAmount;
            })
        }
        if (maxAmount) {
            journals = journals.filter(j=>{
                let total = j.dr_entries.reduce((a,b)=>{
                    return a.amount + b.amount
                })
                return maxAmount >= total;
            })
        }
    }

</script>

<section class="flex flex-col">
    <div class="header">
        <h4>View Journals</h4>
    </div>
    <div class="filters">
        <div class="group">
            <label for="type">Filter By Journal Type</label>
            <Select 
                class="select"
                containerStyles = "grid-column:1/3"
                id="type"
                items={journalTypes}
                on:change = {(e)=>{
                    journalType = e.detail.value;
                    filter()
                }}
                on:clear = {()=>{
                    journalType = "";
                    filter()
                }}
            />            
        </div>
        <div class="group">
            <label for="date">Filter By Date</label>
            <input type="date" name="start-date" id="date" bind:value={startDate} on:change={()=>{filter()}}>
            <input type="date" name="end-date" id="date" bind:value={endDate} on:change={()=>{filter()}}>
        </div>
        <div class="group">
            <label for="amount">Filter By Amount</label>
            <input type="text" name="min-amount" id="amount" bind:value={minAmount} on:keyup={()=>{filter()}}>
            <input type="text" name="max-amount" id="amount" bind:value={maxAmount} on:keyup={()=>{filter()}}>
        </div>
    </div>
    <div class="journals">
        <div class="header">
            <span>#</span>
            <span>Added Date</span>
            <span>Journal Date</span>
            <span>Journal Type</span>
            <span>Journal No.</span>
            <span>Amount</span>
            <span>Actions</span>
        </div>
        {#each journals as j, i (i+1)}
            <div class="row">
                <span>{i+1}</span>
                <span>{j.journal.timestamp.split("T")[0]}</span>
                <span>{j.journal.doc_date}</span>
                <span>{j.journal.doc_type}</span>
                <span>{j.journal.doc_prefix}{j.journal.doc_number}</span>
                <span>₹ {JSON.stringify(j.dr_entries.reduce((a,b)=>a + Number(b.amount), 0))}</span>
                <a href="/journal/view/{j.journal.id}">View</a>
            </div>
        {/each}
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
    section .header h4 {
        width: 100%;
        text-align: center;

    }   
    .filters {
        width: 100%;
        padding: 1rem;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }
    .filters .group {
        width: 100%;
        padding: .5rem;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        justify-items: center;
        align-content: center;
        gap: .5rem;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .filters .group label {
        font-size: 1rem;
        grid-column: 1/3;
    }
    .journals {
        width: 100%;
    }
    .journals .header,
    .journals .row {
        width: 95%;
        margin: 0 auto;
        margin-bottom: 10px;
        padding: .1rem 1rem;
        font-size: 1rem;
        display: grid;
        grid-template-columns: 1fr repeat(5, 4fr) 1fr;
        align-content: center;
        justify-items: center;
    }
    .journals .header {
        font-weight: 600;
        padding: .3rem 1rem;
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
    .journals .row a {
        padding: .2rem 1rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        text-decoration: none;
        color: var(--primary);
        background: var(--wheat);
        border-radius: var(--radius);
        box-shadow: var(--bsm);
    }
</style>