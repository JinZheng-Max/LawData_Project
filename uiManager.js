import GameControl from './gameControl.js';

// 界面管理类
class UIManager {
    constructor(rows, cols, picNum) {
        this.rows = rows;
        this.cols = cols;
        this.picNum = picNum;
        this.gameControl = new GameControl(rows, cols, picNum);
        this.gameBoard = document.getElementById('game-board');
        this.timerElement = document.getElementById('timer');
        this.pauseButton = document.getElementById('pause');
        this.isPaused = false;
        this.time = 0;
        this.timerInterval = null;
        // 获取音频元素
        this.clickSound = document.getElementById('click-sound');
        this.eliminateSound = document.getElementById('eliminate-sound');
        this.bgm = document.getElementById('bgm');
        this.drawMap();
        this.addEventListeners();
        this.startTimer();
        // 开始游戏时播放背景音乐
        this.bgm.play();
    }

    drawMap() {
        this.gameBoard.innerHTML = '';
        const elementImage = new Image();
        const maskImage = new Image();
        elementImage.src = 'img/cxk_element.bmp';
        maskImage.src = 'img/cxk_mask.png';

        Promise.all([
            new Promise((resolve, reject) => {
                elementImage.onload = () => {
                    resolve();
                };
                elementImage.onerror = reject;
            }),
            new Promise((resolve, reject) => {
                maskImage.onload = () => {
                    resolve();
                };
                maskImage.onerror = reject;
            })
        ]).then(() => {
            const elementWidth = 40;
            const elementHeight = 40;

            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    const element = document.createElement('div');
                    element.classList.add('game-element');
                    element.style.width = `${elementWidth}px`;
                    element.style.height = `${elementHeight}px`;
                    const elemVal = this.gameControl.getElement(i, j);
                    if (elemVal !== -1) {
                        const canvas = document.createElement('canvas');
                        canvas.width = elementWidth;
                        canvas.height = elementHeight;
                        const ctx = canvas.getContext('2d');

                        // 清除画布
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        // 1. 先绘制元素图片
                        ctx.globalCompositeOperation = 'source-over';
                        ctx.drawImage(
                            elementImage,
                            0, elemVal * elementHeight,
                            elementWidth, elementHeight,
                            0, 0,
                            elementWidth, elementHeight
                        );

                        // 2. 使用掩码裁剪元素（保留掩码透明区域）
                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.drawImage(
                            maskImage,
                            0, elemVal * elementHeight,
                            elementWidth, elementHeight,
                            0, 0,
                            elementWidth, elementHeight
                        );

                        element.style.backgroundImage = `url(${canvas.toDataURL()})`;
                        element.style.backgroundSize = 'cover';
                        element.style.backgroundRepeat = 'no-repeat';
                    } else {
                        element.style.visibility = 'hidden';
                    }
                    element.dataset.row = i;
                    element.dataset.col = j;
                    this.gameBoard.appendChild(element);
                }
            }
        }).catch((error) => {
            console.error('图片加载失败:', error);
        });
    }

    // 按钮事件
    addEventListeners() {
        this.gameBoard.addEventListener('click', (event) => {
            if (event.target.classList.contains('game-element')) {
                // 播放点击音效
                this.clickSound.currentTime = 0;
                this.clickSound.play();

                const row = parseInt(event.target.dataset.row);
                const col = parseInt(event.target.dataset.col);
                if (this.gameControl.getElement(row, col) !== -1) {
                    if (!this.gameControl.firstSelect) {
                        this.gameControl.setFirstPoint(row, col);
                        event.target.classList.add('selected');
                    } else {
                        this.gameControl.setSecondPoint(row, col);
                        event.target.classList.add('selected');
                        if (this.gameControl.link()) {
                            // 播放消子音效
                            this.eliminateSound.currentTime = 0;
                            this.eliminateSound.play();

                            this.drawMap();
                            if (this.gameControl.isWin()) {
                                clearInterval(this.timerInterval);
                                alert('恭喜乐色，你获胜了，但你已经把张强的运气给用完了！');
                            }
                        } else {
                            const elements = document.querySelectorAll('.game-element');
                            elements.forEach((element) => {
                                element.classList.remove('selected');
                            });
                        }
                    }
                }
            }
        });

        const resetButton = document.getElementById('reset');
        resetButton.addEventListener('click', () => {
            // 播放点击音效
            this.clickSound.currentTime = 0;
            this.clickSound.play();

            this.gameControl.resetMap();
            this.drawMap();
        });

        const promptButton = document.getElementById('prompt');
        promptButton.addEventListener('click', () => {
            // 播放点击音效
            this.clickSound.currentTime = 0;
            this.clickSound.play();

            const prompt = this.gameControl.getPrompt();
            if (prompt) {
                const [v1, v2] = prompt;
                // 记录行列号而非元素引用
                const pos1 = { row: v1.row, col: v1.col };
                const pos2 = { row: v2.row, col: v2.col };

                // 添加提示高亮类
                const highlightElements = () => {
                    const element1 = document.querySelector(`.game-element[data-row="${pos1.row}"][data-col="${pos1.col}"]`);
                    const element2 = document.querySelector(`.game-element[data-row="${pos2.row}"][data-col="${pos2.col}"]`);
                    if (element1) element1.classList.add('prompt-highlight');
                    if (element2) element2.classList.add('prompt-highlight');
                };

                // 移除提示高亮类
                const removeHighlight = () => {
                    const currentElement1 = document.querySelector(`.game-element[data-row="${pos1.row}"][data-col="${pos1.col}"]`);
                    const currentElement2 = document.querySelector(`.game-element[data-row="${pos2.row}"][data-col="${pos2.col}"]`);
                    if (currentElement1) currentElement1.classList.remove('prompt-highlight');
                    if (currentElement2) currentElement2.classList.remove('prompt-highlight');
                };

                // 立即高亮
                highlightElements();
                // 2秒后移除高亮
                setTimeout(removeHighlight, 2000);
            }
        });

        this.pauseButton.addEventListener('click', () => {
            // 播放点击音效
            this.clickSound.currentTime = 0;
            this.clickSound.play();

            if (this.isPaused) {
                this.resumeTimer();
            } else {
                this.pauseTimer();
            }
        });
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.time++;
            const minutes = Math.floor(this.time / 60).toString().padStart(2, '0');
            const seconds = (this.time % 60).toString().padStart(2, '0');
            this.timerElement.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    pauseTimer() {
        clearInterval(this.timerInterval);
        this.isPaused = true;
        this.pauseButton.textContent = '继续';
    }

    resumeTimer() {
        this.timerInterval = setInterval(() => {
            this.time++;
            const minutes = Math.floor(this.time / 60).toString().padStart(2, '0');
            const seconds = (this.time % 60).toString().padStart(2, '0');
            this.timerElement.textContent = `${minutes}:${seconds}`;
        }, 1000);
        this.isPaused = false;
        this.pauseButton.textContent = '暂停';
    }
}

export default UIManager;