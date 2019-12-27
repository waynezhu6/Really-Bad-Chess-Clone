const values = {
    "Pawn": 10,
    "Knight": 30,
    "Bishop": 30,
    "Rook": 50,
    "Queen": 90,
    "King": 900
}

class Tree{
    constructor(root, children, move){
        this.root = root;
        this.children = children;
        this.move = move;
    }
    
    evaluate(player){ //returns [score, index] with most optimal minimax score
        if(this.children.length == 0){
            return [getScore(this.root.board, player), -1];
        }
        else{
            if(player){ //if white, return highest
                var max = [];
                for(var i = 0; i < this.children.length; i++){
                    var child = this.children[i];
                    var result = child.evaluate(!player);
                    if(max.length){
                        max = [result[0], i];
                    }
                    else if(result[0] > max[0]){
                        max = [result[0], i];
                    }
                }
                return max;
            }
            else{ //if black, return lowest
                var min = [];
                for(var i = 0; i < this.children.length; i++){
                    var child = this.children[i];
                    var result = child.evaluate(!player);
                    if(min.length == 0){
                        min = [result[0], i];
                    }
                    else if(result[0] < min[0]){
                        min = [result[0], i];
                    }
                }
                return min;
            }
        } 
    }
}

function simulate(board, moves, player, depth){
    var tree = createTree(board, moves, player, depth, null);
    var index = tree.evaluate(player)[1];
    console.log(moves[index]);
    return moves[index];
}

function createTree(board, moves, player, depth, initialMove){
    if(depth == 0){
        return null;
    }
    else{
        var tree = new Tree(board, [], initialMove);
        var children = getChildren(board, moves);
        for(var i = 0; i < children.length; i++){
            var childMoves = children[i][1].getValidMoves(!player, true);
            var nextChild = createTree(children[i][1], childMoves, !player, depth - 1, children[i][0]);
            if(nextChild != null){
                tree.children.push(nextChild);
            }    
        }
        return tree;
    }
}
    
function getChildren(board, moves){ //returns array in [move, board] pairs
    var children = [];
    for(var i = 0; i < moves.length; i++){
        var sim = new Board(deepCopy(board.board));
        var simulatedBoard = sim.board;
        var move = moves[i];
        var old_i = move[0][0];
        var old_j = move[0][1];
        var new_i = move[1][0];
        var new_j = move[1][1];
        var piece = simulatedBoard[old_i][old_j];
        simulatedBoard[old_i][old_j] = null;
        simulatedBoard[new_i][new_j] = piece;
        children.push([move, sim]);
    }
    return children;
}

function evaluate(board, moves, player){ //returns the most optimal move for player
    
    var maxScore = null;
    var maxMove = [];

    for(var x = 0; x < moves.length; x++){
        var move = moves[x];
        var old_i = move[0][0];
        var old_j = move[0][1];
        var new_i = move[1][0];
        var new_j = move[1][1];

        var simulatedBoard = deepCopy(board);
        var piece = simulatedBoard[old_i][old_j];
        simulatedBoard[old_i][old_j] = null;
        simulatedBoard[new_i][new_j] = piece;

        var score = getScore(simulatedBoard);
        if(score > maxScore || maxScore == null){
            maxScore = score;
            maxMove = [];
            maxMove.push(move);
        }
        if(score == maxScore){
            maxScore = score;
            maxMove.push(move);
        }
    }
    var rand = Math.floor(Math.random() * (maxMove.length));
    return maxMove[rand];

}

function getScore(board, player){
    var score = 0;
    for(var i = 0; i < 8; i++){
        for(var j = 0; j < 8; j++){
            var piece = board[i][j];
            if(piece != null){
                var type = piece.constructor.name;
                piece.color == player ? score += values[type] : score -= values[type]; 
            }
        }
    }
    return score;
}