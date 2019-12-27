class Piece{
    constructor(game, color, i, j){
        this.color = color; //true if white
        this.alive = true; //if this piece is uncaptured
        this.i = i; 
        this.j = j;
        this.firstMove = true;
        this.validMoves = []; //gets all valid moves on this term in "[i, j]" format
        this.allMoves = []; //gets all possible moves
    }
    
    move(board, i, j){ //returns new [old_i, old_j, new_i, new_j] if moved, otherwise return false
        if(board.isFriend(i, j, this.color)){ //cannot move on top of another friendly piece
            return false;
        }
        else if(!board.hasPiece(i, j) || board.isEnemy(i, j, this.color)){ //otherwise if i,j is empty, move there
            if(contains(this.validMoves, [i, j])){
                this.deselect();
                var old_i = this.i;
                var old_j = this.j;
                this.i = i;
                this.j = j;
                this.firstMove = false;
                this.allMoves = this.getAllMoves(board);
                return [old_i, old_j, i, j];
            }
            return false;
        }
        return false; //otherwise just return false
    }
    
    select(board){
        for(var i = 0; i < this.validMoves.length; i++){
            var id = this.validMoves[i];
            var element = document.getElementById(toString(id));
            if(board.isEnemy(id[0], id[1], this.color)){
                element.setAttribute("data-attacked", "true");   
            }
            else{
                element.setAttribute("data-selected", "true");
            }
        }
    }
    
    deselect(){
        for(var i = 0; i < this.validMoves.length; i++){
            var id = this.validMoves[i]
            var element = document.getElementById(toString(id));
            element.setAttribute("data-selected", "false");
            element.setAttribute("data-attacked", "false");
        }
    }
    
    getValidMoves(board, checkSensitive){ //returns valid move in [i, j] format, removing off--board choices
        console.log(1);
        var allMoves = this.getAllMoves(board);
        var validMoves = [];
        for(var x = 0; x < allMoves.length; x++){
            var move = allMoves[x];
            if(within_range(move[0], move[1])){
                if(checkSensitive){
                    var simulatedBoard = new Board(deepCopy(board.board));
                    simulatedBoard.movePiece(this.i, this.j, move[0], move[1]);
                    if(!simulatedBoard.isChecked(this.color)){
                        validMoves.push(move);
                    }
                }
                else{
                    validMoves.push(move);
                }
            }
        }
        this.validMoves = validMoves;
        return validMoves;
    }

}

class Pawn extends Piece{
    constructor(game, color, i, j){
        super(game, color, i, j);
    }
    
    getAllMoves(board){ //returns moves in [i, j] format
        var all_moves = [];
        if(this.color){
            if(!board.hasPiece(this.i + 1, this.j)){
                all_moves = [[this.i + 1, this.j]];
                if(this.firstMove && !board.hasPiece(this.i + 2, this.j)){
                    all_moves.push([this.i + 2, this.j]);
                }
            }
            if(board.isEnemy(this.i + 1, this.j - 1, this.color)){
                all_moves.push([this.i + 1, this.j - 1]);
            }
            if(board.isEnemy(this.i + 1, this.j + 1, this.color)){
                all_moves.push([this.i + 1, this.j + 1]);
            }
        }
        else{
            if(!board.hasPiece(this.i - 1, this.j)){
                all_moves = [[this.i - 1, this.j]];
                if(this.firstMove && !board.hasPiece(this.i - 2, this.j)){
                    all_moves.push([this.i - 2, this.j]);
                }
            }
            if(board.isEnemy(this.i - 1, this.j - 1, this.color)){
                all_moves.push([this.i - 1, this.j - 1]);
            }
            if(board.isEnemy(this.i - 1, this.j + 1, this.color)){
                all_moves.push([this.i - 1, this.j + 1]);
            }
        }
        return all_moves;
        
    }
}

class Rook extends Piece{
    constructor(game, color, i, j){
        super(game, color, i, j);
    }
    
    getAllMoves(board){
        var all_moves = [];
        for(var j = this.j - 1; j >= 0; j -= 1){
            if(board.hasPiece(this.i, j)){
                if(board.isEnemy(this.i, j, this.color)){
                    all_moves.push([this.i, j]);
                }
                break;
            }
            all_moves.push([this.i, j]);
        }
        for(var j = this.j + 1; j < 8; j++){
            if(board.hasPiece(this.i, j)){
                if(board.isEnemy(this.i, j, this.color)){
                    all_moves.push([this.i, j]);
                }
                break;
            }
            all_moves.push([this.i, j]);
        }
        
        for(var i = this.i - 1; i >= 0; i -= 1){
            if(board.hasPiece(i, this.j)){
                if(board.isEnemy(i, this.j, this.color)){
                    all_moves.push([i, this.j]);
                }
                break;
            }
            all_moves.push([i, this.j]);
        }
        for(var i = this.i + 1; i < 8; i++){
            if(board.hasPiece(i, this.j)){
                if(board.isEnemy(i, this.j, this.color)){
                    all_moves.push([i, this.j]);
                }
                break;
            }            
            all_moves.push([i, this.j]);
        }
        return all_moves;
    }
}

class Knight extends Piece{
    constructor(game, color, i, j){
        super(game, color, i, j);
    }
    
    getAllMoves(board){
        var lst = [[this.i - 2, this.j + 1], [this.i - 1, this.j + 2], [this.i + 1, this.j + 2], [this.i + 2, this.j + 1], [this.i + 2, this.j - 1], [this.i + 1, this.j - 2], [this.i - 1, this.j - 2], [this.i - 2, this.j - 1]];
        
        var all_moves = []
        for(var x = 0; x < lst.length; x++){
            var move = lst[x];
            if(!board.isFriend(move[0], move[1], this.color)){
                all_moves.push(move);
            }
        }
        
        return all_moves;
    }
}

