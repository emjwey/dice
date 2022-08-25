import React,{useEffect,useState,useRef} from "react"
import Dice from "./components/Dice"
import {nanoid} from "nanoid"
import Confetti  from "react-confetti"
import {useStopwatch, useTimer} from "react-timer-hook"

export default function App(){

	const [dice,setDice] = useState(allNewDice())
	const [status, setStatus] = useState(false)
	const [bestScore, setBestScore] = useState(()=>JSON.parse(localStorage.getItem('tenzies')) || [])
	const [score, setScore] = useState({roll:0, time:"0:0", id:nanoid(), start:false})
	const {
		seconds, 
		minutes, 
		pause,
		start,  
		reset
	} = useStopwatch({})
	let timer = `${minutes}:${seconds}`
 

	useEffect( ()=>{
		let arg = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)
		if(arg){
			console.log("you won")
			pause()
			setScore(s => ({...s, start: false}))
		}  

		setStatus(arg ? true:false)
		//setScore(s => ({...s, start: arg ? false : true}))
		
	}, dice)

	useEffect( ()=>{
		localStorage.setItem('tenzies',JSON.stringify(bestScore))
	},dice)

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
			setScore(s => ({...s, roll: s.roll+1}))
			gameStart()
		}else{
			setStatus(false)
			setDice(allNewDice())
			 
			//reset game timer
			reset(0, false)
			setScore(s => ({...s, roll:0, time:timer}))
		}
	 
	}
 
	const gameStart = () =>{
		setScore(prevScore => ({
				...prevScore,
				start: !status? true :false ,
				time: score.start ? timer : prevScore.time
			}))
		!score.start && start()
		console.log(score)
	}

	const isHeld = (id)=>{
		setDice(dice.map(die => die.id === id ? {...die,isHeld:!die.isHeld} : {...die}))
		gameStart()
	}
	
	
	return (
		<main>
			<div className="info">
				<div style={{position:"fixed", left:"20px", padding:"20px",textAlign:"left"}}>
					status: {status ? "true" :"false"} <br/> 
					score: {score.roll} <br/> Start: {score.start ? "true" : "false"}  <br/> 
					game Time: {score.time} <br/>
					time: {timer}</div>
				<div>
					 
					<p>Prevous Score: Roll: 0 || Time: 00:00</p>
					Roll Counter: {score.roll} || Time: {timer	}
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

