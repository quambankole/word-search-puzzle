import { useState } from 'react'
import './App.css'



function App() {
const [puzzle, setPuzzle] = useState(null)

function generatePuzzle() {
  // Placeholder function to generate a new puzzle
console.log('Generating new puzzle...');

fetch('https://shadify.yurace.pro/api/wordsearch/generator', {
})
  .then((response) => response.json())
  .then((data) => {
    console.log('Puzzle generated:', data);
    setPuzzle(data);

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
        <div className="puzzle">
        {
        puzzle.grid.map((row, rowIndex) =>  (
          <div className="puzzle-row" key={rowIndex}>
            {row.map((letter, colIndex) => (
              <span className="puzzle-cell" key={colIndex} >{letter}</span>
            ))}
          </div>
        ))
        }
        </div>
      ) : false }

      <p> Go Hard!!</p>
    </>
  )
}

export default App
