<script>
	import { browser } from '$app/environment';
    import { onMount } from 'svelte';
	import DashBadge from './../lib/components/DashBadge.svelte';
    
    export let data;

    let cash;
    let bank;
    let pur;
    let sale;
    let customer;
    let vendor;

    let cashChartType;

    if (data.cash.cIn.length <= 1 && data.cash.cOut.length <= 1 && data.cash.bIn.length <= 1 && data.cash.cOut.length <= 1) {
        cashChartType = 'bar'
    } else {
        cashChartType = 'line'
    }

    let chartWidth = '100%';
    let chartHeight = '300';
    let barColumnWdth = "25%"
    

    onMount(async ()=>{
        if (browser) {
            const ApexCharts = (await import('apexcharts')).default
            if (window.innerWidth < 1280) {
                barColumnWdth = "50%"
            }
            let cashOptions = {
                chart : {
                    type : cashChartType,
                    height : chartHeight,
                    width : chartWidth,
                    redrawOnWindowResize: true
                },
                stroke : {
                    curve : 'smooth'
                },
                plotOptions : {
                    bar : {
                        columnWidth : barColumnWdth
                    },
                    area : {
                        fillTo : 'origin'
                    }
                },
                grid : {
                    padding : {
                        left : 25,
                        right : 25
                    }
                },
                series : [
                    {
                        name : 'Cash In Flow',
                        data : data.cash.cIn
                    },
                    {
                        name : 'Cash Out Flow',
                        data : data.cash.cOut
                    }
                ],
                dataLabels : {
                    enabled : false,
                    formatter : function (v) {return "₹" + v}
                },
                markers : {
                    size : 5
                },
                tooltip : {
                    enabled : true,
                    style : {
                        fontSize : '12px'
                    },
                    y : {
                        formatter : function (v) {return "₹ " + v.toFixed(3)}
                    }
                },
                xaxis : {
                    type : "datetime"
                }
            }
            let bankOptions = {
                chart : {
                    type : cashChartType,
                    height : chartHeight,
                    width : chartWidth,
                    redrawOnWindowResize: true
                },
                stroke : {
                    curve : 'smooth'
                },
                plotOptions : {
                    bar : {
                        columnWidth : barColumnWdth
                    },
                    area : {
                        fillTo : 'origiin'
                    }
                },
                grid : {
                    padding : {
                        left : 25,
                        right : 25
                    }
                },
                series : [
                    {
                        name : 'Bank In Flow',
                        data : data.cash.bIn
                    },
                    {
                        name : 'Bank Out Flow',
                        data : data.cash.bOut
                    }
                ],
                dataLabels : {
                    enabled : false,
                    formatter : function (v) {return "₹" + v}
                },
                markers : {
                    size : 5
                },
                tooltip : {
                    enabled : true,
                    style : {
                        fontSize : '12px'
                    },
                    y : {
                        formatter : function (v) {return "₹ " + v.toFixed(3)}
                    }
                },
                xaxis : {
                    type : "datetime"
                }
            }
            let purOptions = {
                chart : {
                    type : 'bar',
                    height : chartHeight,
                    width : chartWidth,
                    redrawOnWindowResize: true,
                    zoom : {
                        enabled : true
                    }
                },
                plotOptions : {
                    bar : {
                        columnWidth : barColumnWdth
                    }
                },
                grid : {
                    padding : {
                        left : 20,
                        right : 20
                    }
                },
                series :[
                    {
                        name : "Amount",
                        data :  data.items.pur.map((x)=>{
                                    let item;
                                    Object.keys(x).forEach(k=>{
                                    item = {
                                            "x" : k, "y" : x[k]
                                        }
                                    })
                                    return item
                                })
                    }
                ], 
                dataLabels : {
                    enabled : false,
                    formatter : function (v) {return "₹ "+v}
                },
                tooltip : {
                    enabled : true,
                    style : {
                        fontSize : '12px'
                    },
                    y : {
                        formatter : function (v) {return "₹ " + v.toFixed(3)}
                    }
                }
            }
            let saleOptions = {
                chart : {
                    type : 'bar',
                    height : chartHeight,
                    width : chartWidth,
                    redrawOnWindowResize: true,
                    zoom : {
                        enabled : true
                    }
                },
                plotOptions : {
                    bar : {
                        columnWidth : barColumnWdth
                    }
                },
                grid : {
                    padding : {
                        left : 20,
                        right : 20
                    }
                },
                series :[
                    {
                        name : "Amount",
                        data :  data.items.sold.map((x)=>{
                                    let item;
                                    Object.keys(x).forEach(k=>{
                                    item = {
                                            "x" : k, "y" : x[k]
                                        }
                                    })
                                    return item
                                })
                    }
                ], 
                dataLabels : {
                    enabled : false,
                    formatter : function (v) {return "₹ "+v}
                },
                tooltip : {
                    enabled : true,
                    style : {
                        fontSize : '12px'
                    },
                    y : {
                        formatter : function (v) {return "₹ " + v.toFixed(3)}
                    }
                }
            }
            let customerOptions = {
                chart : {
                    type : 'bar',
                    height : chartHeight/2,
                    width : chartWidth,
                    redrawOnWindowResize: true,
                    zoom : {
                        enabled : true
                    }
                },
                plotOptions : {
                    bar : {
                        columnWidth : barColumnWdth
                    }
                },
                grid : {
                    padding : {
                        left : 20,
                        right : 20
                    }
                },
                series :[
                    {
                        name : "Amount",
                        data : data.party.customer_data.map((x)=>{
                            let item;
                            Object.keys(x).forEach(i=>{
                                item = {
                                    "x" : i, "y" : x[i]
                                }
                            })
                            return item
                        }),
                    }
                ], 
                dataLabels : {
                    enabled : false,
                    formatter : function (v) {return "₹ "+v}
                },
                tooltip : {
                    enabled : true,
                    style : {
                        fontSize : '12px'
                    },
                    y : {
                        formatter : function (v) {return "₹ " + v.toFixed(3)}
                    }
                }
            };
            let vendorOptions = {
                chart : {
                    type : 'bar',
                    height : chartHeight/2,
                    width : chartWidth,
                    redrawOnWindowResize: true,
                    zoom : {
                        enabled : true
                    }
                },
                plotOptions : {
                    bar : {
                        columnWidth : barColumnWdth
                    }
                },
                grid : {
                    padding : {
                        left : 20,
                        right : 20
                    }
                },
                series :[
                    {
                        name : "Amount",
                        data : data.party.vendor_data.map((x)=>{
                            let item;
                            Object.keys(x).forEach(i=>{
                                item = {
                                    "x" : i, "y" : x[i]
                                }
                            })
                            return item
                        }),
                    }
                ], 
                dataLabels : {
                    enabled : false,
                    formatter : function (v) {return "₹ "+v}
                },
                tooltip : {
                    enabled : true,
                    style : {
                        fontSize : '12px'
                    },
                    y : {
                        formatter : function (v) {return "₹ " + v.toFixed(3)}
                    }
                }
            };
            let cashChart = new ApexCharts(cash, cashOptions)
            let bankChart = new ApexCharts(bank, bankOptions)
            let purChart = new ApexCharts(pur, purOptions)
            let saleChart = new ApexCharts(sale, saleOptions)
            let customerChart = new ApexCharts(customer, customerOptions)
            let vendorChart = new ApexCharts(vendor, vendorOptions)
            cashChart.render()
            bankChart.render()
            purChart.render()
            saleChart.render()
            customerChart.render()
            vendorChart.render()
        }
    })
