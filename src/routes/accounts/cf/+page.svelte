<script>
    export let data;
    const netProfit = data.flow.net_profit
    const changeInCl = data.flow.change_in_cl
    const changeInCa = data.flow.change_in_ca
    const nonCash = data.flow.non_cash
    const investment = data.flow.investment
    const financing = data.flow.financing
    const openingCash = data.flow.opening_cash
    const closingCash = data.flow.closing_cash

    const totalNonCash = nonCash.reduce((a,b)=>a+b.change,0)
    const totalChangeInCa = changeInCa.reduce((a,b)=>a+b.change,0)
    const totalChangeinCl = changeInCl.reduce((a,b)=>a+b.change,0)
    const totalInvestment = investment.reduce((a,b)=>a+b.change,0)
    const totalFinancing = financing.reduce((a,b)=>a+b.change,0)
    const totalOpening = openingCash.reduce((a,b)=>a+b.balance,0)
    const totalClosing = closingCash.reduce((a,b)=>a+b.balance, 0)

</script>

<section class="printable">
    <div class="title flex-sb">
        <button class="flex-cc back no-print" on:click={()=>{history.back()}}>Back</button>
        <h4>Cash Flow Statement</h4>
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
            <div class="group-title">
                <h5>Profit For The Year</h5>
            </div>
            <div class="group-items">
                <div class="item">
                    <span>Net Profit</span>
                    <span>{netProfit.toFixed(3)}</span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
        <div class="section-footer">
            <span>Net Profit</span>
            <span></span>
            <span></span>
            <span>{netProfit.toFixed(3)}</span>
        </div>
        <div class="group">
            <div class="group-title">
                <h5>Change In Current Liabilities</h5>
            </div>
            <div class="group-items">
                {#each changeInCl as l}
                    <div class="item">
                        <span>{l.name}</span>
                        <span>{l.change.toFixed(3)}</span>
                        <span></span>
                        <span></span>
                    </div>
                {/each}
            </div>
            <div class="group-footer">
                <span>Total Change in Current Liabilities (3)</span>
                <span></span>
                <span>{(totalChangeinCl).toFixed(3)}</span>
                <span></span>
            </div>
        </div>
        <div class="group">
            <div class="group-title">
                <h5>Change In Current Assets</h5>
            </div>
            <div class="group-items">
                {#each changeInCa as ca}
                    <div class="item">
                        <span>{ca.name}</span>
                        <span>{ca.change.toFixed(3)}</span>
                        <span></span>
                        <span></span>
                    </div>
                {/each}
            </div>
            <div class="group-footer">
                <span>Total Change in Current Assets (4)</span>
                <span></span>
                <span>{totalChangeInCa.toFixed(3)}</span>
                <span></span>
            </div>
        </div>
        <div class="section-footer">
            <span>Cash Flow From Change in Working Capital : 3 - 4, (B)</span>
            <span></span>
            <span></span>
            <span>{(totalChangeinCl - totalChangeInCa).toFixed(3)}</span>
        </div>
        <div class="group">
            <div class="group-title">
                <h5>Cash Flow From Investment Activities</h5>
            </div>
            <div class="group-items">
                {#each investment as a}
                    <div class="item">
                        <span>{a.name}</span>
                        <span>{a.change.toFixed(3)}</span>
                        <span></span>
                        <span></span>
                    </div>
                {/each}
            </div>
        </div>
        <div class="section-footer">
            <span>Cash Flow From / Used In Investment Activities (C)</span>
            <span></span>
            <span></span>
            <span>{(totalInvestment).toFixed(3)}</span>
        </div>
        <div class="group">
            <div class="group-title">
                <h5>Cash Flow From Financing Activities</h5>
            </div>
            <div class="group-items">
                {#each financing as f}
                    <div class="item">
                        <span>{f.name}</span>
                        <span>{f.change.toFixed(3)}</span>
                        <span></span>
                        <span></span>
                    </div>
                {/each}
            </div>
        </div>
        <div class="section-footer">
            <span>Cash Flow From / Used In Financing Activities (D)</span>
            <span></span>
            <span></span>
            <span>{(totalFinancing).toFixed(3)}</span>
        </div>
        <div class="group">
            <div class="group-title">
                <h5>Opening Cash and Cash Equivalants</h5>
            </div>
            <div class="group-items">
                {#each openingCash as o}
                    <div class="item">
                        <span>{o.name}</span>
                        <span>{o.balance.toFixed(3)}</span>
                        <span></span>
                        <span></span>
                    </div>
                {/each}
            </div>
        </div>
        <div class="section-footer">
            <span>Opening Balance of Cash and Cash Equivalants (E)</span>
            <span></span>
            <span></span>
            <span>{(totalOpening).toFixed(3)}</span>
        </div>
        <div class="section-footer">
            <span>Add : Change in Cash (A + B + C + D) (F)</span>
            <span></span>
            <span></span>
            <span>{(netProfit + totalChangeinCl - totalChangeInCa - totalInvestment + totalFinancing).toFixed(3)}</span>
        </div>
        <div class="section-footer">
            <span>Closing Cash and Cash Equivalants (E + F)</span>
            <span></span>
            <span></span>
            <span>{(netProfit + totalChangeinCl - totalChangeInCa - totalInvestment + totalFinancing + totalOpening).toFixed(3)}</span>
        </div>
    </div>
</section>

<style>
    section {
        padding: .2rem 1rem;
    }
    .title {
        padding: .5rem 1rem;
    }
    .title button {
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
        max-height: 90dvh;
        width: 65%;
        padding: 1rem;
        margin: 0 auto;
        overflow-y: scroll;
    }
    .statement > .header {
        position: sticky;
        top: -.8rem;
        font-size: .9rem;
        font-weight: 600;
        background: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .statement .header,
    .statement .group-items .item,
    .statement .group-footer,
    .statement .section-footer {
        width: 100%;
        padding: .2rem 1rem;
        display: grid;
        grid-template-columns: 6fr 2fr 2fr 2fr;
    }
    .statement .header {
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .group .group-title {
        padding: .3rem;
    }
    .statement .item {
        font-size: .85rem;
        font-weight: 500;
    }
    .statement .group-footer {
        font-size: .9rem;
        font-weight: 600;
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .statement .section-footer {
        margin-top: 3px;
        padding: .3rem 1rem;
        font-size: .9rem;
        font-weight: 600;
        color: var(--white);
        background: var(--dark-gray);
        border-radius: var(--radius);
    }
    .statement .header span:not(:nth-child(1)),
    .statement .group-items .item span:not(:nth-child(1)),
    .statement .group-footer span:not(:nth-child(1)),
    .statement .section-footer span:not(:nth-child(1)) {
        width: 100%;
        text-align: right !important;
    }
    @media print {
        .printable, .printable * {
            visibility: visible;
            width: 100%;
            box-shadow: none !important;
            overflow: visible !important;
        }
        .printable {
            width: 100vw;
            margin-left: -200px;
        }
        .no-print {
            visibility: hidden;
        }
        .group-footer,
        .header {
            border-top: 2px solid !important;
            border-bottom: 2px solid !important;
            border-radius: 0 !important;
        }
    } 
</style>