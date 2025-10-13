let legalSquares = [];
let isWhiteTurn = true;
const boardSquares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");
const piecesImages = document.getElementsByTagName("img");

/* The setupBoardSquares() funcion sets up the event listeners and IDs for the squares on the chess board

   This function also calculates the row and column of each square and assigns an ID to the square in the
   format column + row, where column is a letter from 'a' to 'h' and row is a number from 1 to 8 */
setupBoardSquares();
setupPieces()
function setupBoardSquares() {
    for (let i = 0; i < boardSquares.length; i++) {
        boardSquares[i].addEventListener("dragover", allowDrop);
        boardSquares[i].addEventListener("drop", drop);
        let row = 8 - Math.floor(i / 8);
        let column = String.fromCharCode(97 + (i % 8));
        let square = boardSquares[i];
        square.id = column + row;
    }
}

/* The setupPieces() function sets up the drag and drop functionality for the pieces on the chess board and also sets their IDs

   This function also sets the draggable attribute of each piece to true, allowing the pieces to be dragged. It then loops through
   an array of piecesImages and sets the draggable attribute of each image to false, precenting the images from being dragged

   The images of the pieces are prevented from being dragged to ensure that only the pieces themselves can be dragged and dropped on the board */
function setupPieces() {
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].addEventListener("dragstart", drag);
        pieces[i].setAttribute("draggable", true);
        pieces[i].id = pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;
    }
    for (let i = 0; i < piecesImages.length; i++) {
        piecesImages[i].setAttribute("draggable", false);
    }
}

/* By default, an element cannot be dropped on another elemnt. Calling the preventDefault method on the dragover event cancels this default behavior
   and allows the drop to occur */
function allowDrop(ev) {
    ev.preventDefault();
}

/* The drag() function retrieves the target of the event, which is the piece element being dragged 
   
   The function then calls the setData method on the dataTransfer property of the event object, setting the data type to "text" and the data value to
   the ID of the piece. This allows the data to be transferred during the drag and drop operation */
function drag(ev) {
    const piece = ev.target;
    const pieceColor = piece.getAttribute("color");

    if ((isWhiteTurn && pieceColor == "white") || (!isWhiteTurn && pieceColor == "black")) {

        ev.dataTransfer.setData("text", piece.id);
        const startingSquareId = piece.parentNode.id;
        getPossibleMoves(startingSquareId, piece);
    }
}

/* The drop() function retrieves the data that was set during the dragstart event by calling the getData method on the dataTransfer property of the event object

   It then retrieves the target of the drop event, which is the element on which the drop occured, and assigns it to the destinationSquare variable 

   Finally, it appends the dragged element to the destinationSquare, effectively moving it to its new location on the board */
function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    const piece = document.getElementById(data);
    const destinationSquare = ev.currentTarget;
    let destinationSquareId = destinationSquare.id;

    if ((isSquareOccupied(destinationSquare) == "blank") && (legalSquares.includes(destinationSquareId))) {
        destinationSquare.appendChild(piece);
        isWhiteTurn = !isWhiteTurn;
        legalSquares.length = 0;
        return;
    }
    if ((isSquareOccupied(destinationSquare) != "blank") && (legalSquares.includes(destinationSquareId))) {
        while (destinationSquare.firstChild) {
            destinationSquare.removeChild(destinationSquare.firstChild);
        }
        destinationSquare.appendChild(piece);
        isWhiteTurn = !isWhiteTurn;
        legalSquares.length = 0;
        return;
    }
}

function getPossibleMoves(startingSquareId, piece) {
    const pieceColor = piece.getAttribute("color");
    if (piece.classList.contains("pawn")) {
        getPawnMoves(startingSquareId, pieceColor);
    }
    if (piece.classList.contains("knight")) {
        getKnightMoves(startingSquareId, pieceColor);
    }
    if (piece.classList.contains("rook")) {
        getRookMoves(startingSquareId, pieceColor);
    }
    if (piece.classList.contains("bishop")) {
        getBishopMoves(startingSquareId, pieceColor);
    }
    if (piece.classList.contains("queen")) {
        getQueenMoves(startingSquareId, pieceColor);
    }
    if (piece.classList.contains("king")) {
        getKingMoves(startingSquareId, pieceColor);
    }
}

