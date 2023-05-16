<script>
    export let data;
    const balanceSheet = data.sheet.balance_sheet
    const equity = balanceSheet.equity
    const liabilities = balanceSheet.liabilities
    const assets = balanceSheet.assets
    const revenues = data.sheet.revenue
    const expense = data.sheet.expense
    const netProfit = revenues - expense

    let equityTotal = 0
    let liabTotal = 0
    let assetTotal = 0
    
    Object.keys(equity).forEach(e=>{
        Object.keys(equity[e]).forEach(item=>{
            Object.keys(equity[e][item]).forEach(i=>{
               equityTotal += equity[e][item][i]['balance']
            })
        })
    })
    Object.keys(liabilities).forEach(e=>{
        Object.keys(liabilities[e]).forEach(item=>{
            Object.keys(liabilities[e][item]).forEach(i=>{
               liabTotal += liabilities[e][item][i]['balance']
            })
        })
    })
    Object.keys(assets).forEach(e=>{
        Object.keys(assets[e]).forEach(item=>{
            Object.keys(assets[e][item]).forEach(i=>{
               assetTotal += assets[e][item][i]['balance']
            })
        })
    })

    const sheetTotal = equityTotal + netProfit + liabTotal
</script>

<section class="printable">
    <div class="title flex-sb">
        <button class="flex-cc back no-print" on:click={()=>{history.back()}}>Back</button>
        <h4>Balance Sheet</h4>
        <button class="flex-cc print no-print" on:click={()=>{window.print()}}>Print</button>
    </div>
    <div class="sheet">
        <div class="left">
            <div class="header">
                <span>Particulars</span>
                <span>Amount</span>
            </div>
            <div class="section-title">
                <h5>Equity</h5>
            </div>
            <div class="item">
                {#each Object.keys(equity) as e}
                    {#each Object.keys(equity[e]) as item}
                        <div class="sub-item">
                            <div class="item-title">
                                <h6>{item}</h6>
                                <span></span>
                            </div>
                        </div>
                        {#each Object.keys(equity[e][item]) as account}
                            <div class="details">
                                <span>{account}</span>
                                <span>{equity[e][item][account]['balance'].toFixed(3)}</span>
                            </div>
                        {/each}
                    {/each}
                    <div class="details">
                        <span>P&L Account</span>
                        <span>{netProfit.toFixed(3)}</span>
                    </div>
                {/each}
            </div>
            <div class="section-title">
                <h5>Liabilities</h5>
            </div>
            <div class="item">
                {#each Object.keys(liabilities) as e}
                    {#each Object.keys(liabilities[e]) as item}
                        <div class="sub-item">
                            <div class="item-title">
                                <h6>{item}</h6>
                                <span></span>
                            </div>
                        </div>
                        {#each Object.keys(liabilities[e][item]) as account}
                            <div class="details">
                                <span>{account}</span>
                                <span>{liabilities[e][item][account]['balance'].toFixed(3)}</span>
                            </div>
                        {/each}
                    {/each}
                {/each}
            </div>
            <div class="footer">
                <span>Total</span>
                <span>{sheetTotal.toFixed(3)}</span>
            </div>
        </div>
        <div class="right">
            <div class="header">
                <span>Particulars</span>
                <span>Amount</span>
            </div>
            <div class="section-title">
                <h5>Assets</h5>
            </div>
            <div class="item">
                {#each Object.keys(assets) as e}
                    {#each Object.keys(assets[e]) as item}
                        <div class="item-title">
                            <h6>{item}</h6>
                            <span></span>
                        </div>
                        {#each Object.keys(assets[e][item]) as account}
                            <div class="details">
                                <span>{account}</span>
                                <span>{assets[e][item][account]['balance'].toFixed(3)}</span>
                            </div>
                        {/each}
                    {/each}
                {/each}
            </div>
            <div class="footer">
                <span>Total</span>
                <span>{sheetTotal.toFixed(3)}</span>
            </div>
        </div>
    </div>
</section>

<style>
    section {
        padding: .5rem 1rem;
    }
    section .title {
        width: 100%;
    }
    .sheet {
        position: relative;
        width: 100%;
        min-height: 500px;
        padding: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-items: center;
        gap: 1rem;
    }
    .left,
    .right {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .section-title {
        padding: .3rem 1rem;
    }
    .item {
        padding: .3rem 0 0 2rem;
    }
    .sheet .left > .header,
    .sheet .right > .header,
    .sheet .footer {
        font-size: 1rem;
        font-weight: 600;
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .sheet .left > .header,
    .sheet .right > .header,
    .sheet .left .details,
    .sheet .right .details,
    .sheet .item-title,
    .sheet .footer {
        width: 100%;
        padding: .2rem 1rem;
        display: grid;
        grid-template-columns: 5fr 2fr;
    }
    .sheet .left .details,
    .sheet .right .details {
        font-size: .8rem;
        font-weight: 500;
        padding-left: 2rem !important;
    } 
    .sheet .header span:not(:nth-child(1)),
    .sheet .details span:not(:nth-child(1)),
    .sheet .item-title span:not(:nth-child(1)),
    .sheet .footer span:not(:nth-child(1)) {
        width: 100%;
        text-align: right;
    }
    .sheet .left .footer,
    .sheet .right .footer {
        position: absolute;
        bottom: -40px;
    }
    .back,
    .print {
        width: 100px;
        height: 30px;
        border-radius: var(--radius);
        box-shadow: var(--bss);
    }
    .print {
        color: var(--white);
        background: var(--ok);
    }
    @media print {
        .printable, .printable * {
            visibility: visible;
            box-shadow: none !important;
            overflow: visible !important;
        }
        .printable {
            margin-left: -200px !important;
            width: 100vw !important;
        }
        .no-print {
            visibility: hidden;
        }
        .printable .sheet .left > .header,
        .printable .sheet .right > .header {
            border-bottom: 2px solid;
            border-radius: 0 !important;
        }
        .printable .sheet .left > .footer,
        .printable .sheet .right > .footer {
            border-top: 2px solid;
            border-radius: 0 !important;
        }
    }
</style>