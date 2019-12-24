class Piece{
    constructor(game, color, i, j){
        this.game = game;
        this.color = color; //color of this piece white or black
        this.alive = true; //if this piece is uncaptured
        this.i = i; 
        this.j = j;
        this.firstMove = true;
        this.validMoves = []; //gets all valid moves on this term in "[i, j]" format
    }
    
    move(i, j){ //returns new [old_i, old_j, new_i, new_j] if moved, otherwise return false
        if(this.game.isFriend(i, j)){ //cannot move on top of another friendly piece
            return false;
        }
        else if(!this.game.hasPiece(i, j)){ //otherwise if i,j is empty, move there
            var old_i = this.i;
            var old_j = this.j;
            this.i = i;
            this.j = j;
            return [old_i, old_j, i, j];
        }
        else if(this.game.isEnemy(i, j)){ //otherwise if we are attempting to attack an enemy
            
        }
        return false; //otherwise just return false
    }
    
    select(){
        for(var i = 0; i < this.validMoves.length; i++){
            var id = this.validMoves[i]
            var element = document.getElementById(toString(id));
            element.setAttribute("data-selected", "true");
        }
        console.log('select');
    }
    
    deselect(){
        for(var i = 0; i < this.validMoves.length; i++){
            var id = this.validMoves[i]
            var element = document.getElementById(toString(id));
            element.setAttribute("data-selected", "false");
        }
    }
    
    getValidMoves(game){ //returns valid move in [i, j] format, removing off--board choices
        var allMoves = this.getAllMoves(game);
        var validMoves = []
        for(var x = 0; x < allMoves.length; x++){
            var curr = allMoves[x];
            if(within_range(curr[0], curr[1])){
                validMoves.push(curr);
            }
        }
        this.validMoves = validMoves;
    }
}

class Pawn extends Piece{
    constructor(game, color, i, j){
        super(game, color, i, j);
    }
    
    getAllMoves(game){ //returns moves in [i, j] format
        var all_moves = [];
        if(this.color == "white"){
            if(!game.hasPiece(this.i + 1, this.j)){
                all_moves = [[this.i + 1, this.j]];
                if(this.firstMove && !game.hasPiece(this.i + 2, this.j)){
                    all_moves.push([this.i + 2, this.j]);
                }
            }
            if(game.isEnemy(this.i + 1, this.j - 1)){
                all_moves.push([this.i + 1, this.j - 1]);
            }
            if(game.isEnemy(this.i + 1, this.j + 1)){
                all_moves.push([this.i + 1, this.j + 1]);
            }
        }
        else{
            if(!game.hasPiece(this.i - 1, this.j)){
                all_moves = [[this.i - 1, this.j]];
                if(this.firstMove && !game.hasPiece(this.i - 2, this.j)){
                    all_moves.push([this.i - 2, this.j]);
                }
            }
            if(game.isEnemy(this.i - 1, this.j - 1)){
                all_moves.push([this.i - 1, this.j - 1]);
            }
            if(game.isEnemy(this.i - 1, this.j + 1)){
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
    
    getAllMoves(game){
        var all_moves = [];
        for(var j = this.j - 1; j >= 0; j -= 1){
            if(game.hasPiece(this.i, j)){
                if(game.isEnemy(this.i, j)){
                    all_moves.push([this.i, j]);
                }
                break;
            }
            all_moves.push([this.i, j]);
        }
        for(var j = this.j + 1; j < 8; j++){
            if(game.hasPiece(this.i, j)){
                if(game.isEnemy(this.i, j)){
                    all_moves.push([this.i, j]);
                }
                break;
            }
            console.log(this.i, j)
            console.log(game.hasPiece(this.i, j))
            all_moves.push([this.i, j]);
        }
        
        for(var i = this.i - 1; i >= 0; i -= 1){
            if(game.hasPiece(i, this.j)){
                if(game.isEnemy(i, this.j)){
                    all_moves.push([i, this.j]);
                }
                break;
            }
            all_moves.push([i, this.j]);
        }
        for(var i = this.i + 1; i < 8; i++){
            if(game.hasPiece(i, this.j)){
                if(game.isEnemy(i, this.j)){
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
    constructor(color, i, j){
        super(color, i, j);
    }
    
    getAllMoves(game){
        var all_moves = [[this.i - 2, this.j + 1], [this.i - 1, this.j + 2], [this.i + 1, this.j + 2], [this.i + 2, this.j + 1], [this.i + 2, this.j - 1], [this.i + 1, this.j - 2], [this.i - 1, this.j - 2], [this.i - 2, this.j - 1]];
        return all_moves;
    }
}

class Bishop extends Piece{
    constructor(color, i, j){
        super(color, i, j);
    }
    
    getAllMoves(game){
        var all_moves = [];
        
        for(var z = 1; z < 8; z++){ //down and right
            if(!within_range(this.i + z, this.j + z)){
                break;
            }
            else if(game.hasPiece(this.i + z, this.j + z)){
                if(game.isEnemy(this.i + z, this.j + z)){
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
            else if(game.hasPiece(this.i - z, this.j + z)){
                if(game.isEnemy(this.i - z, this.j + z)){
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
            else if(game.hasPiece(this.i + z, this.j - z)){
                if(game.isEnemy(this.i + z, this.j - z)){
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
            else if(game.hasPiece(this.i - z, this.j - z)){
                if(game.isEnemy(this.i - z, this.j - z)){
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
    constructor(color, i, j){
        super(color, i, j);
    }
    
    getAllMoves(game){
        var all_moves = [];
        
        for(var j = this.j - 1; j >= 0; j -= 1){
            if(game.hasPiece(this.i, j)){
                if(game.isEnemy(this.i, j)){
                    all_moves.push([this.i, j]);
                }
                break;
            }
            all_moves.push([this.i, j]);
        }
        for(var j = this.j + 1; j < 8; j++){
            if(game.hasPiece(this.i, j)){
                if(game.isEnemy(this.i, j)){
                    all_moves.push([this.i, j]);
                }
                break;
            }
            all_moves.push([this.i, j]);
        }
        
        for(var i = this.i - 1; i >= 0; i -= 1){
            if(game.hasPiece(i, this.j)){
                if(game.isEnemy(i, this.j)){
                    all_moves.push([i, this.j]);
                }
                break;
            }
            all_moves.push([i, this.j]);
        }
        for(var i = this.i + 1; i < 8; i++){
            if(game.hasPiece(i, this.j)){
                if(game.isEnemy(i, this.j)){
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
            else if(game.hasPiece(this.i + z, this.j + z)){
                if(game.isEnemy(this.i + z, this.j + z)){
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
            else if(game.hasPiece(this.i - z, this.j + z)){
                if(game.isEnemy(this.i - z, this.j + z)){
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
            else if(game.hasPiece(this.i + z, this.j - z)){
                if(game.isEnemy(this.i + z, this.j - z)){
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
            else if(game.hasPiece(this.i - z, this.j - z)){
                if(game.isEnemy(this.i - z, this.j - z)){
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
    constructor(color, i, j){
        super(color, i, j);
    }
    
    getAllMoves(game){
        var all_moves = [[this.i + 1, this.j], [this.i - 1, this.j], [this.i, this.j - 1], [this.i, this.j + 1]];
        return all_moves;
    }
}