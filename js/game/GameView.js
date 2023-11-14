export class GameView {
    #CANVAS_SIZE = 600;
    #grid = null;
    #canvas = null;
    #ctx = null;

    constructor(canvas) {
        this.#canvas = canvas;
        this.#canvas.width = this.#CANVAS_SIZE;
        this.#canvas.height = this.#CANVAS_SIZE;
        this.#ctx = this.#canvas.getContext('2d');
    }

    setGameData(grid) {
        this.#grid = grid;
    }

    clear() {
        this.#ctx.clearRect(0, 0, this.#CANVAS_SIZE, this.#CANVAS_SIZE)
    }

    #getCellSize() {
        return Math.floor(this.#CANVAS_SIZE / this.#grid.size);
    }

    #renderCell(row, col) {
        const cellSize = this.#getCellSize();
        const x = col * cellSize;
        const y = row * cellSize;
        const value = this.#grid.getValue(row, col)
        const color = value === 1 ? 'black' : 'white';
        this.#ctx.fillStyle = color
        this.#ctx.fillRect(x, y, cellSize, cellSize);
    }

    render(changesSet) {
        if (changesSet) {
            changesSet.forEach(({ row, col }) => this.#renderCell(row,col));
        } else {
            this.#grid.traverse((row, col) => this.#renderCell(row, col))
            console.warn('Full render');
        }

    }

}