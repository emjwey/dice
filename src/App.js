import React,{useEffect,useState} from "react"
import Dice from "./components/Dice"
import {nanoid} from "nanoid"
import Confetti  from "react-confetti"

export default function App(){

	const [dice,setDice] = useState(allNewDice())
	const [status, setStatus] = useState(false)
	const [bestScore, setBestScore] = useState(()=>JSON.parse(localStorage.getItem('tenzies')) || [])

	useEffect( ()=>{
		if(dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)){
			setStatus(true)
			console.log("you won")
		}
	}, dice)

	useEffect( ()=>{
		localStorage.setItem('tenzies',JSON.stringify(bestScore))
	})

	function allNewDice(){
		const newDice = []
		for(let i=0; i<10; i++){
			newDice.push(generateDice())
		}
		return newDice  
	}

	function generateDice(){
		return {
			id:nanoid(), 
			value: Math.ceil(Math.random() * 6),
			isHeld:false
		}
	}
	 
	const allDiceItem = dice.map(dice => {
		return (
			<Dice 
				key={dice.id}
				value={dice.value}
				freeze={()=> isHeld(dice.id)}
				isHeld={dice.isHeld}/>
		)
	})

	const rollDice = ()=>{
		if(!status){
			setDice(dice.map(die => {
				return die.isHeld	
					? {...die}
					: generateDice()
			}))
			bestScore.roll = ""
			// setBestScore(()=>{
				
				 
			// })
			 

			console.log(bestScore.roll)
		}else{
			setStatus(false)
			setDice(allNewDice())
		}
		
	}

	const isHeld = (id)=>{
		setDice(dice.map(die => die.id === id ? {...die,isHeld:!die.isHeld} : {...die}))
	}
 
	return (
		<main>
			<div className="info">
				<div>
					Roll Counter: {bestScore.roll ? '': 0}
				</div>
			</div>
			<h1>Tenzies Game</h1>
			<p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
			<div className="dice-list">
				{allDiceItem}
			</div>
			<button 
				className="button"
				onClick={rollDice}>{status ? "Reset" : "Roll"}</button>
			{status && <Confetti/>}
		</main>
	)
}   