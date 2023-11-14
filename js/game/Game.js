import { Grid } from './Grid.js'

const SIZE = 20;
export class Game {
    #generation = 0
    #lastStepChangedCells = new Set();
    #gameData = {};
    #grid = null;
    constructor() {
        this.#init()
    }

    #init() {
        this.#gameData = {
            rows: SIZE,
            cols: SIZE,
            grid: new Grid(SIZE, SIZE)
        };
        this.#grid = this.#gameData.grid;        
    }

    #calculateNextCellState(row, col, changesSet = new Set(), changesWithNeighbors = new Set()) {
        const cell = this.#grid.getCell(row, col)
        const { cells, aliveAmount } = this.#grid.getNeighborsData(row, col);
        let newValue = cell.value;
        if (aliveAmount < 2 || aliveAmount > 3) {
            newValue = 0
        }
        if (aliveAmount === 3) {
            newValue = 1
        }

        if(newValue !== cell.value) {
            changesSet.add({ row, col, value: newValue })
            changesWithNeighbors.add(cell)
            cells.forEach(cell => changesWithNeighbors.add(cell))
        }
        
    }

    // 1000x1000 -- 100ms
    nextGen() {
        let changes = new Set();
        let changesWithNeighbors = new Set();
        if (this.#generation === 0) {
            this.#grid.traverse((row, col) => this.#calculateNextCellState(row, col, changes, changesWithNeighbors));
        } else {
            this.#lastStepChangedCells.forEach(
                cell => this.#calculateNextCellState(cell.row, cell.col, changes, changesWithNeighbors)
            )
        }
        changes.forEach(({ value, row, col }) => {
            this.#grid.set(row, col, value)
        })
        this.#lastStepChangedCells = changesWithNeighbors;
        this.#generation += 1;
        return changes;
    }

    getGrid() {
        return this.#grid
    }

    updateCell(row, col, value) {
        this.#grid.set(row, col, value)
        const cell = this.#grid.getCell(row, col);
        const { cells } = this.#grid.getNeighborsData(row, col)
        if(this.#generation > 0) {
            cells.forEach(cell => this.#lastStepChangedCells.add(cell))
            this.#lastStepChangedCells.add(cell)
        }
    }

    fillRandom() {
        this.#generation = 0;
        this.#lastStepChangedCells.clear()
        this.#grid.traverse((row, cell) => {
            this.#grid.set(row, cell, Math.random() > 0.8 ? 1 : 0)
        })
    }

    reset() {
        this.#generation = 0;
        this.#lastStepChangedCells.clear()
        this.#init();
    }
}