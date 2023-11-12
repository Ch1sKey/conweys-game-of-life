export class View {
    #CANVAS_SIZE = 600;
    #grid = null;
    #canvas = null;
    #ctx = null;

    #isPointerDown = false
    #pointerCell = null;
    #enablePointer = true;
    #pointerHandler = null;
    constructor(canvas) {
        this.#canvas = canvas;
        this.#canvas.width = this.#CANVAS_SIZE;
        this.#canvas.height = this.#CANVAS_SIZE;
        this.#ctx = this.#canvas.getContext('2d');

        this.#canvas.addEventListener('pointermove', this.#moveHandler)
        this.#canvas.addEventListener('pointerout', this.#leaveHandler)
        this.#canvas.addEventListener('pointerup', this.#upHandler)
        this.#canvas.addEventListener('pointerdown', this.#downHandler)
    }

    setGameData(grid) {
        this.#grid = grid;
    }

    setEnablePointer(value) {
        this.#enablePointer = value;
    }

    setPointerHandler(handler) {
        this.#pointerHandler = handler;
    }

    #moveHandler = (pointerEvent) => {
        const { left, top } = this.#canvas.getBoundingClientRect()
        const { x, y } = { x: pointerEvent.x - left, y: pointerEvent.y - top }
        const cellSize = this.#getCellSize()
        const row = Math.floor(y / cellSize)
        const col = Math.floor(x / cellSize)
        const oldPointerCell = this.#pointerCell;
        this.#pointerCell = { row, col, value: this.#grid.getValue(row, col)}
        
        if(this.#isPointerDown) {
            this.#registerCurrentPointer()
        }
        if(oldPointerCell) {
            this.render(new Set([oldPointerCell]))
        }

        this.renderPointer()

    }
    #leaveHandler = () => {
        const oldPointerCell = this.#pointerCell;
        if(oldPointerCell) {
            this.render(new Set([oldPointerCell]))
        }
        this.#pointerCell = null;
        this.#isPointerDown = false;
        this.renderPointer()
    }

    #registerCurrentPointer = () => {
        if(this.#pointerHandler && this.#enablePointer) {
            this.#pointerHandler(this.#pointerCell)
        }
    }
    #upHandler = () => {
        this.#isPointerDown = false;
        this.#registerCurrentPointer();
    }
    #downHandler = () => {
        this.#isPointerDown = true;
    }

    clear() {
        this.#ctx.clearRect(0, 0, this.#CANVAS_SIZE, this.#CANVAS_SIZE)
    }

    #getCellSize() {
        return Math.floor(this.#CANVAS_SIZE / this.#grid.size);
    }

    renderPointer() {
        const cellSize = this.#getCellSize();
        if (this.#pointerCell && this.#enablePointer) {
            const x = this.#pointerCell.col * cellSize;
            const y = this.#pointerCell.row * cellSize;
            this.#ctx.fillStyle = 'grey'
            this.#ctx.fillRect(x, y, cellSize, cellSize);
        }
    }

    render(changesSet) {
        const cellSize = this.#getCellSize();
        const renderCell = (row,col) => {
            const x = col * cellSize;
            const y = row * cellSize;
            const value = this.#grid.getValue(row, col)
            const color = value === 1 ? 'black' : 'white';
            this.#ctx.fillStyle = color
            this.#ctx.fillRect(x, y, cellSize, cellSize);
        }
        if(changesSet) {
            changesSet.forEach(cell => renderCell(cell.row, cell.col));
        } else {
            this.#grid.traverse((row, col) => renderCell(row,col))
            console.warn('Full render');
        }

    }

}