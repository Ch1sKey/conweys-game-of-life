export class ConrtolsView {
    #MAX_FPS_VALUE = 120
    #MIN_FIELD_SIZE = 1
    #fpsLimit = this.#MAX_FPS_VALUE

    #randomButton = null
    #playButton = null
    #stepButton = null
    #clearButton = null
    #fpsLimitInput = null
    #fpsLimitTextbox = null
    #sizeInput = null
    #sizeChangeButton = null
    #sizeTextbox = null

    #randomCallback = null
    #playCallback = null
    #stepCallback = null
    #clearCallback = null
    #fpsLimitCallback = null
    #sizeChangeCallback = null

    #isPlay = false
    #size = 100
    constructor() {
        this.#randomButton = document.getElementById("random")
        this.#randomButton.addEventListener("click", () => {
            this.#randomCallback?.()
        })
        this.#playButton = document.getElementById("play")
        this.#playButton.addEventListener("click", this.#playToggleHandler)
        document.addEventListener("keydown", event => {
            if (event.code !== "Space") return
            event.preventDefault()
            this.#playToggleHandler()
        })

        this.#stepButton = document.getElementById("step")
        this.#stepButton.addEventListener("click", () => {
            this.#stepCallback?.()
        })
        document.addEventListener("keydown", event => {
            if (event.code !== "ArrowRight") return
            this.#stepCallback?.()
        })

        this.#clearButton = document.getElementById("clear")
        this.#clearButton.addEventListener("click", () => {
            this.#clearCallback?.()
        })
        document.addEventListener("keydown", event => {
            if (event.code !== "c") return
            this.#clearCallback?.()
        })

        this.#fpsLimitInput = document.getElementById("fps_limit")
        this.#fpsLimitTextbox = document.getElementById("fps_limit_value")
        this.#fpsLimitTextbox.textContent = this.#fpsLimit
        this.#fpsLimitInput.addEventListener("input", event => {
            this.#fpsLimit = +event.target.value
            this.#fpsLimitTextbox.textContent =
                this.#fpsLimit === this.#MAX_FPS_VALUE
                    ? "Unlim"
                    : this.#fpsLimit
            this.#fpsLimitCallback?.()
        })
        this.#fpsLimitInput.value = this.#fpsLimit
        this.#fpsLimitInput.max = this.#MAX_FPS_VALUE

        this.#sizeInput = document.getElementById("size")
        this.#sizeInput.min = this.#MIN_FIELD_SIZE

        this.#sizeTextbox = document.getElementById("size_value")
        this.#sizeTextbox.textContent = this.#getFormattedSize()

        this.#sizeChangeButton = document.getElementById("size_change")
        this.#sizeChangeButton.addEventListener("click", event => {
            event.preventDefault()
            this.#size = +this.#sizeInput.value
            this.#sizeTextbox.textContent = this.#getFormattedSize()
            this.#sizeChangeCallback?.(this.#size)
        })
    }

    get isPlay() {
        return this.#isPlay
    }
    get fpsLimit() {
        return this.#fpsLimit
    }
    get size() {
        return this.#size
    }

    #getFormattedSize() {
        return `${this.#size}x${this.#size}`
    }

    #playToggleHandler = () => {
        this.#isPlay = !this.#isPlay
        this.#playButton.textContent = this.#isPlay ? "Stop" : "Play"
        this.#randomButton.disabled = this.#isPlay
        this.#stepButton.disabled = this.#isPlay
        this.#clearButton.disabled = this.#isPlay
        this.#sizeInput.disabled = this.#isPlay
        this.#sizeChangeButton.disabled = this.#isPlay
        this.#playCallback?.(this.#isPlay)
    }

    onRandom = callback => (this.#randomCallback = callback)
    onPlay = callback => (this.#playCallback = callback)
    onNextStep = callback => (this.#stepCallback = callback)
    onClear = callback => (this.#clearCallback = callback)
    onFPSLimitChange = callback => (this.#fpsLimitCallback = callback)
    onSizeChange = callback => (this.#sizeChangeCallback = callback)
}
