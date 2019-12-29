const values = {
    "Pawn": 10,
    "Knight": 30,
    "Bishop": 30,
    "Rook": 50,
    "Queen": 90,
    "King": 900
}

var paths = 0;
var moveChecks = 0;

class Tree{
    constructor(root, children, move, moves, player){ //root would be this move, by player
        this.root = root;
        this.children = children;
        this.move = move;
        this.moves = moves;
        this.score = null;
        this.player = player
    }
    
//    initialize(depth){
//        if(depth == 0){
//            return null;
//        }
//        else{
//            var children = getChildren(this.root, this.moves);
//            for(var i = 0; i < children.length; i++){
//                var child = children[i][1].copy();
//                paths += 1;
//                var childMoves = child.getValidMoves(!this.player, false);
//                var nextChild = new Tree(child, [], children[i][0], childMoves, !this.player);
//                if(nextChild != null){
//                    this.children.push(nextChild);
//                }    
//            }
//            
//            this.root = null;
//            this.moves = null;
//            for(var i = 0; i < this.children.length; i++){
//                this.children[i].initialize(depth - 1);
//            }
//        }
//    }
    
    evaluate(player){ //returns [score, index] with most optimal minimax score
        if(this.children.length == 0){
            return [getScore(this.root.board), -1];
        }
        else{
            if(player){ //if white, return highest
                var max = [];
                for(var i = 0; i < this.children.length; i++){
                    var child = this.children[i];
                    var result = child.evaluate(!player);
                    if(max.length == 0){
                        max.push([result[0], i]);
                    }
                    else if(result[0] > max[0][0]){
                        max = [[result[0], i]];
                    }
                    else if(result[0] == max[0][0]){
                        max.push([result[0], i]);
                    }
                }
                if(max.length == 1){
                    return max[0];
                }
                var index = Math.floor(Math.random() * (max.length));
                return max[index];
            }
            else{ //if black, return lowest
                var min = [];
                for(var i = 0; i < this.children.length; i++){
                    var child = this.children[i];
                    var result = child.evaluate(!player);
                    if(min.length == 0){
                        min.push([result[0], i]);
                    }
                    else if(result[0] < min[0]){
                        min = [[result[0], i]];
                    }
                    else if(result[0] == min[0][0]){
                        min.push([result[0], i]);
                    }
                }
                if(min.length == 1){
                    return min[0];
                }
                var index = Math.floor(Math.random() * (min.length));
                return min[index];
            }
        } 
    }
}

function simulate(board, moves, player, depth){
    paths = 0;
    moveChecks = 0;
    var tree = createTree(board.copy(), moves, !player, depth, null);
    //var tree = new Tree(board, [], null, moves, player);
    //tree.initialize(depth);
    console.log(paths, moveChecks);
    console.log(tree);
    var index = tree.evaluate(player)[1];
    return moves[index];
}

function createTree(board, moves, player, depth, initialMove){
    if(depth == 0){
        return null;
    }
    else{
        var tree = new Tree(board, []);
        var children = getChildren(board, moves);
        for(var i = 0; i < children.length; i++){
            var child = children[i][1].copy();
            paths += 1;
            var childMoves = child.getValidMoves(player, false);
            var nextChild = createTree(child, childMoves, player, depth - 1, children[i][0]);
            if(nextChild != null){
                tree.children.push(nextChild);
            }    
        }
        return tree;
    }
}
    
function getChildren(board, moves){ //returns array of boards
    var children = [];
    for(var i = 0; i < moves.length; i++){
        var sim = board.copy();
        var simulatedBoard = sim.board;
        var move = moves[i];
        var old_i = move[0][0];
        var old_j = move[0][1];
        var new_i = move[1][0];
        var new_j = move[1][1];
        var piece = simulatedBoard[old_i][old_j];
        simulatedBoard[old_i][old_j] = null;
        simulatedBoard[new_i][new_j] = piece;
        //console.log(board, new_i, new_j);
        piece.i = new_i;
        piece.j = new_j;
        children.push([move, sim]);
    }

    return children;
}

function getScore(board){
    var score = 0;
    for(var i = 0; i < 8; i++){
        for(var j = 0; j < 8; j++){
            var piece = board[i][j];
            if(piece != null){
                var type = piece.constructor.name;
                piece.color ? score += values[type] : score -= values[type]; 
            }
        }
    }
    return score;
}