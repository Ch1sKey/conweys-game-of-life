import { View } from './View.js'
import { Game } from './Game.js'

export class Controller {
    #MAX_FPS_VALUE = 120;
    #view = null;
    #game = null;
    #isPlay = false;
    #playButton = null;
    #randomButton = null;
    #stepButton = null;
    #clearButton = null;
    #fpsLimit = 0;
    #fpsLimitTextbox = null;
    #fpsLimitInput = null;

    #pfMsTextbox = null
    #pfFpsTextbox = null

    #lastRenderTime = performance.now()

    constructor() {
        const canvas = document.createElement('canvas');
        canvas.id = 'main'
        
        this.#view = new View(canvas)
        this.#game = new Game();
        this.#view.setPointerHandler(cell => {
            this.#game.updateCell(cell.row, cell.col, 1)
            this.#view.render(new Set([cell]));
        })

        this.#randomButton = document.getElementById('random');
        this.#randomButton.addEventListener('click', this.#onRandomClick)

        this.#playButton = document.getElementById('play');
        this.#playButton.addEventListener('click', this.#onPlayClick)

        this.#stepButton = document.getElementById('step');
        this.#stepButton.addEventListener('click', this.#onNextStep)

        this.#clearButton = document.getElementById('clear');
        this.#clearButton.addEventListener('click', this.#onClearClick)

        this.#fpsLimitInput = document.getElementById('fps_limit');
        this.#fpsLimitTextbox = document.getElementById('fps_limit_value');
        this.#fpsLimitInput.addEventListener('input', this.#onFPSLimitChange);
        this.#setFPSLimit(+this.#fpsLimitInput.value);

        this.#pfMsTextbox = document.getElementById('pf_ms');

        this.#view.setGameData(this.#game.getGrid())
        this.#view.render()

        document.addEventListener('keydown', this.#onKeydown)

        document.querySelector('main').append(canvas)
    }

    #onRandomClick = (event) => {
        event.preventDefault();
        this.#game.fillRandom();
        this.#view.render();
    }
    #onPlayClick = (event) => {
        event.preventDefault();
        this.#togglePlay()
    }

    #togglePlay() {
        this.#isPlay = !this.#isPlay;
        this.#view.setEnablePointer(!this.#isPlay)
        this.#playButton.textContent = this.#isPlay ? 'Stop' : 'Play'
        this.#randomButton.disabled = this.#isPlay;
        this.#stepButton.disabled = this.#isPlay;
        this.#clearButton.disabled = this.#isPlay;
        this.play();
    }

    #onKeydown = (event) => {
        if(event.code !== 'Space') return;
        event.preventDefault();
        this.#togglePlay();
    }

    #onNextStep = event => {
        event.preventDefault();
        this.triggerNextGen()
    }

    #onClearClick = event => {
        event.preventDefault()
        this.#game.reset();
        this.#view.setGameData(this.#game.getGrid())
        this.#view.clear()
    }

    #onFPSLimitChange = event => {
        this.#setFPSLimit(+event.target.value)
    }

    #setFPSLimit = (value) => {
        this.#fpsLimit = value;
        this.#fpsLimitTextbox.textContent = value === this.#MAX_FPS_VALUE ? 'Unlim' : value 
    }

    triggerNextGen() {
        if(this.#fpsLimit !== this.#MAX_FPS_VALUE) {
            const timeSinceLastRender = performance.now() - this.#lastRenderTime
            if(timeSinceLastRender < 1000 / this.#fpsLimit) {
                return;
            }
        }

        this.#lastRenderTime = performance.now()
        const changes = this.#game.nextGen();
        this.#view.render(changes);
        this.#setPerformanceData(performance.now() - this.#lastRenderTime);
    }

    #setPerformanceData(ms) {
        this.#pfMsTextbox.textContent = ms.toFixed(2);
    }

    play() {
        if(!this.#isPlay) {
            return;
        };
        this.triggerNextGen()
        requestAnimationFrame(() => {
            this.play();
        })
    }

    
}