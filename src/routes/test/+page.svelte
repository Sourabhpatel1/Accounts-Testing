<script>
    import { onMount } from "svelte";
    onMount(async ()=>{
        let stockPriceData= new Map();
        const generateMapofStockPriceData = async () =>{
            const res = await fetch('https://64607244fe8d6fb29e30eaaf.mockapi.io/Xerodha/V1/StockPriceData')
            const data = await res.json()
            let o = []
            await data.forEach(async e=>{
                o.push({'StockName' : e.StockName, 'StockPrice' : e.StockPrice})
            })
            console.log(o)
        }    
        generateMapofStockPriceData();
        console.log(stockPriceData)
    })
</script>

<section>
    Hello
</section>