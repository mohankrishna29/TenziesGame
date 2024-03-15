import { useEffect, useState } from 'react'
import Die from './die.jsx'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti' 

function App() {
  const [tenzies, setTenzies] = useState(false)
  const [dieVal, setDieVal] = useState(getStoredDieVal() || allNewDice());
  const [move, setMove] = useState(getStoredMove() || 0);
  const [highScore, setHighScore] = useState(getStoredHighScore() || 100);

  function getStoredDieVal() {
    const storedDieVal = localStorage.getItem('dieVal');
    return storedDieVal ? JSON.parse(storedDieVal) : null;
  }
  function getStoredMove() {
    const storedMove = localStorage.getItem('move');
    return storedMove ? parseInt(storedMove) : 0;
  }
  function getStoredHighScore() {
    const storedHighScore = localStorage.getItem('highScore');
    return storedHighScore ? parseInt(storedHighScore) : 0;
  }

  function allNewDice(){
    let arr = []
    for(let i=0; i<10; i++){
        let dieObj ={}
        dieObj.value = Math.ceil(Math.random()*6)
        dieObj.isHeld = false
        dieObj.key = nanoid() 
        arr.push(dieObj)
    }
    return arr
  }

  function holdDice(id){
    setDieVal((old) => {
      let n = old.map((oldObj) => {
        return id === oldObj.key ? {...oldObj, isHeld : !oldObj.isHeld} : oldObj
        }
      )
      return n
    })
  }

  const contents = dieVal.map((v) => {
    return <Die key={v.key} held={v.isHeld} value={v.value} listen={()=> holdDice(v.key)} />
  })

  function roll(){
    if (!tenzies){
      setMove((old) => old+=1)
      setDieVal((old) => {
        let n = old.map((oldObj) => {
          if (oldObj.isHeld === false){
            oldObj.value = Math.ceil(Math.random()*6)
            return oldObj
          }
          else{
            return oldObj
          }
        })
        return n
      })
    }
    else{
      if (move<highScore){
        setHighScore(move)
      }
      setTenzies(() => false)
      setDieVal(allNewDice())
      setMove(0)
    }
  }

  useEffect(() => {
    let checker = dieVal[0]['value']
    let count = 0
    for(let i=0; i<dieVal.length; i++){
      if (dieVal[i]['value'] === checker && dieVal[i]['isHeld'] === true){
        count+=1
      }
      if (count === 10){
        setTenzies(() => {
          return true
        })
        console.log('You Won')
      }
    }
  }, [dieVal])

  function updateStoredDieVal(updatedDieVal) {
    localStorage.setItem('dieVal', JSON.stringify(updatedDieVal));
  }
  function updateStoredMove(updatedMove) {
    localStorage.setItem('move', updatedMove.toString());
  }
  function updateStoredHighScore(updatedHighScore) {
    localStorage.setItem('highScore', updatedHighScore.toString());
  }
  useEffect(() => {
    updateStoredDieVal(dieVal);
    updateStoredMove(move);
    updateStoredHighScore(highScore);
  }, [dieVal, move, highScore]);

  return (
    <main>
      {tenzies && <Confetti  />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='buttons'>
        {contents}
      </div>
      <button onClick={roll} className='roll'>{tenzies ? "New Game" : "Roll"}</button>
      <p className='move'>Your Moves : {move}</p>
      <p className='hMove'>Best of all : {highScore}</p>
    </main>
  )
}

export default App
