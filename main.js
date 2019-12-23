function generateBoard(element){
    for(var i = 0; i < 8; i++){
        var div = document.createElement("div");
        div.setAttribute("class", "row");
        for(var j = 0; j < 8; j++){
            var tile = null;
            if((i + j) % 2 == 0){
                tile = document.createElement("div");
                tile.setAttribute("class", "white_tile");
            }
            else{
                tile = document.createElement("div");
                tile.setAttribute("class", "black_tile");
            }
            div.appendChild(tile);
        }
        element.appendChild(div);
    }
}

class ChessGame{
    constructor(){
        this.current = "white"
        this.game_playing = false
        this.board = [];
        
        for(var i = 0; i < 8; i++){
            var row = [];
            for(var j = 0; j < 8; j++){
                row.append(new Pawn(j, i));
            }
            this.board.append(row);
        }
    }
    
    createGame(){
        
    }
    
    getValidMoves(x, y){ //get all possible squares the piece at x, y can move to
        var piece = this.board[x][y];
        var validMoves = 
    }
    
    move_piece(){
        
    }
    
    checkForMate(){
        
    }

}

class Piece{
    constructor(x, y){
        this.alive = true;
        this.x = x; 
        this.y = y;
    }
}

class Pawn extends Piece{
    constructor(x, y){
        super(x, y);
    }
    
    getMoves(){
        var all_moves = [[this.x - 1, this.y], [this.x, this.y + 1], [this.x + 1, this.y]];
        var possible_moves = [];
        for(move in all_moves){
            var x = move[0];
            var y = move[1];
            if(within_range(x, y)){
                possible_moves.append(move);
            }
        }
        return possible_moves;
    }
}

class Rook extends Piece{
    constructor(x, y){
        super(x, y);
    }
    
    getMoves(){
        
    }
}
               
function within_range(x, y){
    return (0 <= x && x <= 7 && 0 <= y && y <= 7);
}