class BoardConfig {
    constructor(row) {
        this.row = row;
        this.numPixels = this.row * this.row;
    }
}

class SnakeConfig {
    constructor(row, left, up, right, down) {
        this.row = row;
        this.left = left;
        this.up = up;
        this.right = right;
        this.down = down;
        this.numPixels = this.row * this.row;
    }
}

class Board extends BoardConfig {
    apple = 0;
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    createGameBoard() {
        for (let i = 0; i < this.numPixels; i++) {
            container.innerHTML = `${container.innerHTML} <div class="game-board-pixel" id="pixel${i}"></div>`;
        }
    }

    addApple() {
        boardPixel[this.apple].classList.remove("apple");
        // checking if apple is into the snake
        while(true) {
            this.apple = this.getRandomInt(this.numPixels);
            if(!boardPixel[this.apple].classList.contains("snake-pixel")) break;
        }
        boardPixel[this.apple].classList.add("apple");
    }
}

class Snake extends SnakeConfig {
    vectorDirection = this.right;
    snakeStartPixel = this.numPixels*0.5;
    snakeStartSize = 200;

    changeVector(newVector) {
        if (newVector == this.left && this.vectorDirection != this.right) {
            this.vectorDirection = newVector;
        } else if (newVector == this.right && this.vectorDirection != this.left) {
            this.vectorDirection = newVector;
        } else if (newVector == this.up && this.vectorDirection != this.down) {
            this.vectorDirection = newVector;
        } else if (newVector == this.down && this.vectorDirection != this.up) {
            this.vectorDirection = newVector;
        }
    }

    moveSnake(){
        switch (this.vectorDirection) {
            case this.left:
                this.snakeStartPixel--;
                if (this.snakeStartPixel < 0 || this.snakeStartPixel % this.row == this.row - 1 ) {
                    this.snakeStartPixel += this.row;
                }
                break;
            case this.right:
                this.snakeStartPixel++;
                if (this.snakeStartPixel % this.row == 0) {
                    this.snakeStartPixel -= this.row;
                }
                break;
            case this.up:
                this.snakeStartPixel -= this.row;
                if (this.snakeStartPixel < 0) {
                    this.snakeStartPixel += this.numPixels;
                }
                break;
            case this.down:
                this.snakeStartPixel += this.row;
                if (this.snakeStartPixel > this.numPixels - 1) {
                    this.snakeStartPixel -= this.numPixels;
                }
                break;
        }
        
        let newStartPixel = boardPixel[this.snakeStartPixel];

        if (newStartPixel.classList.contains("snake-pixel")) {
            window.location.reload();
        }

        newStartPixel.classList.add("snake-pixel");

        setTimeout(() => {
            newStartPixel.classList.remove("snake-pixel");
        }, this.snakeStartSize);

        if (this.snakeStartPixel == board.apple) {
            snake.snakeStartSize = this.snakeStartSize + 100;
            board.addApple();
        }
    }

    play() {
        this.moveInterval = setInterval(() => {
            this.moveSnake()
        }, 100);
    }
}

class Modal {
    open() {
        document.querySelector('.modal').style.display = 'block';
        setTimeout(() => document.querySelector('.modal').style.opacity = '1', 0)
    }

    close() {
        document.querySelector('.modal').style.opacity = '0';
        setTimeout(() => document.querySelector('.modal').style.display = 'none', 300);
    }
}

class Soundtrack {

    constructor(soundControlImg) {
        this.soundControl = soundControlImg;
        this.isMuted = true;
        this.soundtrackAudio = new Audio('./assets/soundtrack.mp3');
        this.soundtrackAudio.loop = true;
    }

    mute() {
        this.soundtrackAudio.pause();
        soundControl.setAttribute('src', './assets/mute-icon.png');
        this.isMuted = true;
    }

    unmute() {
        this.soundtrackAudio.play();
        soundControl.setAttribute('src', './assets/unmute-icon.png');
        this.isMuted = false;
    }

    toggle() {
        if(this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }
}

const container = document.getElementById("game-window");
const boardPixel = document.getElementsByClassName("game-board-pixel");
const soundControl = document.getElementById('sound-control');

const board = new Board(20);
const snake = new Snake(20, 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown');
const modal = new Modal();
const soundtrack = new Soundtrack(soundControl);

function game() {
    board.createGameBoard();
    board.addApple();
    window.addEventListener("keydown", (e) => {
        snake.changeVector(e.key)
    });
}

game();

soundControl.addEventListener('click', (event) => {
    soundtrack.toggle();
});

document.querySelector('#play-btn').addEventListener('click', (event) => {
    snake.play();
    soundtrack.toggle();
    modal.close();
});