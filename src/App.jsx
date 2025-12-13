import { useState } from 'react'
import './App.css'



function App() {

const [ puzzle, setPuzzle ] = useState(null)
const [ cell, setCell ] = useState([])

const [isDragging, setIsDragging] = useState(false);
const word = selectedWord();


function selectedWord (){
  if (cell.length === 0 || !puzzle ) return '';
  else{
    let wordSelect = cell.map( ([row, col])  => {
      return puzzle.grid[row][col];
    }).join('');
  return wordSelect ;
  }
}

const handleSelectedCell = (rowIndex, colIndex) => {
  // Start a new selection path with the first clicked cell
  setCell([[rowIndex, colIndex]]);
  // console.log(`${puzzle.grid[rowIndex][colIndex]}`);
}

const handleEnterCell = (rowIndex, colIndex) => {
  if (isDragging) {
    // placeholder for drag logic
    console.log("enter", rowIndex, colIndex);
  }
};

function generatePuzzle() {
  // Placeholder function to generate a new puzzle
console.log('Generating new puzzle...');

fetch('https://shadify.yurace.pro/api/wordsearch/generator', {
})
  .then((response) => response.json())
  .then((data) => {
    // console.log('Puzzle generated:', data);
    setPuzzle(data);
    setCell([]);

  })
  .catch((error) => {
    console.error('Error generating puzzle:', error);
  });

}
  return (
    <>
      <div className="button">
        <button onClick={generatePuzzle}>
          Generate New Puzzle
        </button>
      </div>

      {puzzle ? (
        <div className="puzzle" onMouseUp={() => setIsDragging(false)} >
        {
        puzzle.grid.map((row, rowIndex) =>  (
          <div className="puzzle-row" key={rowIndex}>
            {row.map((letter, colIndex) => (
              <span
                className="puzzle-cell"
                key={colIndex}
                onMouseDown={() => handleSelectedCell(rowIndex, colIndex)}
                onMouseEnter={() => handleEnterCell(rowIndex, colIndex)}

              >
                {letter}
              </span>
            ))}
          </div>
        ))
        }
          <div className='displayBlock'>
            <input type="text" value={word}  readOnly />
          </div>
        </div>


      ) : false }

      <p> Go Hard!!</p>

    </>
  )
}

export default App