class Bishop extends Piece{
    constructor(game, color, i, j){
        super(game, color, i, j);
    }
    
    getAllMoves(board){
        var all_moves = [];
        
        for(var z = 1; z < 8; z++){ //down and right
            if(!within_range(this.i + z, this.j + z)){
                break;
            }
            else if(board.hasPiece(this.i + z, this.j + z)){
                if(board.isEnemy(this.i + z, this.j + z, this.color)){
                    all_moves.push([this.i + z, this.j + z]);
                }
                break;
            }
            all_moves.push([this.i + z, this.j + z]);
        }
        for(var z = 1; z < 8; z++){
            if(!within_range(this.i - z, this.j + z)){
                break;
            }
            else if(board.hasPiece(this.i - z, this.j + z)){
                if(board.isEnemy(this.i - z, this.j + z, this.color)){
                    all_moves.push([this.i - z, this.j + z]);
                }
                break;
            }
            all_moves.push([this.i - z, this.j + z]);
        }
        for(var z = 1; z < 8; z++){
            if(!within_range(this.i + z, this.j - z)){
                break;
            }
            else if(board.hasPiece(this.i + z, this.j - z)){
                if(board.isEnemy(this.i + z, this.j - z, this.color)){
                    all_moves.push([this.i + z, this.j - z]);
                }
                break;
            }
            all_moves.push([this.i + z, this.j - z]);
        }
        for(var z = 1; z < 8; z++){
            if(!within_range(this.i - z, this.j - z)){
                break;
            }
            else if(board.hasPiece(this.i - z, this.j - z)){
                if(board.isEnemy(this.i - z, this.j - z, this.color)){
                    all_moves.push([this.i - z, this.j - z]);
                }
                break;
            }
            all_moves.push([this.i - z, this.j - z]);
        }
        return all_moves;
    }
}

class Queen extends Piece{
    constructor(game, color, i, j){
        super(game, color, i, j);
    }
    
    getAllMoves(board){
        var all_moves = [];
        
        for(var j = this.j - 1; j >= 0; j -= 1){
            if(board.hasPiece(this.i, j)){
                if(board.isEnemy(this.i, j, this.color)){
                    all_moves.push([this.i, j]);
                }
                break;
            }
            all_moves.push([this.i, j]);
        }
        for(var j = this.j + 1; j < 8; j++){
            if(board.hasPiece(this.i, j)){
                if(board.isEnemy(this.i, j, this.color)){
                    all_moves.push([this.i, j]);
                }
                break;
            }
            all_moves.push([this.i, j]);
        }
        
        for(var i = this.i - 1; i >= 0; i -= 1){
            if(board.hasPiece(i, this.j)){
                if(board.isEnemy(i, this.j, this.color)){
                    all_moves.push([i, this.j]);
                }
                break;
            }
            all_moves.push([i, this.j]);
        }
        for(var i = this.i + 1; i < 8; i++){
            if(board.hasPiece(i, this.j)){
                if(board.isEnemy(i, this.j, this.color)){
                    all_moves.push([i, this.j]);
                }
                break;
            }            
            all_moves.push([i, this.j]);
        }
        
        for(var z = 1; z < 8; z++){ //down and right
            if(!within_range(this.i + z, this.j + z)){
                break;
            }
            else if(board.hasPiece(this.i + z, this.j + z)){
                if(board.isEnemy(this.i + z, this.j + z, this.color)){
                    all_moves.push([this.i + z, this.j + z]);
                }
                break;
            }
            all_moves.push([this.i + z, this.j + z]);
        }
        for(var z = 1; z < 8; z++){
            if(!within_range(this.i - z, this.j + z)){
                break;
            }
            else if(board.hasPiece(this.i - z, this.j + z)){
                if(board.isEnemy(this.i - z, this.j + z, this.color)){
                    all_moves.push([this.i - z, this.j + z]);
                }
                break;
            }
            all_moves.push([this.i - z, this.j + z]);
        }
        for(var z = 1; z < 8; z++){
            if(!within_range(this.i + z, this.j - z)){
                break;
            }
            else if(board.hasPiece(this.i + z, this.j - z)){
                if(board.isEnemy(this.i + z, this.j - z, this.color)){
                    all_moves.push([this.i + z, this.j - z]);
                }
                break;
            }
            all_moves.push([this.i + z, this.j - z]);
        }
        for(var z = 1; z < 8; z++){
            if(!within_range(this.i - z, this.j - z)){
                break;
            }
            else if(board.hasPiece(this.i - z, this.j - z)){
                if(board.isEnemy(this.i - z, this.j - z, this.color)){
                    all_moves.push([this.i - z, this.j - z]);
                }
                break;
            }
            all_moves.push([this.i - z, this.j - z]);
        }
        
        return all_moves;
    }
}

class King extends Piece{
    constructor(game, color, i, j){
        super(game, color, i, j);
    }
    
    getAllMoves(board){
        var lst = [[this.i + 1, this.j], [this.i - 1, this.j], [this.i, this.j - 1], [this.i, this.j + 1]];
        
        var all_moves = []
        for(var x = 0; x < lst.length; x++){
            var move = lst[x];
            if(!board.isFriend(move[0], move[1], this.color)){
                all_moves.push(move);
            }
        }
        
        return all_moves;
    }
}