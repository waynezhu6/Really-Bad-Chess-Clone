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
    
    generateGame(){ //places all game pieces onto the board
        for(var j = 0; j < 8; j++){
            this.board[1][j] = new Pawn(this, "white", 1, j);
            this.board[6][j] = new Pawn(this, "black", 6, j);
        }
        this.board[0][0] = new Rook(this, "white", 0, 0);
        this.board[0][1] = new Knight(this, "white", 0, 1);
        this.board[0][2] = new Bishop(this, "white", 0, 2);
        this.board[0][3] = new King(this, "white", 0, 3);
        this.board[0][4] = new Queen(this, "white", 0, 4);
        this.board[0][5] = new Bishop(this, "white", 0, 5);
        this.board[0][6] = new Knight(this, "white", 0, 6);
        this.board[0][7] = new Rook(this, "white", 0, 7);
        
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                if(this.board[i][j] != null){
                    this.board[i][j].getValidMoves(this);
                }
            }
        }
        
        this.board[7][0] = new Rook("black", 7, 0);
        this.board[7][1] = new Knight("black", 7, 1);
        this.board[7][2] = new Bishop("black", 7, 2);
        this.board[7][3] = new King("black", 7, 3);
        this.board[7][4] = new Queen("black", 7, 4);
        this.board[7][5] = new Bishop("black", 7, 5);
        this.board[7][6] = new Knight("black", 7, 6);
        this.board[7][7] = new Rook("black", 7, 7);
        
    }
    
    draw(){
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                var tileID = String(i) + String(j);
                var tile = document.getElementById(tileID);
                var piece = this.board[i][j];
                
                if(piece != null){
                    if(piece.color == "white"){
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
                        switch(piece.constructor){
                            case Pawn:
                                tile.innerHTML = "&#9823;";
                                break;
                            case Rook:
                                tile.innerHTML = "&#9820;";
                                break;
                            case Knight:
                                tile.innerHTML = "&#9822;";
                                break;
                            case Bishop:
                                tile.innerHTML = "&#9821;";
                                break;
                            case Queen:
                                tile.innerHTML = "&#9819;";
                                break;
                            case King:
                                tile.innerHTML = "&#9818;";
                                break;
                            default:
                                tile.innerHTML = "?";
                        }
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
                    this.movePiece(this.currentSelected, id[0], id[1]);
                    this.deselectAll();
                    this.nextTurn();
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
                piece.alive = false;
                this.board[id[0]][id[1]] = null;
                this.movePiece(this.currentSelected, id[0], id[1]);
                this.deselectAll();
                this.nextTurn();
                this.draw();
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
    
    getValidMoves(id){ //get all possible squares the piece at i, j can move to
        var i = id[0];
        var j = id[1];
        var piece = this.board[i][j];
        
        var validMoves = [];
        if(piece != null && piece.color == this.currentPlayer){
            var moves = piece.getValidMoves(this);
            for(var i = 0; i < moves.length; i++){
                var move = moves[i];
                var curr = this.board[move[0]][move[1]];
                if(curr == null){
                    validMoves.push(move);
                }
                else if(curr.color != this.currentPlayer){
                    validMoves.push(move);
                }
            }
            return validMoves;
        }
        else{
            return [];
        }
    }
    
    movePiece(piece, newI, newJ){
        var oldI = piece.i;
        var oldJ = piece.j;
        piece.i = parseInt(newI);
        piece.j = parseInt(newJ);
        piece.firstMove = false;
        
        this.board[oldI][oldJ] = null;
        this.board[newI][newJ] = piece;
    }
    
    checkForMate(){
        
    }
    
    hasPiece(i, j){
        return (this.board[i][j] != null);
    }
    
    isEnemy(i, j){
        if(this.board[i][j] == null){
            return false;
        }
        return (this.board[i][j].color != this.currentPlayer);
    }
    
    nextTurn(){
        console.log(this.currentPlayer);
        if(this.currentPlayer == "white"){
            this.currentPlayer = "black";
        }
        else{
            this.currentPlayer = "white";
        }
        console.log(this.currentPlayer);
    }

}

class Piece{
    constructor(game, color, i, j){
        this.game = game;
        this.color = color;
        this.alive = true;
        this.i = i; 
        this.j = j;
        this.firstMove = true;
        this.validMoves = []; //gets all valid moves on this term in "ij" format
    }
    
    getAllMoves(game){
        return;
    }
    
    getValidMoves(game){
        var all_moves = this.getAllMoves(game);
        var validMoves = [];
        for(var x = 0; x < all_moves.length; x++){
            var move = all_moves[x];
            var i = move[0];
            var j = move[1];
            if(within_range(i, j)){
                var strMove = String(i) + String(j);
                validMoves.push(strMove);
            }
        }
        return validMoves;
    }
}

class Pawn extends Piece{
    constructor(game, color, i, j){
        super(game, color, i, j);
        this.firstMove = true;
    }
    
    getValidMoves(game){
        var all_moves = [];
        if(this.color == "white"){
            if(!game.hasPiece(this.i + 1, this.j)){
                all_moves = [[this.i + 1, this.j]];
            }
            if(this.firstMove && !game.hasPiece(this.i + 1, this.j) && !game.hasPiece(this.i + 2, this.j)){
                all_moves.push([this.i + 2, this.j]);
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
            }
            if(this.firstMove && !game.hasPiece(this.i - 1, this.j) && !game.hasPiece(this.i - 2, this.j)){
                all_moves.push([this.i - 2, this.j]);
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
        this.validMoves = [];
    }
    
    getValidMoves(game){
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
        console.log(all_moves);
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
               
function within_range(i, j){
    return (0 <= i && i <= 7 && 0 <= j && j <= 7);
}