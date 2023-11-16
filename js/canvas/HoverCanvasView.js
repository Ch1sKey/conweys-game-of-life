const POINTER_FILL_STYLE = "grey"

export class HoverCanvasView {
    #canvas = null
    #ctx = null
    #canvasSize = 0
    #prevPointerCell = null
    #pointerCell = null
    #isPointerDown = false
    #enablePointer = true
    #pointerHandler = null
    #gridSize = 0
    #cellSize = 0
    constructor(canvasSize) {
        this.#canvas = document.createElement("canvas")
        this.setCanvasSize(canvasSize)
        this.#canvas.id = "hover"
        this.#ctx = this.#canvas.getContext("2d")

        this.#canvas.addEventListener("pointermove", this.#moveHandler)
        this.#canvas.addEventListener("pointerout", this.#leaveHandler)
        this.#canvas.addEventListener("pointerup", this.#upHandler)
        this.#canvas.addEventListener("pointerdown", this.#downHandler)

        document.querySelector("main").prepend(this.#canvas)
    }

    #setCurrentPointer = pointerEvent => {
        const { left, top } = this.#canvas.getBoundingClientRect()
        const { x, y } = { x: pointerEvent.x - left, y: pointerEvent.y - top }
        const row = Math.floor(y / this.#cellSize)
        const col = Math.floor(x / this.#cellSize)
        this.#prevPointerCell = this.#pointerCell
        this.#pointerCell = { row, col }
    }
    #moveHandler = pointerEvent => {
        this.#setCurrentPointer(pointerEvent)
        if (this.#isPointerDown) {
            const old = this.#prevPointerCell
            const current = this.#pointerCell
            if (old && current.row === old.row && current.col === old.col) {
                return
            }
            this.#registerCurrentPointer()
        }

        this.renderPointer()
    }

    #leaveHandler = () => {
        this.#pointerCell = null
        this.#isPointerDown = false
        this.renderPointer()
    }

    #upHandler = () => {
        this.#isPointerDown = false
        this.#pointerCell = null
    }
    #downHandler = pointerEvent => {
        this.#setCurrentPointer(pointerEvent)
        this.#registerCurrentPointer()
        this.#isPointerDown = true
    }

    #registerCurrentPointer = () => {
        if (this.#pointerHandler && this.#enablePointer) {
            this.#pointerHandler(this.#pointerCell)
        }
    }

    setEnablePointer(value) {
        this.#enablePointer = value
        this.clear()
    }

    setPointerHandler(handler) {
        this.#pointerHandler = handler
    }

    setGridSize(number) {
        this.#gridSize = number
        this.#cellSize = this.#canvasSize / this.#gridSize
        this.clear()
    }

    setCanvasSize(size) {
        this.#canvasSize = size
        this.#cellSize = this.#canvasSize / this.#gridSize
        this.#canvas.width = this.#canvasSize
        this.#canvas.height = this.#canvasSize
    }

    renderPointer() {
        this.clear()
        if (this.#pointerCell && this.#enablePointer) {
            const x = this.#pointerCell.col * this.#cellSize
            const y = this.#pointerCell.row * this.#cellSize
            this.#ctx.fillStyle = POINTER_FILL_STYLE
            this.#ctx.fillRect(x, y, this.#cellSize, this.#cellSize)
        }
    }

    clear() {
        this.#ctx.clearRect(0, 0, this.#canvasSize, this.#canvasSize)
    }
}