</script>

<section class="flex flex-col">
    <div class="header">
        <h4>Welcome</h4>
    </div>
    <div class="ratios flex flex-col">
        <div class="items flex-cc">
            {#each Object.keys(data.ratio) as key}
                {#each Object.keys(data.ratio[key]) as cat}
                    <DashBadge name={cat} value={data.ratio[key][cat] * 100} />
                {/each}
            {/each}
        </div>
    </div>
    <div class="inventory">
        <div class="chart">
            <div class="head">
                <h5>Most Purchased Items (₹)</h5>
            </div>
            <div class="pur" bind:this={pur}>
            </div>
        </div>
        <div class="chart">
            <div class="head">
                <h5>Most Sold Items (₹)</h5>
            </div>
            <div class="sale" bind:this={sale}>
            </div>
        </div>
        <div class="chart parties">
            <div class="head">
                <h5>Top Customers and Vendors (₹)</h5>
            </div>
            <div class="party-ch">
                <div class="customers" bind:this={customer}>
                </div>
                <div class="vendors" bind:this={vendor}>
                </div>
            </div>
        </div>
    </div>
    <div class="liquidity">
        <div class="chart">
            <div class="head">
                <h5>Cash flows</h5>
            </div>
            <div class="cash-in" bind:this={cash}>
            </div>
        </div>
        <div class="chart">
            <div class="head">
                <h5>Bank flows</h5>
            </div>
            <div class="bank-in" bind:this={bank}>
            </div>
        </div>
    </div>
</section>

<style>
    section {
        width: 100%;
        padding: 1rem 0;
        gap: 0rem;
    }
    section .header {
        padding: .3rem 1rem;
    }
    section .header h4 {
        width: 100%;
        text-align: center;

    }
    .ratios {
        width: 100%;
        padding: .5rem 1rem;
        gap: 1rem;
    }
    .items {
        width: 100%;
        flex-wrap: wrap;
        gap: 1rem;
    }
    .liquidity,
    .inventory {
        width: 98%;
        margin: 5px auto;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }
    .liquidity .chart,
    .inventory .chart {
        width: 100%;
        padding: 0 1rem;
        text-align: center;
        box-shadow: var(--bss);
        border-radius: var(--radius);
    }
    .liquidity .chart .head,
    .inventory .chart .head {
        border-bottom: 3px solid;
        border-radius: var(--radius);
    }
    .cash-in,
    .bank-in,
    .pur {
        min-width: 100%;
    }
</style>