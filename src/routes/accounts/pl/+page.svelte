<script>
    export let data;
    let directRevenue = data.pl.direct_revenue
    let directExpenses = data.pl.direct_expenses
    
    let operatingExpenses = data.pl.operating_expenses

    let indirectRevenue = data.pl.indirect_revenue
    let indirectExpenes = data.pl.indirect_expenses

    let taxBenefits = data.pl.tax_income
    let taxExpenses = data.pl.tax_expenses

    let totalDrev = 0;
    let totalDexp = 0;
    let totalOexp = 0;
    let totalIrev = 0;
    let totalIexp = 0;
    let totalTrev = 0
    let totalTexp = 0;

    directRevenue.forEach(r=>{
        totalDrev += (r.cr_entries.reduce((a,b)=>a+b.amount,0)) - (r.dr_entries.reduce((a,b)=>a+b.amount,0))
    })
    directExpenses.forEach(r=>{
        totalDexp += (r.dr_entries.reduce((a,b)=>a+b.amount,0)) - (r.cr_entries.reduce((a,b)=>a+b.amount,0))
    })
    operatingExpenses.forEach(r=>{
        totalOexp += (r.dr_entries.reduce((a,b)=>a+b.amount,0)) - (r.cr_entries.reduce((a,b)=>a+b.amount,0))
    })
    indirectRevenue.forEach(r=>{
        totalIrev += (r.cr_entries.reduce((a,b)=>a+b.amount,0)) - (r.dr_entries.reduce((a,b)=>a+b.amount,0))
    })
    indirectExpenes.forEach(r=>{
        totalIexp += (r.dr_entries.reduce((a,b)=>a+b.amount,0)) - (r.cr_entries.reduce((a,b)=>a+b.amount,0))
    })
    taxBenefits.forEach(r=>{
        totalTrev += (r.cr_entries.reduce((a,b)=>a+b.amount,0)) - (r.dr_entries.reduce((a,b)=>a+b.amount,0))
    })
    taxExpenses.forEach(r=>{
        totalTexp += (r.dr_entries.reduce((a,b)=>a+b.amount,0)) - (r.cr_entries.reduce((a,b)=>a+b.amount,0))
    })
</script>

