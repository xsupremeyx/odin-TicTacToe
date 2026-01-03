const Gameboard = (function() {
    const board = [null,null,null,null,null,null,null,null,null];
    const getBoard = () => board;
    const setMark = (index,marker) => {
        if(isEmpty(index)){
            board.splice(index,1,marker);
            return true;
        }
        return false;
    };
    const isEmpty = (index) => (board[index] === null);
    const reset = () => board.fill(null);
    return {getBoard, setMark, isEmpty, reset};
})();



const Player = (name, marker) => ({name,marker});
const board = Gameboard;



