let legalSquares = [];
const boardSquares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");
const piecesImages = document.getElementsByTagName("img");

/* The setupBoardSquares() funcion sets up the event listeners and IDs for the squares on the chess board

   This function also calculates the row and column of each square and assigns an ID to the square in the
   format column + row, where column is a letter from 'a' to 'h' and row is a number from 1 to 8 */
setupBoardSquares();
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