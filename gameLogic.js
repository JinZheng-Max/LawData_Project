// 游戏逻辑类
class GameLogic {
    constructor(rows, cols, picNum) {
        this.rows = rows;
        this.cols = cols;
        this.picNum = picNum;
        this.gameMap = [];
        this.initMap();
    }

    initMap() {
        const totalElements = this.rows * this.cols;
        const repeatNum = totalElements / (this.picNum * 2);
        let elements = [];
        for (let i = 0; i < this.picNum; i++) {
            for (let j = 0; j < repeatNum * 2; j++) {
                elements.push(i);
            }
        }
        // 打乱元素顺序
        elements.sort(() => Math.random() - 0.5);
        // 初始化游戏地图
        this.gameMap = [];
        for (let i = 0; i < this.rows; i++) {
            let row = [];
            for (let j = 0; j < this.cols; j++) {
                row.push(elements[i * this.cols + j]);
            }
            this.gameMap.push(row);
        }
    }

    // 判断在同一行从col1到col2是否连通（中间无障碍）
    linkInRow(row, col1, col2) {
        if (col1 === col2) return true;
        const start = Math.min(col1, col2);
        const end = Math.max(col1, col2);
        for (let c = start + 1; c < end; c++) {
            if (this.gameMap[row][c] !== -1) return false;
        }
        return true;
    }

    // 判断在同一列从row1到row2是否连通（中间无障碍）
    linkInCol(col, row1, row2) {
        if (row1 === row2) return true;
        const start = Math.min(row1, row2);
        const end = Math.max(row1, row2);
        for (let r = start + 1; r < end; r++) {
            if (this.gameMap[r][col] !== -1) return false;
        }
        return true;
    }

    // 判断一个拐角连接
    linkOneCorner(v1, v2) {
        // 检查拐点1 (v1.row, v2.col)
        if (this.gameMap[v1.row][v2.col] === -1) {
            if (this.linkInRow(v1.row, v1.col, v2.col) && 
                this.linkInCol(v2.col, v1.row, v2.row)) {
                return true;
            }
        }

        // 检查拐点2 (v2.row, v1.col)
        if (this.gameMap[v2.row][v1.col] === -1) {
            if (this.linkInRow(v2.row, v1.col, v2.col) && 
                this.linkInCol(v1.col, v1.row, v2.row)) {
                return true;
            }
        }

        return false;
    }

    // 判断两个拐角连接
    linkTwoCorners(v1, v2) {
        // 横向扫描
        for (let col = 0; col < this.cols; col++) {
            if (this.gameMap[v1.row][col] === -1 && 
                this.gameMap[v2.row][col] === -1) {
                if (this.linkInCol(col, v1.row, v2.row) && 
                    this.linkInRow(v1.row, v1.col, col) && 
                    this.linkInRow(v2.row, col, v2.col)) {
                    return true;
                }
            }
        }

        // 纵向扫描
        for (let row = 0; row < this.rows; row++) {
            if (this.gameMap[row][v1.col] === -1 && 
                this.gameMap[row][v2.col] === -1) {
                if (this.linkInRow(row, v1.col, v2.col) && 
                    this.linkInCol(v1.col, v1.row, row) && 
                    this.linkInCol(v2.col, row, v2.row)) {
                    return true;
                }
            }
        }

        return false;
    }


//  isLink 方法
isLink(v1, v2) {
    console.log(`开始检查 (${v1.row}, ${v1.col}) 和 (${v2.row}, ${v2.col}) 是否可连接`);
    // 基本检查
    if (v1.row === v2.row && v1.col === v2.col) {
        console.log('两个点位置相同，不可连接');
        return false;
    }
    if (this.gameMap[v1.row][v1.col] !== this.gameMap[v2.row][v2.col]) {
        console.log('两个点的元素不同，不可连接');
        return false;
    }

    // 直接连接（同行或同列）
    if (v1.row === v2.row) {
        const rowConnect = this.linkInRow(v1.row, v1.col, v2.col);
        console.log(`检查同行连接，结果: ${rowConnect}`);
        if (rowConnect) {
            console.log('同行可直接连接');
            return true;
        }
        if (v1.row === 0 || v1.row === this.rows - 1) {
            console.log('边界同图可连接');
                return true;
            }
    }
    if (v1.col === v2.col) {
        const colConnect = this.linkInCol(v1.col, v1.row, v2.row);
        console.log(`检查同列连接，结果: ${colConnect}`);
        if (colConnect) {
            console.log('同列可直接连接');
            return true;
        }
      
            if (v1.col === 0 || v1.col === this.cols - 1) {
                console.log('边界同图可连接');
                    return true;
            }
    }

    // 一个拐角连接
    const oneCornerConnect = this.linkOneCorner(v1, v2);
    console.log(`检查一个拐角连接，结果: ${oneCornerConnect}`);
    if (oneCornerConnect) {
        console.log('一个拐角可连接');
        return true;
    }

    // 两个拐角连接
    const twoCornersConnect = this.linkTwoCorners(v1, v2);
    console.log(`检查两个拐角连接，结果: ${twoCornersConnect}`);
    if (twoCornersConnect) {
        console.log('两个拐角可连接');
        return true;
    }

    // 边界特殊处理（扩展虚拟路径）
   
    

    console.log('所有连接方式检查完毕，不可连接');
    return false;
}
    clear(v1, v2) {
        this.gameMap[v1.row][v1.col] = -1; // -1 表示空白
        this.gameMap[v2.row][v2.col] = -1;
    }

    isWin() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.gameMap[i][j] !== -1) {
                    return false;
                }
            }
        }
        return true;
    }

    resetMap() {
        const totalElements = this.rows * this.cols;
        for (let i = 0; i < totalElements; i++) {
            const index1 = Math.floor(Math.random() * totalElements);
            const index2 = Math.floor(Math.random() * totalElements);
            const row1 = Math.floor(index1 / this.cols);
            const col1 = index1 % this.cols;
            const row2 = Math.floor(index2 / this.cols);
            const col2 = index2 % this.cols;

            // 交换两个位置的元素
            const temp = this.gameMap[row1][col1];
            this.gameMap[row1][col1] = this.gameMap[row2][col2];
            this.gameMap[row2][col2] = temp;
        }
    }

    getPrompt() {
        // 遍历所有非空白元素
        for (let row1 = 0; row1 < this.rows; row1++) {
            for (let col1 = 0; col1 < this.cols; col1++) {
                // 跳过空白格
                if (this.gameMap[row1][col1] === -1) continue;
    
                // 从当前元素开始向右、向下搜索
                for (let row2 = row1; row2 < this.rows; row2++) {
                    // 同一行从下一列开始，不同行从第0列开始
                    const startCol = (row2 === row1) ? col1 + 1 : 0;
    
                    for (let col2 = startCol; col2 < this.cols; col2++) {
                        // 跳过空白格和自身
                        if (this.gameMap[row2][col2] === -1) continue;
    
                        // 创建顶点对象
                        const v1 = { row: row1, col: col1 };
                        const v2 = { row: row2, col: col2 };
    
                        // 检查是否可连接
                        const canConnect = this.isLink(v1, v2);
                        console.log(`检查 (${v1.row}, ${v1.col}) 和 (${v2.row}, ${v2.col}) 是否可连接，结果: ${canConnect}`);
                        if (canConnect) {
                            return [v1, v2]; // 返回第一对可连接的图标
                        }
                    }
                }
            }
        }
        return null; // 没有可连接的图标对
    }
}

export default GameLogic;