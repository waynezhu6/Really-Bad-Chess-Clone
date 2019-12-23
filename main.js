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
        this.board = [];
        this.currentPlayer = "white";
        this.currentSelected = null;
        this.currentMoves = [];
        
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
                else{
                    tile.innerHTML = "";
                }
            }
        }
    }
    
    onClick(id){
        var piece = this.board[id[0]][id[1]];
        var currentLocation = String(id[0]) + String(id[1]);
        
        if(this.currentSelected == null){ //if no piece is selected right now
            
            if(piece != null){ //if this tile contains a game piece
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
                this.currentSelected = piece;
                this.currentMoves = moves;
            }
            
        }
        else{
            
            if(piece == null){
                if(this.currentMoves.includes(currentLocation)){
                    this.move_piece(this.currentSelected, id[1], id[0]);
                    this.deselectAll();
                    this.draw();
                }
                else{
                    this.deselectAll();   
                }
            }
            else if(piece == this.currentSelected){ //deselect if selected again
                this.deselectAll();
            }
            else if(piece.color == this.currentPlayer){ //if piece is an friendly piece, select that instead
                this.deselectAll();
                var moves = this.getValidMoves(id);
                console.log(moves);
                
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
                this.currentSelected = piece;
                this.currentMoves = moves;                
            }
            else if(piece.color != this.currentPlayer){ //if we're trying to attack an enemy
                //PERFORM ATTACKING ACTION HERE
            }
            
            else{ //otherwise deselect all
                this.deselectAll();
            }
        }
    }
    
    deselectAll(){ //remove all blue selection tiles
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                var thisID = String(i) + String(j)
                var tile = document.getElementById(thisID);
                tile.setAttribute("data-selected", "false");
            }
        }
        this.currentSelected = null;
        this.currentMoves = null;
    }
    
    getValidMoves(id){ //get all possible squares the piece at x, y can move to
        var y = id[0];
        var x = id[1];
        var piece = this.board[y][x];
        
        var validMoves = [];
        if(piece != null && piece.color == this.currentPlayer){
            var moves = piece.getValidMoves(this);
            for(var i = 0; i < moves.length; i++){
                var move = moves[i];
                if(this.board[move[0]][move[1]] == null){
                    validMoves.push(move);
                }
            }
            return validMoves;
        }
        else{
            return [];
        }
    }
    
    move_piece(piece, newX, newY){
        var oldY = piece.y;
        var oldX = piece.x;
        piece.y = parseInt(newY);
        piece.x = parseInt(newX);
        
        this.board[oldY][oldX] = null;
        this.board[newY][newX] = piece;
    }
    
    checkForMate(){
        
    }
    
    hasPiece(x, y){
        return (this.board[y][x] != null);
    }
    
    isEnemy(x, y){
        return (this.board[y][x].color != this.currentPlayer);
    }

}

class Piece{
    constructor(color, x, y){
        this.color = color;
        this.alive = true;
        this.x = x; 
        this.y = y;
    }
    
    getAllMoves(game){
        return;
    }
    
    getValidMoves(game){
        var all_moves = this.getAllMoves(game);
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
    
    getAllMoves(game){
        var all_moves = [];
        if(this.color == "white"){
            all_moves = [[this.y + 1, this.x]];
            console.log(game.hasPiece(this.x, this.y + 2));
            if(this.firstMove && !game.hasPiece(this.x, this.y + 1)){
                all_moves.push([this.y + 2, this.x]);
            }
        }
        else{
            all_moves = [[this.y - 1, this.x]];
            if(this.firstMove && !game.hasPiece(this.x, this.y - 1)){
                all_moves.push([this.y - 2, this.x]);
            }
        }
        return all_moves;
        
        //IMPLEMENT PAWN ATTACKS
    }
}

class Rook extends Piece{
    constructor(color, x, y){
        super(color, x, y);
    }
    
    getAllMoves(game){
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