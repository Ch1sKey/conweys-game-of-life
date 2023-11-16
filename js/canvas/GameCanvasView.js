const COLOR = {
    BLACK: "black",
    WHITE: "white",
}

export class GameCanvasView {
    #canvasSize = 0
    #grid = null
    #canvas = null
    #ctx = null

    constructor(canvasSize) {
        this.#canvas = document.createElement("canvas")
        this.#canvas.id = "main"
        this.setCanvasSize(canvasSize)
        this.#ctx = this.#canvas.getContext("2d")

        document.querySelector("main").prepend(this.#canvas)
    }

    setGrid(grid) {
        this.#grid = grid
    }

    setCanvasSize(size) {
        this.#canvasSize = size
        this.#canvas.width = this.#canvasSize
        this.#canvas.height = this.#canvasSize
    }

    clear() {
        this.#ctx.clearRect(0, 0, this.#canvasSize, this.#canvasSize)
    }

    #getCellSize() {
        return Math.floor(this.#canvasSize / this.#grid.size)
    }

    #renderCell(row, col) {
        const cellSize = this.#getCellSize()
        const x = col * cellSize
        const y = row * cellSize
        const value = this.#grid.getValue(row, col)
        const color = value === 1 ? COLOR.BLACK : COLOR.WHITE
        this.#ctx.fillStyle = color
        this.#ctx.fillRect(x, y, cellSize, cellSize)
    }

    render(changesSet) {
        if (changesSet) {
            changesSet.forEach(({ row, col }) => this.#renderCell(row, col))
        } else {
            this.#grid.traverse((row, col) => this.#renderCell(row, col))
            console.warn("Full render")
        }
    }
}
