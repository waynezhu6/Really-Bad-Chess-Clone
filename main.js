class ChessGame{
    constructor(){
        this.game_playing = false;
        this.board = new Board(this.generateBoard()); //the board of this game
        this.currentPlayer = true; //true if white
        this.currentSelected = null; //the currently selected piece
        
        this.board.setValidMoves(true, false);
        this.board.setValidMoves(false, false);
    }
    
    generateBoard(){ //places all game pieces onto the board
        
        var init = [];
        
        for(var j = 0; j < 8; j++){
            init.push(new Pawn(true, 1, j));
            init.push(new Pawn(false, 6, j));
        }
                
        init.push(new Rook(true, 0, 0));
        init.push(new Knight(true, 0, 1));
        init.push(new Bishop(true, 0, 2));
        init.push(new Queen(true, 0, 3));
        init.push(new King(true, 0, 4));
        init.push(new Bishop(true, 0, 5));
        init.push(new Knight(true, 0, 6));
        init.push(new Rook(true, 0, 7));
        
        init.push(new Rook(false, 7, 0));
        init.push(new Knight(false, 7, 1));
        init.push(new Bishop(false, 7, 2));
        init.push(new Queen(false, 7, 3));
        init.push(new King(false, 7, 4));
        init.push(new Bishop(false, 7, 5));
        init.push(new Knight(false, 7, 6));
        init.push(new Rook(false, 7, 7));
        
        return init;
    }
    
    draw(){
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                var tileID = String(i) + String(j);
                var tile = document.getElementById(tileID);
                var piece = this.board.board[i][j];
                
                if(piece != null){
                    if(piece.color){
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
        var piece = this.board.getPiece(i, j);

        if(this.currentSelected == null){ //if no piece is selected
            if(piece != null){ //if this tile contains a piece...
                if(piece.color == this.currentPlayer){  //...and it belongs to the current player
                    piece.select(this.board);
                    this.currentSelected = piece;
                }
            }
        }
        else{ //if a piece is selected perform a possible movement or deselection
            var values = this.currentSelected.move(this.board, i, j); //attempt to make a move
            if(values == false){ //deselect if move failed
                if(piece == this.currentSelected){ //deselect if the same piece is clicked again
                    this.currentSelected.deselect();
                    this.currentSelected = null;
                }
                else if(piece != null){
                    if(this.board.isFriend(i, j, this.currentPlayer)){ //but if another friendly piece is clicked, select that instead
                        this.currentSelected.deselect();
                        this.currentSelected = piece;
                        this.currentSelected.select(this.board);
                    }
                }
                else{ //deselect if an empty tile is clicked
                    this.currentSelected.deselect();
                    this.currentSelected = null;
                }
            }
            else{ //if a move has succeeded
                this.currentSelected.deselect();
                this.movePiece(values[0], values[1], values[2], values[3]);
                this.currentSelected = null;
                //GOOD PLACE TO IMPLEMENT UNDO
                this.nextTurn();
            }
        }
    }
    
    movePiece(old_i, old_j, new_i, new_j){
        var capturedEnemy = this.board.movePiece(old_i, old_j, new_i, new_j);
        if(capturedEnemy != null){
            //do something
        }
        this.draw();
    }
    
    nextTurn(){ //sets the next turn
        this.board.setValidMoves(!this.currentPlayer, true); //update list of valid moves
        this.currentPlayer = !this.currentPlayer;
        
        console.log("checkmate", this.board.isCheckmated(this.currentPlayer));
        console.log("check", this.board.isChecked(this.currentPlayer));
            
        var moves = [];
        this.currentPlayer ? moves = this.board.whiteMoves : moves = this.board.blackMoves;
                
        //minimax simulation
        var result = simulate(this.board, moves, this.currentPlayer, 3);
        var piece = this.board.getPiece(result[0][0], result[0][1]);
        piece.move(this.board, result[1][0], result[1][1]);
        this.movePiece(result[0][0], result[0][1], result[1][0], result[1][1]);
        
        this.board.setValidMoves(!this.currentPlayer, true); //update list of valid moves
        this.currentPlayer = !this.currentPlayer;        
    }

}

class Board{ //representing a game board containing pieces
    constructor(init){
        this.board = []
        this.whiteMoves = []; //list of all possible moves in format "[[i, j], [i, j]] for white
        this.blackMoves = [];
        
        for(var i = 0; i < 8; i++){
            var row = [];
            for(var j = 0; j < 8; j++){
                row.push(null);
            }
            this.board.push(row);
        }
        
        for(var i = 0; i < init.length; i++){
            var piece = init[i];
            this.board[piece.i][piece.j] = piece;
        }
    }
    
    getPiece(i, j){
        if(within_range(i, j)){
            return this.board[i][j];
        }
        return null;
    }
    
    hasPiece(i, j){ //checks if board has a piece at i, j;
        try{
            return (this.board[i][j] != null);
        }
        catch{
            //console.log(this, i, j);    
        }
    }
    
    isEnemy(i, j, player){ //checks if piece at i, j is not color
        if(!within_range(i, j)){
            return false;
        }
        if(this.board[i][j] == null){
            return false;
        }
        return (this.board[i][j].color != player);
    }
    
    isFriend(i, j, player){ //checks if piece at i, j is color
        if(!within_range(i, j)){
            return false;
        }
        if(this.board[i][j] == null){
            return false;
        }
        return (this.board[i][j].color == player);
    }
    
    setValidMoves(color, checkSensitive){
        if(color){
            this.whiteMoves = this.getValidMoves(true, checkSensitive);
        }
        else{
            this.blackMoves = this.getValidMoves(false, checkSensitive);
        }
    }
    
    getValidMoves(player, checkSensitive){ //gets all possible moves for player
        var moves = [];
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                var piece = this.board[i][j];
                if(piece != null){
                    if(piece.color == player){
                        var validMoves = piece.getValidMoves(this, checkSensitive);
                        var from = [i, j];

                        for(var x = 0; x < validMoves.length; x++){
                            var to = validMoves[x];
                            moves.push([from, to]);
                        }
                    }
                }
            }
        }
        return moves;
    }
    
    movePiece(old_i, old_j, new_i, new_j){ //updates this.board. returns enemy if captured, otherwise returns false
        var piece = this.board[old_i][old_j];
        var enemy = this.board[new_i][new_j]
        this.board[old_i][old_j] = null;
        this.board[new_i][new_j] = piece;
        if(this.isEnemy(new_i, new_j)){
            return enemy;
        }
        return false;
    }
    
    getKing(player){ //return the [i, j] location of player's king
        var king = null;
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                var piece = this.board[i][j];
                if(piece != null){
                    if(piece.constructor.name == "King" && piece.color == player){
                        king = piece;
                        break;
                    }
                }          
            }
        }
        return [king.i, king.j];
    }
    
    isChecked(player){ //returns whether or not player has been checked
        var kingLocation = this.getKing(player);
        var opponentMoves = this.getValidMoves(!player, false);
        
        for(var i = 0; i < opponentMoves.length; i++){
            if(opponentMoves[i][1].toString() === kingLocation.toString()){
                return true;
            }
        }
        return false;
    }
    
    isCheckmated(player){ //check if this player has been checkmated
        
        var moves = [];
        player ? moves = this.whiteMoves : moves = this.blackMoves;
        if(moves.length == 0){
            return true;
        }
        return false;
        
    }
    
    copy(){ //returns a deep clone of this board
        var init = [];
        
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                var piece = this.board[i][j];
                if(piece != null){
                    switch(piece.constructor.name){
                            case "Pawn":
                                init.push(new Pawn(piece.color, piece.i, piece.j));
                                break;
                            case "Rook":
                                init.push(new Rook(piece.color, piece.i, piece.j));
                                break;
                            case "Knight":
                                init.push(new Knight(piece.color, piece.i, piece.j));
                                break;
                            case "Bishop":
                                init.push(new Bishop(piece.color, piece.i, piece.j));
                                break;
                            case "Queen":
                                init.push(new Queen(piece.color, piece.i, piece.j));
                                break;
                            case "King":
                                init.push(new King(piece.color, piece.i, piece.j));
                                break;
                            default:
                                tile.innerHTML = "?";
                        }
                }
            }
        }
        var board = new Board(init);
        return board;
    }
}
               
function within_range(i, j){
    return (0 <= i && i <= 7 && 0 <= j && j <= 7);
}

function toString(lst){ //returns in "ij" format
    return String(lst[0]) + String(lst[1]);
}

function contains(lst, value){ //see if list contains an [i, j] value
    value = toString(value);
    for(var i = 0; i < lst.length; i++){
        var element = toString(lst[i]);
        if(element == value){
            return true;
        }
    }
    return false;
}