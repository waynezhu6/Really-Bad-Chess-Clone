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
            tile.setAttribute("id", String(i) + String(j));
            tile.setAttribute("onclick", "G.onClick(this.id)");
            tile.style.top = String(75 * i + 2);
            tile.style.left = String(75 * j + 2);
            div.appendChild(tile);
        }
        element.appendChild(div);
    }
}

class ChessGame{
    constructor(){
        this.current = "white";
        this.game_playing = false;
        this.board = [];;
        this.currentPlayer = "white";
        
        for(var i = 0; i < 8; i++){
            var row = [];
            for(var j = 0; j < 8; j++){
                row.push(new Rook("white", i, j));
            }
            this.board.push(row);
        }
    }
    
    createGame(){
        
    }
    
    draw(){
        for(var i = 0; i < 7; i++){
            for(var j = 0; j < 7; j++){
                var tileID = String(i) + String(j);
                var tile = document.getElementById(tileID);
                var piece = this.board[i][j];
                switch(piece){
                    case piece instanceof Pawn:
                        return tile.innerHTML = "&#9817;";
                        break;
                    case piece instanceof Rook:
                        return tile.innerHTML = "&#9814;";
                        break;
                    default:
                        tile.innerHTML = "&#9817;";
                }
            }
        }
    }
    
    onClick(id){
        var moves = this.getValidMoves(id);
        
        for(var i = 0; i < 8; i++){
            
            for(var j = 0; j < 8; j++){
                
                var thisID = String(i) + String(j)
                var tile = document.getElementById(thisID);
                
                if(moves.includes(thisID)){
                    tile.setAttribute("data-selected", "true");
                } 
                else{
                    tile.setAttribute("data-selected", "false");
                }
            }
        }
    }
    
    getValidMoves(id){ //get all possible squares the piece at x, y can move to
        var x = id[0];
        var y = id[1];
        var piece = this.board[y][x];
        
        if(piece != null && piece.color == this.currentPlayer){
            return piece.getMoves();
        }
        else{
            return [];
        }
    }
    
    move_piece(){
        
    }
    
    checkForMate(){
        
    }

}

class Piece{
    constructor(color, x, y){
        this.color = color;
        this.alive = true;
        this.x = x; 
        this.y = y;
    }
    
    getMoves(){
        return
    }
}

class Pawn extends Piece{
    constructor(color, x, y){
        super(color, x, y);
        this.firstMove = true
    }
    
    getMoves(){
        var all_moves = [];
        if(this.color == "white"){
            all_moves = [[this.y + 1, this.x]];
            if(this.firstMove){
                all_moves.push([this.y + 2, this.x]);
            }
        }
        else{
            all_moves = [[this.y - 1, this.x]];
            if(this.firstMove){
                all_moves.push([this.y - 2, this.x]);
            }
        }
        
        var possible_moves = [];
        for(var i = 0; i < all_moves.length; i++){
            var move = all_moves[i];
            var y = move[0];
            var x = move[1];
            if(within_range(x, y)){
                var strMove = String(y) + String(x);
                possible_moves.push(strMove);
            }
        }
        return possible_moves;
    }
}

class Rook extends Piece{
    constructor(color, x, y){
        super(color, x, y);
    }
    
    getMoves(){
        var all_moves = [];
        for(var x = 0; x < 8; x++){
            if(x != this.x){
                all_moves.push([this.y, x]);
            }
        }
        for(var y = 0; y < 8; y++){
            if(y != this.y){
                all_moves.push([y, this.x]);
            }
        }
        
        var possible_moves = [];
        for(var i = 0; i < all_moves.length; i++){
            var move = all_moves[i];
            var y = move[0];
            var x = move[1];
            if(within_range(x, y)){
                var strMove = String(y) + String(x);
                possible_moves.push(strMove);
            }
        }
        return possible_moves;
    }
}

class Knight extends Piece{
    constructor(color, x, y){
        super(color, x, y);
    }
    
    getMoves(){
        var all_moves = [];
        for(var x = 0; x < 8; x++){
            if(x != this.x){
                all_moves.push([this.y, x]);
            }
        }
        for(var y = 0; y < 8; y++){
            if(y != this.y){
                all_moves.push([y, this.x]);
            }
        }
        
        var possible_moves = [];
        for(var i = 0; i < all_moves.length; i++){
            var move = all_moves[i];
            var y = move[0];
            var x = move[1];
            if(within_range(x, y)){
                var strMove = String(y) + String(x);
                possible_moves.push(strMove);
            }
        }
        return possible_moves;
    }
}

class Bishop extends Piece{
    constructor(color, x, y){
        super(color, x, y);
    }
    
    getMoves(){
        var all_moves = [];
        for(var x = 0; x < 8; x++){
            if(x != this.x){
                all_moves.push([this.y, x]);
            }
        }
        for(var y = 0; y < 8; y++){
            if(y != this.y){
                all_moves.push([y, this.x]);
            }
        }
        
        var possible_moves = [];
        for(var i = 0; i < all_moves.length; i++){
            var move = all_moves[i];
            var y = move[0];
            var x = move[1];
            if(within_range(x, y)){
                var strMove = String(y) + String(x);
                possible_moves.push(strMove);
            }
        }
        return possible_moves;
    }
}

class Queen extends Piece{
    constructor(color, x, y){
        super(color, x, y);
    }
    
    getMoves(){
        var all_moves = [];
        for(var x = 0; x < 8; x++){
            if(x != this.x){
                all_moves.push([this.y, x]);
            }
        }
        for(var y = 0; y < 8; y++){
            if(y != this.y){
                all_moves.push([y, this.x]);
            }
        }
        
        var possible_moves = [];
        for(var i = 0; i < all_moves.length; i++){
            var move = all_moves[i];
            var y = move[0];
            var x = move[1];
            if(within_range(x, y)){
                var strMove = String(y) + String(x);
                possible_moves.push(strMove);
            }
        }
        return possible_moves;
    }
}

class King extends Piece{
    constructor(color, x, y){
        super(color, x, y);
    }
    
    getMoves(){
        var all_moves = [];
        for(var x = 0; x < 8; x++){
            if(x != this.x){
                all_moves.push([this.y, x]);
            }
        }
        for(var y = 0; y < 8; y++){
            if(y != this.y){
                all_moves.push([y, this.x]);
            }
        }
        
        var possible_moves = [];
        for(var i = 0; i < all_moves.length; i++){
            var move = all_moves[i];
            var y = move[0];
            var x = move[1];
            if(within_range(x, y)){
                var strMove = String(y) + String(x);
                possible_moves.push(strMove);
            }
        }
        return possible_moves;
    }
}
               
function within_range(x, y){
    return (0 <= x && x <= 7 && 0 <= y && y <= 7);
}