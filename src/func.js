/**
 *   Create 2d array
 *   with param
 *   @param {number} row - 2D array row numbers
 *   @param {number} col - 2D array column numbers
*/ 
export const create2DArray = (row, col) => {
    return new Array(row)
            .fill()
            .map(() => (
                new Array(col)
                .fill(null)
                )
            );
}

export const calcWinner = (squares) => {
    if(!squares) return null; 
    const hozLength = squares.length;
    const verLength = squares[0].length;
    let winPath = [];

    //Horizal check
    for (let i = 0; i < hozLength; i++) {
        for(let j=0; j <hozLength; j++){
            winPath.push([i, hozLength - j -1]);
        }
        
        if(allEqual(squares[i])) {
            return winPath
        }else{
			winPath=[];
		}
		;
    }

    //Vertical check
    winPath = []
    for (let j = 0; j < verLength; j++) {
        let arr = squares.map(row => row[j]);
        
        for(let i=0; i < hozLength; i++){
            winPath.push([i, j]);
        }

        if(allEqual(arr)) {
            return winPath
        }else {
            winPath = []
        }
    }

    //Diagonal case
    let arrDiagonal1 = [];
    let arrDiagonal2 = [];
    let checkDia1 = true, checkDia2 = true;

    //Check Diagonal \
    winPath = []
    for (let k = 0; k < hozLength; k++){
        if(squares[k][k] !== null){
            arrDiagonal1.push(squares[k][k]);
            winPath.push([k,k]);
        }
        else {checkDia1 = false};  
        
    }
    if(checkDia1) {
        if(allEqual(arrDiagonal1)){
            return winPath;
        }
    }
    //Check Diagonal /
    winPath = []
    for (let k = 0; k < hozLength; k++){
        if(squares[k][(hozLength-1)-k] !== null){
            arrDiagonal2.push(squares[k][(hozLength-1)-k]);
            winPath.push([k,(hozLength-1)-k]);
        }
        else {checkDia2 = false};
    }
    
    if(checkDia2){
        if(allEqual(arrDiagonal2)){
            return winPath;
        } 
        
    }
    
    return false;
}

/**
 * Check if all values of array are equal
 * @param {Array} arr 
 * @returns {boolean}
 */
const allEqual = (arr) => {
    // if (arr.length < 1) return false;
    
    for(let i=0 ; i < arr.length; i++){
        if(arr[i] !== arr[0] || arr[i] === null){
            return false;
        }
    }
    return true;
}