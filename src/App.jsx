import { useState, useRef, useEffect } from 'react'
import './App.css'



function App() {

const [ puzzle, setPuzzle ] = useState(null)
const [ cell, setCell ] = useState([])
const [ isDragging, setIsDragging ] = useState (false);

// Track the first cell of a drag + the fixed direction (dr, dc) once the user moves
const startCellRef = useRef(null); // [row, col]
const dirRef = useRef(null);       // [dr, dc] each is -1, 0, or 1

const draggingRef = useRef(false);
const word = selectedWord();

// End dragging (used by puzzle and by global window listeners)
const stopDragging = () => {
  draggingRef.current = false;
  setIsDragging(false);
  startCellRef.current = null;
  dirRef.current = null;
};

// Safety: if the user releases the mouse outside the puzzle, still stop dragging
useEffect(() => {
  const handleWindowMouseUp = () => stopDragging();
  const handleWindowBlur = () => stopDragging();

  window.addEventListener('mouseup', handleWindowMouseUp);
  window.addEventListener('blur', handleWindowBlur);

  return () => {
    window.removeEventListener('mouseup', handleWindowMouseUp);
    window.removeEventListener('blur', handleWindowBlur);
  };
}, []);

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

  startCellRef.current = [rowIndex, colIndex];
  dirRef.current = null; // direction not chosen yet

  draggingRef.current = true;
  setIsDragging(true);
  console.log("initiate dragging");
};

const handleEnterCell = (rowIndex, colIndex) => {
  if (!draggingRef.current) return;

  setCell((prevCells) => {
    const alreadySelected = prevCells.some(([r, c]) => r === rowIndex && c === colIndex);
    if (alreadySelected) return prevCells;

    const start = startCellRef.current;
    if (!start) return prevCells;

    const [sr, sc] = start;
    const drRaw = rowIndex - sr;
    const dcRaw = colIndex - sc;

    // If user is still on the start cell (no movement), do nothing
    if (drRaw === 0 && dcRaw === 0) return prevCells;

    // Normalize direction to -1/0/1
    const stepDr = drRaw === 0 ? 0 : drRaw / Math.abs(drRaw);
    const stepDc = dcRaw === 0 ? 0 : dcRaw / Math.abs(dcRaw);

    // Only allow straight lines: horizontal, vertical, or perfect diagonal
    const isHorizontal = stepDr === 0 && stepDc !== 0;
    const isVertical = stepDr !== 0 && stepDc === 0;
    const isDiagonal = stepDr !== 0 && stepDc !== 0 && Math.abs(drRaw) === Math.abs(dcRaw);
    if (!isHorizontal && !isVertical && !isDiagonal) return prevCells;

    // Lock direction on the first move
    if (!dirRef.current) {
      dirRef.current = [stepDr, stepDc];
    }

    const [lockedDr, lockedDc] = dirRef.current;

    // If user moves in a different direction, ignore
    if (stepDr !== lockedDr || stepDc !== lockedDc) return prevCells;

    // Enforce contiguous steps (no skipping): next cell must be exactly one step from last cell
    const [lastR, lastC] = prevCells[prevCells.length - 1];
    if (rowIndex !== lastR + lockedDr || colIndex !== lastC + lockedDc) return prevCells;

    return [...prevCells, [rowIndex, colIndex]];
  });

  console.log(`Added cell: ${rowIndex}, ${colIndex}`);
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
        <div className="puzzle" onMouseUp={stopDragging} onMouseLeave={stopDragging} onMouseDown={(e) => e.preventDefault()}>
        {
        puzzle.grid.map((row, rowIndex) =>  (
          <div className="puzzle-row" key={rowIndex}>
            {row.map((letter, colIndex) => (
              <span
                className="puzzle-cell no-select"
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
