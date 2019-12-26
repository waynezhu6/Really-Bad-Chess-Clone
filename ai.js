const values = {
    "Pawn": 10,
    "Knight": 30,
    "Bishop": 30,
    "Rook": 50,
    "Queen": 90,
    "King": 900
}

function evaluate(board, moves, player){ //returns the most optimal move for player
    
    var maxScore = null;
    var maxMove = null;
        
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
                
        var score = 0;
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                var piece = simulatedBoard[i][j];
                if(piece != null){
                    var type = piece.constructor.name;
                    piece.color == player ? score += values[type] : score -= values[type]; 
                }
            }
        }
        if(score >= maxScore){
            maxScore = score;
            maxMove = move;
        }
    }
    return maxMove;
    
}