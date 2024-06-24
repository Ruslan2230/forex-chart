export interface HistoricalData {
    ChunkStart: number;
    Bars: {
        Time: number;
        Open: number;
        High: number;
        Low: number;
        Close: number;
        TickVolume?: number;
    }[];
}

export async function fetchHistoricalData(url: string): Promise<HistoricalData[]> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json() as HistoricalData[];
    return data;
}