/* The isSquareOccupied function checks if a sqaure is occupied by a piece. If it is, the function returns the color of the piece; if not it returns "blank" 

   This does 2 things. Enables us to add the capture feature and it enables us to prevent pieces from moving to already occupied squares */
function isSquareOccupied(square) {
    if (square.querySelector(".piece")) {
        const color = square.querySelector(".piece").getAttribute("color");
        return color;
    }
    else {
        return "blank";
    }
}

function getPawnMoves(startingSquareId, pieceColor) {
    checkPawnDiagonalCaptures(startingSquareId, pieceColor);
    checkPawnForwardMoves(startingSquareId, pieceColor);
}

/* The checkPawnDiagonalCaptures() function checks the two diagonal squares to the top left and top right of the pawn. If there are pieces of the opposite color
   on those squares, it adds them to the legalSquares array */
function checkPawnDiagonalCaptures(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);
    const direction = pieceColor == "white" ? 1:-1;

    currentRank += direction;
    for (let i = -1; i <= 1; i += 2) {
        // This line of code takes the first character of the file string and converts it to its Unicode value using the charCodeAt method.
        // Then it adds i to that value and converts it back to a character using the fromCharCode method.
        currentFile = String.fromCharCode(file.charCodeAt(0) + i);
        if (currentFile >= "a" && currentFile <= "h") {
            currentSquareId = currentFile + currentRank;
            currentSquare = document.getElementById(currentSquareId);
            squareContent = isSquareOccupied(currentSquare);

            if (squareContent != "blank" && squareContent != pieceColor) { // If a square is occupied by a piece of the opposite color, the pawn can move to that square and capture the piece
                legalSquares.push(currentSquareId); // The ID of the legal square should be added to the legalSquares array
            }
        }
    }
}

/* The checkPawnForwardMoves() Function first checks the square directly in front of the pawn. If it is not a legal move, there are no other legal moves for the pawn
   If it is a legal move, the square is added to the legalSquare array
   
   Then, if the pawn is on the 2nd or 7th rank, the function checks the second square in front of the pawn */
function checkPawnForwardMoves(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);
    const direction = pieceColor == "white" ? 1:-1;
    currentRank += direction;
    currentSquareId = currentFile + currentRank;
    currentSquare = document.getElementById(currentSquareId);
    squareContent = isSquareOccupied(currentSquare);

    if (squareContent != "blank")  // If a square is occupied by a piece of the opposite color, the pawn can move to that square and capture the piece
        return;
    legalSquares.push(currentSquareId);
    if (rankNumber != 2 && rankNumber != 7)
        return;
    currentRank += direction;
    currentSquareId = currentFile + currentRank;
    currentSquare = document.getElementById(currentSquareId);
    squareContent = isSquareOccupied(currentSquare);

    if (squareContent != "blank")  // If a square is occupied by a piece of the opposite color, the pawn can move to that square and capture the piece
        return;
    legalSquares.push(currentSquareId);
}

function getKnightMoves(startingSquareId, pieceColor) {
    const file = startingSquareId.charCodeAt(0) - 97;
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;

    // The move array lists the possible squares a knight can move to. The function then checks if any of these squares contain a piece of the same color. 
    // If not the square is considered a legal move for the knight
    const moves = [ 
        [-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]
    ];
    moves.forEach((move) => {
        currentFile = file + move[0];
        currentRank = rankNumber + move[1];
        if (currentFile >= 0 && currentFile <= 7 && currentRank > 0 && currentRank <= 8)
        {
            let currentSquareId = String.fromCharCode(currentFile + 97) + currentRank;
            let currentSquare = document.getElementById(currentSquareId);
            let squareContent = isSquareOccupied(currentSquare);

            if (squareContent != "blank" && squareContent == pieceColor)
                return;
            legalSquares.push(String.fromCharCode(currentFile + 97) + currentRank);
        }
    });
}

