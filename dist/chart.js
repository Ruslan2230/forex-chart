export class Chart {
    constructor(canvasId) {
        this.bars = [];
        this.offset = 0;
        this.zoom = 1;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
    }
    setData(bars) {
        this.bars = bars;
        this.render();
    }
    setupEventListeners() {
        this.canvas.addEventListener('wheel', this.onScroll.bind(this));
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    }
    onScroll(event) {
        const zoomIntensity = 0.1;
        this.zoom *= (1 - event.deltaY * zoomIntensity);
        this.render();
    }
    onMouseDown(event) {
        const startX = event.clientX;
        const onMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            this.offset += dx / this.zoom;
            this.render();
        };
        const onMouseUp = () => {
            this.canvas.removeEventListener('mousemove', onMouseMove);
            this.canvas.removeEventListener('mouseup', onMouseUp);
        };
        this.canvas.addEventListener('mousemove', onMouseMove);
        this.canvas.addEventListener('mouseup', onMouseUp);
    }
    render() {
        const { ctx, canvas, bars, offset, zoom } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!bars.length)
            return;
        const barWidth = 5 * zoom;
        const visibleBars = Math.ceil(canvas.width / barWidth);
        const startIndex = Math.max(0, Math.floor(offset / barWidth));
        const endIndex = Math.min(bars.length, startIndex + visibleBars);
        // Calculate price range
        const priceMax = Math.max(...bars.map(bar => bar.high));
        const priceMin = Math.min(...bars.map(bar => bar.low));
        const priceRange = priceMax - priceMin;
        const priceStep = priceRange / 10;
        // Draw price scale
        ctx.fillStyle = 'black';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.font = '12px Arial';
        for (let i = 0; i <= 10; i++) {
            const price = priceMin + (priceStep * i);
            const y = this.mapValueToY(price);
            ctx.fillText(price.toFixed(2), canvas.width - 10, y);
        }
        // Draw bars
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.beginPath();
        for (let i = startIndex; i < endIndex; i++) {
            const bar = bars[i];
            const x = (i - startIndex) * barWidth - offset % barWidth;
            const yOpen = this.mapValueToY(bar.open);
            const yClose = this.mapValueToY(bar.close);
            const yHigh = this.mapValueToY(bar.high);
            const yLow = this.mapValueToY(bar.low);
            // Skip drawing if there's a gap (difference in time > barWidth)
            if (i > startIndex && bar.time - bars[i - 1].time > barWidth * 60 * 1000) {
                continue;
            }
            // Draw candlestick bars
            ctx.moveTo(x + barWidth / 2, yHigh);
            ctx.lineTo(x + barWidth / 2, yLow);
            ctx.moveTo(x, yOpen);
            ctx.lineTo(x + barWidth, yOpen);
            ctx.moveTo(x, yClose);
            ctx.lineTo(x + barWidth, yClose);
            ctx.stroke();
            // Optional: Draw tick volume below each bar
            if (bar.tickVolume !== undefined) {
                const volumeHeight = 20;
                ctx.fillStyle = 'gray';
                const yVolume = canvas.height - volumeHeight;
                ctx.fillRect(x, yVolume, barWidth, volumeHeight);
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText(bar.tickVolume.toString(), x + barWidth / 2, canvas.height - 5);
            }
        }
        ctx.stroke();
        // Draw date labels
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = '12px Arial';
        const labelStep = Math.ceil(visibleBars / 10);
        for (let i = startIndex; i < endIndex; i += labelStep) {
            const bar = bars[i];
            const x = (i - startIndex) * barWidth - offset % barWidth + barWidth / 2;
            const date = new Date(bar.time);
            const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            ctx.fillText(dateString, x, canvas.height - 20);
        }
    }
    mapValueToY(value) {
        const max = Math.max(...this.bars.map(bar => bar.high));
        const min = Math.min(...this.bars.map(bar => bar.low));
        return this.canvas.height - ((value - min) / (max - min) * this.canvas.height);
    }
}
