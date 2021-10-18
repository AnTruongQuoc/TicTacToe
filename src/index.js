import React, {useEffect, useState } from "react";
import ReactDOM from "react-dom"
import { calcWinner, create2DArray } from "./func";
import "./index.css"

const Square = ({ value, onClickSquare, winClass }) => {
    
    return (
        <button className={'square ' + winClass} onClick={onClickSquare}>
            {value}
        </button>
    );
}

const Board = ({winning, squares, onClick }) => {
    const [winPath, setWinPath] = useState(null);

    useEffect(() => {
        setWinPath(winning);
    }, [winning])
    

    const renderSquare = (row, col, classWin) => {
        //console.log(`Check render square (${row},${col})`);
        return (
            <Square
                key={row * 12 + col * 5 + 2}
                value={squares[row][col]}
                onClickSquare={() => onClick(row, col)}
                winClass={classWin}
            />
        );
    }
    
    return (
        <div>
            {
                squares.map((row, indexRow) => {
                    return (
                        <div className="board-row" key={indexRow}>
                            {
                                row.map((colValue, indexCol) => {
                                    let classWin = 'no-win'

                                    for(let i=0; i < 5; i++){
                                        if(!winPath) break
                                        if(winPath[i][0] === indexRow && winPath[i][1] === indexCol){
                                            classWin = 'win-active'
                                            break
                                        }
                                    }
                                    
                                    return renderSquare(indexRow, indexCol, classWin)
                                })
                            }
                        </div>
                    );
                })
            }

        </div >
    );

}

const Game = () => {
    const [history, setHistory] = useState([{ squares: create2DArray(5, 5) }]);
    const [xIsNext, setXIsNext] = useState(true);
    const [stepNumber, setStepNumber] = useState(0);
    //const [current, setCurrent] = useState(create2DArray(5, 5));
    const [activeHistory, setActiceHistory] = useState(0);
    const [playerHistory, setPlayerHistory] = useState([{ player: null, position: { rowVal: null, colVal: null } }]);
    const [isReversed, setIsReversed] = useState(false);
    // const [winPath, setWinPath] = useState([[]]);

    const handleClickReverseHistory = () => {
        setIsReversed(!isReversed);
    }

    const handleClick = (row, col) => {

        const history_copy = history.slice(0, stepNumber + 1);
        const current_copy = history_copy[history_copy.length - 1];
        const squares_copy = current_copy.squares.map((e) => e.slice(0));
        const pHis_copy = playerHistory.slice(0, stepNumber + 1);
        const pHis_curr = [{
            player: xIsNext ? 'X' : 'O',
            position: {
                rowVal: row,
                colVal: col
            }
        }]

        if (calcWinner(squares_copy)|| squares_copy[row][col]) {
            return;
        }
        
        squares_copy[row][col] = xIsNext ? 'X' : 'O';

        setHistory(history_copy.concat([{ squares: squares_copy }]));
        setStepNumber(history_copy.length);
        //setCurrent([...squares_copy]);
        setXIsNext(!xIsNext);
        setActiceHistory(history_copy.length);
        setPlayerHistory(pHis_copy.concat(pHis_curr));
        
    }

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
        setActiceHistory(step);

        // const cHistory = history.slice(0, step + 1);
        // const cBlock = cHistory[step];
        // const cSquare = cBlock.squares.map(e => e.slice(0));
        // setCurrent([...cSquare]);
    }
    //=====================================================================


    const winner = calcWinner(history[stepNumber].squares);


    let status;

    if (winner) {
        status = 'Winner: ' + (xIsNext ? 'O' : 'X');
        console.log('path ', winner);
    } else {
        if (stepNumber >= 25) {
            status = '--> DRAW !!!!!'
        }
        else {
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
    }

    let moves;

    if (!isReversed) {
        
        moves = history.map((step, move) => {
            const desc = move ?
                `${move+1}. Player ${playerHistory[move].player}: (${playerHistory[move].position.colVal},${playerHistory[move].position.rowVal}) - Go to move #${move}` :
                `${move+1}. Go to game start`;
            return (
                <li key={move} className={(activeHistory === move) ? 'active' : ''}>
                    <button onClick={() => jumpTo(move)}>{desc}</button>
                </li>
            );
        })
    } else {
        
        let reverseHistory = [];

        const history_copy = history.slice(0);
        for (let i = 0; i < history.length; i++) {
            const current_copy = history_copy[i];
            const squares_copy = current_copy.squares.map((e) => e.slice(0));
            reverseHistory.push({squares: squares_copy});
            
        }

        reverseHistory.reverse();

        moves = reverseHistory.map((step, move) => {
            
            const max = reverseHistory.length -1;
            
            const realMove = max - move;
            
            const desc = realMove ?
                `${realMove+1}. Player ${playerHistory[realMove].player}: (${playerHistory[realMove].position.colVal},${playerHistory[realMove].position.rowVal}) - Go to move #${realMove}` :
                `${realMove+1}. Go to game start`;
            return (
                <li key={realMove} className={(activeHistory === realMove) ? 'active' : ''}>
                    <button onClick={() => jumpTo(realMove)}>{desc}</button>
                </li>
            );
        })
    }


    return (
        <div className="game">
            <div className="game-board">
                <Board
                    winning={winner}
                    squares={history[stepNumber].squares}
                    onClick={(i, j) => handleClick(i, j)}
                />
            </div>
            <div className="game-info">
                <div className="game-header">
                    <span>{status}</span>
                    <button onClick={handleClickReverseHistory}>Sort History</button>
                </div>
                <ol>{moves}</ol>
            </div>
        </div>
    );

}

// ========================================

ReactDOM.render(
    <React.StrictMode>
        <Game />
    </React.StrictMode>,
    document.getElementById('caro-wrapper')
    
);

