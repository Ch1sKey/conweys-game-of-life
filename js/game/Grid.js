export class Grid {
    #rows = 0
    #cols = 0
    #size = 0
    #grid = []
    constructor(rows, cols) {
        this.#init(rows, cols)
    }

    #init(rows, cols) {
        this.#grid = []
        this.#rows = rows
        this.#cols = cols
        this.#size = this.#rows
        for (let row = 0; row < rows; row++) {
            this.#grid[row] = []
            for (let col = 0; col < cols; col++) {
                this.#grid[row][col] = { value: 0, row, col }
            }
        }
    }

    get size() {
        return this.#size
    }

    #normalizeCoordinate(value) {
        let normalizedValue = value % this.#size
        if (normalizedValue < 0) {
            normalizedValue = this.#size + normalizedValue
        }
        return normalizedValue
    }

    getNeighborsData(row, col) {
        // top-left
        const tl = this.getCell(row - 1, col - 1)
        // top-middle
        const tm = this.getCell(row - 1, col)
        // top-right
        const tr = this.getCell(row - 1, col + 1)
        // right
        const r = this.getCell(row, col + 1)
        // bottom-right
        const br = this.getCell(row + 1, col - 1)
        // bottom-middle
        const bm = this.getCell(row + 1, col)
        // bottom-left
        const bl = this.getCell(row + 1, col + 1)
        // left
        const l = this.getCell(row, col - 1)
        const cells = [tl, tm, tr, r, br, bm, bl, l]
        return {
            cells,
            aliveAmount: cells.reduce((acc, curr) => (acc += curr.value), 0),
        }
    }

    getCell(row, col) {
        const normalRow = this.#normalizeCoordinate(row)
        const normalCol = this.#normalizeCoordinate(col)
        return this.#grid[normalRow][normalCol]
    }

    getValue(row, col) {
        return this.getCell(row, col).value
    }

    set(row, col, value) {
        return (this.#grid[row][col].value = value)
    }

    traverse(callback) {
        for (let rowIndex = 0; rowIndex < this.#rows; rowIndex++) {
            for (let cellIndex = 0; cellIndex < this.#cols; cellIndex++) {
                callback(rowIndex, cellIndex)
            }
        }
    }

    changeSize(rows, cols) {
        const oldRows = this.#rows
        const oldCols = this.#cols
        const oldGrid = this.#grid
        this.#init(rows, cols)
        for (let row = 0; row < Math.min(rows, oldRows); row++) {
            for (let col = 0; col < Math.min(cols, oldCols); col++) {
                this.set(row, col, oldGrid[row][col].value)
            }
        }
    }
}
