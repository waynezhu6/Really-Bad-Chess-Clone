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
        this.currentSelected = null;
        
        for(var i = 0; i < 8; i++){
            var row = [];
            for(var j = 0; j < 8; j++){
                row.push(null);
            }
            this.board.push(row);
        }
    }
    
    generateGame(){
        for(var i = 0; i < 8; i++){
            this.board[1][i] = new Pawn("white", i, 1);
            this.board[6][i] = new Pawn("black", i, 6);
        }
        this.board[0][0] = new Rook("white", 0, 0);
        this.board[0][1] = new Knight("white", 1, 0);
        this.board[0][2] = new Bishop("white", 2, 0);
        this.board[0][3] = new King("white", 3, 0);
        this.board[0][4] = new Queen("white", 4, 0);
        this.board[0][5] = new Bishop("white", 5, 0);
        this.board[0][6] = new Knight("white", 6, 0);
        this.board[0][7] = new Rook("white", 7, 0);
        
    }
    
    draw(){
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                var tileID = String(i) + String(j);
                var tile = document.getElementById(tileID);
                var piece = this.board[i][j];
                
                if(piece != null){
                    switch(piece.constructor){
                    case Pawn:
                        tile.innerHTML = "&#9817;";
                        break;
                    case Rook:
                        tile.innerHTML = "&#9814;";
                        break;
                    case Knight:
                        tile.innerHTML = "&#9816;";
                        break;
                    case Bishop:
                        tile.innerHTML = "&#9815;";
                        break;
                    case Queen:
                        tile.innerHTML = "&#9813;";
                        break;
                    case King:
                        tile.innerHTML = "&#9812;";
                        break;
                    default:
                        tile.innerHTML = "?";
                    }
                }  
            }
        }
    }
    
    onClick(id){
        var piece = this.board[id[0]][id[1]];
        
        if(piece != null){
            
            if(piece.selected){
                for(var i = 0; i < 8; i++){
                    for(var j = 0; j < 8; j++){
                        var thisID = String(i) + String(j)
                        var tile = document.getElementById(thisID);
                        tile.setAttribute("data-selected", "false");
                    }
                }
                piece.selected = false;
                return
            }
            else{
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
                piece.selected = true;
                if(this.currentSelected != null){
                    this.currentSelected.selected = false;
                }
                this.currentSelected = piece;
            }
            
        }
        else{
            for(var i = 0; i < 8; i++){
                for(var j = 0; j < 8; j++){
                    var thisID = String(i) + String(j)
                    var tile = document.getElementById(thisID);
                    tile.setAttribute("data-selected", "false");
                }
            }
            this.currentSelected.selected = false;
            this.currentSelected = null;
        }
    }
    
    getValidMoves(id){ //get all possible squares the piece at x, y can move to
        var y = id[0];
        var x = id[1];
        var piece = this.board[y][x];
        console.log(piece);
        
        if(piece != null && piece.color == this.currentPlayer){
            return piece.getValidMoves();
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
        this.selected = false;
    }
    
    getAllMoves(){
        return;
    }
    
    getValidMoves(){
        var all_moves = this.getAllMoves();
        var validMoves = [];
        for(var i = 0; i < all_moves.length; i++){
            var move = all_moves[i];
            var y = move[0];
            var x = move[1];
            if(within_range(x, y)){
                var strMove = String(y) + String(x);
                validMoves.push(strMove);
            }
        }
        return validMoves;
    }
}

class Pawn extends Piece{
    constructor(color, x, y){
        super(color, x, y);
        this.firstMove = true
    }
    
    getAllMoves(){
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
        return all_moves;
    }
}

class Rook extends Piece{
    constructor(color, x, y){
        super(color, x, y);
    }
    
    getAllMoves(){
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
        return all_moves;
    }
}

class Knight extends Piece{
    constructor(color, x, y){
        super(color, x, y);
    }
    
    getAllMoves(){
        var all_moves = [[this.y - 2, this.x + 1], [this.y - 1, this.x + 2], [this.y + 1, this.x + 2], [this.y + 2, this.x + 1], [this.y + 2, this.x - 1], [this.y + 1, this.x - 2], [this.y - 1, this.x - 2], [this.y - 2, this.x - 1]];
        return all_moves;
    }
}

class Bishop extends Piece{
    constructor(color, x, y){
        super(color, x, y);
    }
    
    getAllMoves(){
        var all_moves = [];
        for(var z = -8; z < 8; z++){
            if(z != 0){
                all_moves.push([this.y + z, this.x - z]);
                all_moves.push([this.y - z, this.x - z]);
            }
        }
        return all_moves;
    }
}

class Queen extends Piece{
    constructor(color, x, y){
        super(color, x, y);
    }
    
    getAllMoves(){
        var all_moves = [];
        
        for(var z = -8; z < 8; z++){
            if(z != 0){
                all_moves.push([this.y + z, this.x - z]);
                all_moves.push([this.y - z, this.x - z]);
            }
        }
        
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
        return all_moves;
    }
}

class King extends Piece{
    constructor(color, x, y){
        super(color, x, y);
    }
    
    getAllMoves(){
        var all_moves = [[this.y + 1, this.x], [this.y - 1, this.x], [this.y, this.x - 1], [this.y, this.x + 1]];
        return all_moves;
    }
}
               
function within_range(x, y){
    return (0 <= x && x <= 7 && 0 <= y && y <= 7);
}