<section class="printable">
    <div class="title flex-sb">
        <button class="flex-cc back no-print" on:click={()=>{history.back()}}>Back</button>
        <h4>Profit and Loss Statement</h4>
        <button class="flex-cc print no-print" on:click={()=>{window.print()}}>Print</button>
    </div>
    <div class="statement">
        <div class="header">
            <span>Particulars</span>
            <span>Amount</span>
            <span>Amount</span>
            <span>Amount</span>
        </div>
        <div class="group">
            <div class="items">
                <div class="item-title">
                    <h5>Direct Revenue</h5>
                </div>
                {#each directRevenue as r}
                    <div class="row">
                        <span>{r.name}</span>
                        <span>{((r.cr_entries.reduce((a,b)=>a+b.amount,0)) - (r.dr_entries.reduce((a,b)=>a+b.amount,0))).toFixed(3)}</span>
                        <span></span>
                        <span></span>
                    </div>
                {/each}
                <div class="item-footer">
                    <span>Total Direct Revenue (A)</span>
                    <span></span>
                    <span>{totalDrev.toFixed(3)}</span>
                    <span></span>
                </div>
            </div>
            <div class="items">
                <div class="item-title">
                    <h5>Direct Expenses</h5>
                </div>
                {#each directExpenses as e}
                    <div class="row">
                        <span>{e.name}</span>
                        <span>{((e.dr_entries.reduce((a,b)=>a+b.amount,0)) - (e.cr_entries.reduce((a,b)=>a+b.amount,0))).toFixed(3)}</span>
                        <span></span>
                        <span></span>
                    </div>
                {/each}
                <div class="item-footer">
                    <span>Total Direct Expenses (B)</span>
                    <span></span>
                    <span>{totalDexp.toFixed(3)}</span>
                    <span></span>
                </div>
            </div>
        </div>
        <div class="group-footer">
            {#if totalDrev >= totalDexp}
                <span>Gross Profit (A - B)</span>
            {:else}
                <span>Gross Loss (B - A)</span>
            {/if}
            <span></span>
            <span></span>
            <span>{(totalDrev-totalDexp).toFixed(3)}</span>
        </div>
        <div class="group">
            <div class="items">
                <div class="item-title">
                    <h5>Operating Expenses</h5>
                </div>
                {#each operatingExpenses as o}
                    <div class="row">
                        <span>{o.name}</span>
                        <span>{((o.dr_entries.reduce((a,b)=>a+b.amount,0)) - (o.cr_entries.reduce((a,b)=>a+b.amount,0))).toFixed(3)}</span>
                        <span></span>
                        <span></span>
                    </div>
                {/each}
                <div class="item-footer">
                    <span>Total Operating Expenses (C)</span>
                    <span></span>
                    <span>{totalOexp.toFixed(3)}</span>
                    <span></span>
                </div>
            </div>
        </div>
        <div class="group-footer">
            {#if totalDrev >= (totalDexp + totalOexp)}
                <span>Operating Profit (A - B - C)</span>
            {:else}
                <span>Operating Loss (B + C - A)</span>
            {/if}
            <span></span>
            <span></span>
            <span>{(totalDrev-totalDexp-totalOexp).toFixed(3)}</span>
        </div>
        <div class="group">
            <div class="items">
                <div class="item-title">
                    <h5>Non Operating Revenue</h5>
                </div>
                {#each indirectRevenue as i}
                    <div class="row">
                        <span>{i.name}</span>
                        <span>{((i.cr_entries.reduce((a,b)=>a+b.amount,0)) - (i.dr_entries.reduce((a,b)=>a+b.amount,0))).toFixed(3)}</span>
                        <span></span>
                        <span></span>
                    </div>
                {/each}
                <div class="item-footer">
                    <span>Total Non Operating Revenue (D)</span>
                    <span></span>
                    <span>{totalIrev.toFixed(3)}</span>
                    <span></span>
                </div>
            </div>
        </div>
        <div class="group">
            <div class="items">
                <div class="item-title">
                    <h5>Non Operating Expenses</h5>
                </div>
                {#each indirectExpenes as i}
                    <div class="row">
                        <span>{i.name}</span>
                        <span>{((i.dr_entries.reduce((a,b)=>a+b.amount,0)) - (i.cr_entries.reduce((a,b)=>a+b.amount,0))).toFixed(3)}</span>
                        <span></span>
                        <span></span>
                    </div>
                {/each}
                <div class="item-footer">
                    <span>Total Non Operating Expenses (E)</span>
                    <span></span>
                    <span>{totalIexp.toFixed(3)}</span>
                    <span></span>
                </div>
            </div>
        </div>
        <div class="group">
            <div class="items">
                <div class="item-title">
                    <h5>Tax Refund / Benefits</h5>
                </div>
                {#each taxBenefits as t}
                    <div class="row">
                        <span>{t.name}</span>
                        <span>{((t.cr_entries.reduce((a,b)=>a+b.amount,0)) - (t.dr_entries.reduce((a,b)=>a+b.amount,0))).toFixed(3)}</span>
                        <span></span>
                        <span></span>
                    </div>
                {/each}
                <div class="item-footer">
                    <span>Total Tax Refunds / Benefits (F)</span>
                    <span></span>
                    <span>{totalTrev.toFixed(3)}</span>
                    <span></span>
                </div>
            </div>
        </div>
        <div class="group-footer">
            {#if totalIrev + totalDrev + totalTrev >= totalDexp + totalOexp + totalIexp}
                <span>Net Profit Before Tax (A + D + F - B - C - E)</span>
            {:else}
                <span>Net Loss Before Tax</span>
            {/if}
            <span></span>
            <span></span>
            <span>{(totalDrev + totalIrev + totalTrev - totalDexp - totalOexp - totalIexp).toFixed(3)}</span>
        </div>
        <div class="group">
            <div class="items">
                <div class="item-title">
                    <h5>Tax</h5>
                </div>
                {#each taxExpenses as t}
                    <div class="row">
                        <span>{t.name}</span>
                        <span>{((t.dr_entries.reduce((a,b)=>a+b.amount,0)) - (t.cr_entries.reduce((a,b)=>a+b.amount,0))).toFixed(3)}</span>
                        <span></span>
                        <span></span>
                    </div>
                {/each}
                <div class="item-footer">
                    <span>Total Tax Expenses (G)</span>
                    <span></span>
                    <span>{totalTexp.toFixed(3)}</span>
                    <span></span>
                </div>
            </div>
        </div>
        <div class="group-footer">
            {#if totalIrev + totalDrev + totalTrev >= totalDexp + totalOexp + totalIexp + totalTexp}
                <span>Net Profit After Tax (A + D + F - B - C - E - G)</span>
            {:else}
                <span>Net Loss After Tax</span>
            {/if}
            <span></span>
            <span></span>
            <span>{(totalDrev + totalIrev + totalTrev - totalDexp - totalOexp - totalIexp - totalTexp).toFixed(3)}</span>
        </div>
    </div>
</section>

<style>
    section {
        padding: .5rem 1rem;
    }
    section > .title {
        padding: .2rem 1rem;
    }
    .print,
    .back {
        width: 100px;
        height: 30px;
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .print {
        color: var(--white);
        background: var(--ok);
    }
    .statement {
        position: relative;
        width: 65%;
        margin: 0 auto;
        padding: 0 1rem;
    }
    .statement .header,
    .statement .items .row,
    .statement .items .item-footer,
    .statement .group-footer {
        width: 100%;
        padding: .2rem 1rem;
        display: grid;
        grid-template-columns: 6fr 2fr 2fr 2fr;
    }
    .statement .header,
    .statement .items .item-footer,
    .statement .group-footer {
        font-size: .9rem;
        font-weight: 600;
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .statement .item-title {
        padding-left: 2rem;
    }
    .statement .items .row {
        font-size: .85rem;
        font-weight: 500;
        padding: 0 3rem;
    }
    .statement .header span:not(:nth-child(1)),
    .statement .items .row span:not(:nth-child(1)),
    .statement .items .item-footer span:not(:nth-child(1)),
    .statement .group-footer span:not(:nth-child(1)) {
        width: 100%;
        text-align: right;
    }
    .statement .group-footer {
        margin-top: 5px;
        padding: .3rem 1rem;
        background: var(--dark-gray);
        color: var(--white);
        page-break-before: always !important;
    }
    @media print {
        .printable, .printable * {
            visibility: visible;
            width: 100%;
            box-shadow: none !important;
        }
        .printable {
            width: 100vw;
            margin-left: -200px;
        }
        .no-print {
            visibility: hidden;
        }
        .item-footer,
        .group-footer,
        .header {
            border-top: 2px solid !important;
            border-bottom: 2px solid !important;
            border-radius: 0 !important;
        }
    }   
</style>