export function parseData(data) {
    const allBars = [];
    data.forEach(chunk => {
        const chunkStart = chunk.ChunkStart;
        chunk.Bars.forEach(bar => {
            allBars.push({
                time: (chunkStart + bar.Time) * 1000, // Convert Unix time to JavaScript Date
                open: bar.Open,
                high: bar.High,
                low: bar.Low,
                close: bar.Close,
                tickVolume: bar.TickVolume
            });
        });
    });
    return allBars;
}
