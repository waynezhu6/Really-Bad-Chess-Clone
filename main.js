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
        this.game_playing = false;
        this.board = []; //current state of the 8x8 board
        this.currentPlayer = "white"; //the current player white or black
        this.currentSelected = null; //the currently selected piece
        this.whiteMoves = []; //list of all possible moves in format "[[i, j], [i, j]] for white
        this.blackMoves = [];
        
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
        
        this.getValidMoves();      
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
    
    onClick(id){ //sends id in "ij" format
        var i = parseInt(id[0]);
        var j = parseInt(id[1]);
        var piece = this.board[i][j];
        
        if(this.currentSelected == null){ //if no piece is selected
            if(piece != null){ //if this tile contains a piece...
                if(piece.color == this.currentPlayer){  //...and it belongs to the current player
                    piece.select();
                    this.currentSelected = piece;
                }
            }
        }
        else{ //if a piece is selected perform a possible movement or deselection
            var values = this.currentSelected.move(i, j); //attempt to make a move
            if(values == false){ //deselect if move failed
                this.currentSelected.deselect();
                if(this.isFriend(i, j)){ //but if another friendly piece is clicked, select that instead
                    this.currentSelected = piece;
                    this.currentSelected.select();
                }
            }
            else{
                this.movePiece(values[0], values[1], values[2], values[3]);
                this.currentSelected.deselect();
                this.currentSelected = null;
                //GOOD PLACE TO IMPLEMENT UNDO
                this.nextTurn();
            }
        }
    }
    
    movePiece(old_i, old_j, new_i, new_j){ //updates this.board
        var piece = this.board[old_i][old_j];
        this.board[old_i][old_j] = null;
        if(this.isEnemy(new_i, new_j)){
            //DO SOMETHING IF MOVED ONTO AN ENEMY
        }
        this.board[new_i][new_j] = piece;
        this.draw(); //redraw the gameboard
    }
    
    getKing(player){ //return the [i, j] location of player's king
        var king = null;
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                var piece = this.board[i][j];
                if(piece instanceof King){
                    king = piece;
                    break;
                }
            }
        }
        
        return [king.i, king.j];
    }
    
    isChecked(player){ //returns whether or not player has been checked
        var kingLocation = this.getKing(player);
        var opponentMoves = [];
        player == "white" ? opponentMoves = this.blackMoves : opponentMoves = this.whiteMoves;
        
        for(var i = 0; i < opponentMoves.length; i++){
            if(opponentMoves[i][1] == kingLocation){
                return true;
            }
        }
        return false;
    }
    
    checkForMate(player){
        
    }
    
    getValidMoves(){
        var whiteMoves = [];
        var blackMoves = [];
        
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                var piece = this.board[i][j];
                if(piece != null){
                    var moves = piece.getValidMoves();
                    var from = [i, j];
                    
                    for(var x = 0; x < moves.length; x++){
                        var to = moves[x];
                        if(piece.color == "white"){
                            whiteMoves.push([from], [to]);
                        }
                        else{
                            blackMoves.push([from], [to]);
                        }
                    }
                }
            }
        }
        this.whiteMoves = whiteMoves;
        this.blakMoves = blackMoves;
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
    
    isFriend(i, j){
        if(this.board[i][j] == null){
            return false;
        }
        return (this.board[i][j].color == this.currentPlayer);
    }
    
    nextTurn(){
        if(this.currentPlayer == "white"){
            this.currentPlayer = "black";
        }
        else{
            this.currentPlayer = "white";
        }
    }

}
               
function within_range(i, j){
    return (0 <= i && i <= 7 && 0 <= j && j <= 7);
}

function fromString(str){ //returns in [i, j] format
    return [str[0], str[1]];
}

function toString(lst){ //returns in "ij" format
    return String(lst[0]) + String(lst[1]);
}