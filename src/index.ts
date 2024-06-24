import { fetchHistoricalData } from './data';
import { parseData } from './parseData';
import { Chart } from './chart';

async function main() {
    const url = 'https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&Symbol=EURUSD&Timeframe=1&Start=57674&End=59113&UseMessagePack=false';
    try {
        const data = await fetchHistoricalData(url);
        const allBars = parseData(data);
        const chart = new Chart('chartCanvas');
        chart.setData(allBars);
    } catch (error) {
        console.error('Error in main function:', error);
    }
}

main().catch(error => {
    console.error('Error in main function:', error);
});