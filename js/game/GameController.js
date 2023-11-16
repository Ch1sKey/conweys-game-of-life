import { Game } from "./Game.js"
import { ConrtolsView } from "../controls/ControlsView.js"
import { CanvasController } from "../canvas/CanvasController.js"

export class GameController {
    #MAX_FPS_VALUE = 120
    #controls = null
    #game = null
    #canvasView = null
    #pfMsTextbox = null
    #lastRenderTime = performance.now()

    constructor() {
        this.#controls = new ConrtolsView()
        this.#game = new Game(this.#controls.size)
        this.#canvasView = new CanvasController(this.#game)
        this.#canvasView.setPointerHandler(this.#onGridChange)

        this.#controls.onRandom(this.#onRandom)
        this.#controls.onPlay(value => {
            this.#canvasView.setEnablePointer(!value)
            this.#play()
        })
        this.#controls.onNextStep(this.#triggerNextGen)
        this.#controls.onClear(this.#onClearClick)
        this.#controls.onSizeChange(this.#onSizeChange)

        this.#pfMsTextbox = document.getElementById("pf_ms")
    }

    #onGridChange = ({ row, col }) => {
        const cellValue = this.#game.grid.getValue(row, col)
        const newValue = cellValue === 1 ? 0 : 1
        this.#game.updateCell(row, col, newValue)
        this.#canvasView.render(new Set([{ row, col, value: newValue }]))
    }

    #onRandom = () => {
        this.#game.fillRandom()
        this.#canvasView.render()
    }

    #onClearClick = () => {
        this.#game.reset()
        this.#canvasView.clear()
    }

    #triggerNextGen = () => {
        const fpsLimit = this.#controls.fpsLimit
        if (fpsLimit !== this.#MAX_FPS_VALUE) {
            const timeSinceLastRender = performance.now() - this.#lastRenderTime
            if (timeSinceLastRender < 1000 / fpsLimit) {
                return
            }
        }

        this.#lastRenderTime = performance.now()
        const changes = this.#game.nextGen()
        this.#canvasView.render(changes)
        this.#setPerformanceData(performance.now() - this.#lastRenderTime)
    }

    #setPerformanceData(ms) {
        this.#pfMsTextbox.textContent = ms.toFixed(2)
    }

    #onSizeChange = newSize => {
        this.#game.changeSize(newSize, newSize)
        this.#canvasView.changeCanvasSize(newSize)
    }

    #play = () => {
        if (!this.#controls.isPlay) {
            return
        }
        this.#triggerNextGen()
        requestAnimationFrame(() => {
            this.#play()
        })
    }
}
