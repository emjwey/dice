export default function Dice(props){
    return (
        <div className={`dice ${props.isHeld ? 'isHeld' : ''}`} onClick={props.freeze}>
            {props.value}
        </div>
    )
}