/* The getRookMoves() fucntion begins at the rook's starting square and moves in four directions (up, down, left, right) to check for legal squares */
function getRookMoves(startingSquareId, pieceColor) {
    moveToEighthRank(startingSquareId, pieceColor);
    moveToFirstRank(startingSquareId, pieceColor);
    moveToAFile(startingSquareId, pieceColor);
    moveToHFile(startingSquareId, pieceColor);
}

/* The getBishopMoves() function works very similarly to the getRookMoves() function except the movement is done diagonally instead of horizontally or vertically */
function getBishopMoves(startingSquareId, pieceColor) {
    moveToEighthRankHFile(startingSquareId, pieceColor); // Forward and to the right (White)
    moveToEighthRankAFile(startingSquareId, pieceColor); // Forward and to the left (White)
    moveToFirstRankHFile(startingSquareId, pieceColor); // Forward and to the right (Black)
    moveToFirstRankAFile(startingSquareId, pieceColor); // Forward and to the left (Black)
}

/* The getQueenMoves() function is a combination of the legal squares for a rook and a bishop */
function getQueenMoves(startingSquareId, pieceColor) {
    moveToEighthRankHFile(startingSquareId, pieceColor); // Forward and to the right (White)
    moveToEighthRankAFile(startingSquareId, pieceColor); // Forward and to the left (White)
    moveToFirstRankHFile(startingSquareId, pieceColor); // Forward and to the right (Black)
    moveToFirstRankAFile(startingSquareId, pieceColor); // Forward and to the left (Black)
    moveToEighthRank(startingSquareId, pieceColor);
    moveToFirstRank(startingSquareId, pieceColor);
    moveToAFile(startingSquareId, pieceColor);
    moveToHFile(startingSquareId, pieceColor);
}

/* The getKingMoves() function is similar to getKnightMoves() with the only difference being the moves array for the king */
function getKingMoves(startingSquareId, pieceColor) {
    const file = startingSquareId.charCodeAt(0) - 97;
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;

    // The move array lists the possible squares a knight can move to. The function then checks if any of these squares contain a piece of the same color. 
    // If not the square is considered a legal move for the knight
    const moves = [ 
        [0, 1], [0, -1], [1, 1], [1, -1], [-1, 0], [-1, -1], [-1, 1], [1, 0]
    ];
    moves.forEach((move) => {
        currentFile = file + move[0];
        currentRank = rankNumber + move[1];
        if (currentFile >= 0 && currentFile <= 7 && currentRank > 0 && currentRank <= 8)
        {
            let currentSquareId = String.fromCharCode(currentFile + 97) + currentRank;
            let currentSquare = document.getElementById(currentSquareId);
            let squareContent = isSquareOccupied(currentSquare);

            if (squareContent != "blank" && squareContent == pieceColor)
                return;
            legalSquares.push(String.fromCharCode(currentFile + 97) + currentRank);
        }
    });
}

/* The moveToEighthRank() fucntion moves from the starting square to the eighth rank, one square at a time. It checks if each square is empty or occupied by a piece of the opposite color.
   
   If either condition is met, the square is added to the legal squares list
   
   If a square is occupied or the place reaches the eighth rank, the movement stops */
function moveToEighthRank(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentRank = rankNumber;

    while (currentRank != 8) {
        currentRank++;
        let currentSquareId = file + currentRank;
        let currentSquare = document.getElementById(currentSquareId);
        let squareContent = isSquareOccupied(currentSquare);

        if (squareContent != "blank" && squareContent == pieceColor)
            return;
        legalSquares.push(currentSquareId);
        if (squareContent != "blank" && squareContent != pieceColor)
            return;
    }
    return;
}

/* A similar method is used to check for legal moves in the other three directions (left, right, and down) */
function moveToFirstRank(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentRank = rankNumber;

    while (currentRank != 1) {
        currentRank--;
        let currentSquareId = file + currentRank;
        let currentSquare = document.getElementById(currentSquareId);
        let squareContent = isSquareOccupied(currentSquare);

        if (squareContent != "blank" && squareContent == pieceColor)
            return;
        legalSquares.push(currentSquareId);
        if (squareContent != "blank" && squareContent != pieceColor)
            return;
    }
    return;
}

