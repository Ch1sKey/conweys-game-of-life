export class HoverCanvasView {
    #CANVAS_SIZE = 600
    #grid = null
    #canvas = null
    #ctx = null
    #prevPointerCell = null;
    #pointerCell = null
    #isPointerDown = false
    #enablePointer = true
    #pointerHandler = null
    #gridSize = 0
    constructor(width, height) {
        this.#canvas = document.createElement('canvas');
        this.#canvas.id = 'hover'
        this.#canvas.width = width
        this.#canvas.height = height
        this.#ctx = this.#canvas.getContext('2d')

        this.#canvas.addEventListener('pointermove', this.#moveHandler)
        this.#canvas.addEventListener('pointerout', this.#leaveHandler)
        this.#canvas.addEventListener('pointerup', this.#upHandler)
        this.#canvas.addEventListener('pointerdown', this.#downHandler)

        document.querySelector('main').prepend(this.#canvas);
    }

    #setCurrentPointer = (pointerEvent) => {
        const { left, top } = this.#canvas.getBoundingClientRect()
        const { x, y } = { x: pointerEvent.x - left, y: pointerEvent.y - top }
        const cellSize = this.#getCellSize()
        const row = Math.floor(y / cellSize)
        const col = Math.floor(x / cellSize)
        this.#prevPointerCell = this.#pointerCell;
        this.#pointerCell = { row, col }

    }
    #moveHandler = (pointerEvent) => {
        this.#setCurrentPointer(pointerEvent);
        if (this.#isPointerDown) {
            const old = this.#prevPointerCell;
            const current = this.#pointerCell;
            if(old && current.row === old.row && current.col === old.col) {
                console.log(old, current)
                return
            }
            this.#registerCurrentPointer()
        }

        this.renderPointer()
    }

    #leaveHandler = () => {
        this.#pointerCell = null;
        this.#isPointerDown = false;
        this.renderPointer()
    }

    #upHandler = () => {
        console.log(this.#pointerCell)
        this.#isPointerDown = false;
        this.#pointerCell = null;
    }
    #downHandler = (pointerEvent) => {
        this.#setCurrentPointer(pointerEvent);
        this.#registerCurrentPointer();
        this.#isPointerDown = true;
    }

    #getCellSize() {
        return Math.floor(this.#CANVAS_SIZE / this.#gridSize);
    }

    #registerCurrentPointer = () => {
        if (this.#pointerHandler && this.#enablePointer) {
            console.log('register', {...this.#pointerCell})
            this.#pointerHandler(this.#pointerCell)
        }
    }

    setEnablePointer(value) {
        this.#enablePointer = value;
    }

    setPointerHandler(handler) {
        this.#pointerHandler = handler;
    }

    setGridSize(number) {
        this.#gridSize = number;
    }

    renderPointer() {
        this.clear()
        const cellSize = this.#getCellSize();
        if (this.#pointerCell && this.#enablePointer) {
            const x = this.#pointerCell.col * cellSize;
            const y = this.#pointerCell.row * cellSize;
            this.#ctx.fillStyle = 'grey'
            // this.#ctx.fillRect(x, y, cellSize, cellSize);
        }
    }

    clear() {
        this.#ctx.clearRect(0, 0, this.#CANVAS_SIZE, this.#CANVAS_SIZE)
    }
}