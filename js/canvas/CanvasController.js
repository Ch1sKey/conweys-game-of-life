import { GameCanvasView } from "./GameCanvasView.js"
import { HoverCanvasView } from "./HoverCanvasView.js"

const DEFAULT_CANVAS_SIZE = 600
const MIN_CANVAS_SIZE = 600

const getCanvasSizeFromFieldSize = fieldSize => {
    return Math.max(MIN_CANVAS_SIZE, fieldSize * 2)
}

export class CanvasController {
    #game = null
    #gameView = null
    #hoverView = null
    #canvasSize = DEFAULT_CANVAS_SIZE

    constructor(game) {
        this.#game = game
        this.#gameView = new GameCanvasView(this.#canvasSize)
        this.#hoverView = new HoverCanvasView(this.#canvasSize)
        this.#gameView.setGrid(this.#grid)
        this.#hoverView.setGridSize(this.#game.grid.size)

        this.#gameView.render()
    }

    setPointerHandler = callback => {
        this.#hoverView.setPointerHandler(callback)
    }

    get #grid() {
        return this.#game.grid
    }

    changeCanvasSize(size) {
        this.#canvasSize = size
        this.#hoverView.setGridSize(this.#grid.size)
        this.#gameView.setGrid(this.#grid)

        const canvasSize = getCanvasSizeFromFieldSize(this.#canvasSize)
        this.#gameView.setCanvasSize(canvasSize)
        this.#hoverView.setCanvasSize(canvasSize)

        this.#gameView.clear()
        this.#gameView.render()
    }

    setEnablePointer(value) {
        this.#hoverView.setEnablePointer(value)
    }

    render(changes) {
        this.#gameView.render(changes)
    }

    clear() {
        this.#gameView.setGrid(this.#grid)
        this.#gameView.clear()
    }
}