function moveToAFile(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    let currentFile = file;

    while (currentFile != "a") {
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.length - 1) - 1);
        let currentSquareId = currentFile + rank;
        let currentSquare = document.getElementById(currentSquareId);
        let squareContent = isSquareOccupied(currentSquare);

        if (squareContent != "blank" && squareContent == pieceColor)
            return;
        legalSquares.push(currentSquareId);
        if (squareContent != "blank" && squareContent != pieceColor)
            return;
    }
    return;
}

function moveToHFile(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    let currentFile = file;

    while (currentFile != "h") {
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.length - 1) + 1);
        let currentSquareId = currentFile + rank;
        let currentSquare = document.getElementById(currentSquareId);
        let squareContent = isSquareOccupied(currentSquare);

        if (squareContent != "blank" && squareContent == pieceColor)
            return;
        legalSquares.push(currentSquareId);
        if (squareContent != "blank" && squareContent != pieceColor)
            return;
    }
    return;
}

function moveToEighthRankAFile(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    
    // The search for legal squares stops when the piece reaches the edge of the board, eother the eighth rank or the "a" file
    while (!(currentFile == "a" || currentRank == 8)) {
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.lenght - 1) - 1);
        currentRank++;
        let currentSquareId = currentFile + currentRank;
        let currentSquare = document.getElementById(currentSquareId);
        let squareContent = isSquareOccupied(currentSquare);

        // If a square is empty or occupied by a piece of the opposite color, it is added to the legal square list
        // If the square is occupied by a piece of the same color, the search for legal squares stops
        if (squareContent != "blank" && squareContent == pieceColor)
            return;
        legalSquares.push(currentSquareId);
        if (squareContent != "blank" && squareContent != pieceColor)
            return;
    }
}

function moveToEighthRankHFile(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    
    // The search for legal squares stops when the piece reaches the edge of the board, eother the eighth rank or the "a" file
    while (!(currentFile == "h" || currentRank == 8)) {
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.lenght - 1) + 1);
        currentRank++;
        let currentSquareId = currentFile + currentRank;
        let currentSquare = document.getElementById(currentSquareId);
        let squareContent = isSquareOccupied(currentSquare);

        // If a square is empty or occupied by a piece of the opposite color, it is added to the legal square list
        // If the square is occupied by a piece of the same color, the search for legal squares stops
        if (squareContent != "blank" && squareContent == pieceColor)
            return;
        legalSquares.push(currentSquareId);
        if (squareContent != "blank" && squareContent != pieceColor)
            return;
    }
}

function moveToFirstRankAFile(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    
    // The search for legal squares stops when the piece reaches the edge of the board, eother the eighth rank or the "a" file
    while (!(currentFile == "a" || currentRank == 1)) {
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.lenght - 1) - 1);
        currentRank--;
        let currentSquareId = currentFile + currentRank;
        let currentSquare = document.getElementById(currentSquareId);
        let squareContent = isSquareOccupied(currentSquare);

        // If a square is empty or occupied by a piece of the opposite color, it is added to the legal square list
        // If the square is occupied by a piece of the same color, the search for legal squares stops
        if (squareContent != "blank" && squareContent == pieceColor)
            return;
        legalSquares.push(currentSquareId);
        if (squareContent != "blank" && squareContent != pieceColor)
            return;
    }
}

function moveToFirstRankHFile(startingSquareId, pieceColor) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    
    // The search for legal squares stops when the piece reaches the edge of the board, eother the eighth rank or the "a" file
    while (!(currentFile == "h" || currentRank == 1)) {
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.lenght - 1) + 1);
        currentRank--;
        let currentSquareId = currentFile + currentRank;
        let currentSquare = document.getElementById(currentSquareId);
        let squareContent = isSquareOccupied(currentSquare);

        // If a square is empty or occupied by a piece of the opposite color, it is added to the legal square list
        // If the square is occupied by a piece of the same color, the search for legal squares stops
        if (squareContent != "blank" && squareContent == pieceColor)
            return;
        legalSquares.push(currentSquareId);
        if (squareContent != "blank" && squareContent != pieceColor)
            return;
    }
}