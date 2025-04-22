import GameLogic from './gameLogic.js';

// 游戏控制类
class GameControl {
    constructor(rows, cols, picNum) {
        this.gameLogic = new GameLogic(rows, cols, picNum);
        this.firstSelect = null;
        this.secondSelect = null;
    }

    setFirstPoint(row, col) {
        this.firstSelect = { row, col };
    }

    setSecondPoint(row, col) {
        this.secondSelect = { row, col };
    }

    link() {
        if (this.firstSelect && this.secondSelect) {
            if (this.gameLogic.isLink(this.firstSelect, this.secondSelect)) {
                this.gameLogic.clear(this.firstSelect, this.secondSelect);
                this.firstSelect = null;
                this.secondSelect = null;
                return true;
            }
            this.firstSelect = null;
            this.secondSelect = null;
        }
        return false;
    }

    isWin() {
        return this.gameLogic.isWin();
    }

    resetMap() {
        this.gameLogic.resetMap();
    }

    getPrompt() {
        return this.gameLogic.getPrompt();
    }

    getElement(row, col) {
        return this.gameLogic.gameMap[row][col];
    }
}

export default GameControl;
