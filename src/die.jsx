function Die(props){
    return(
        <div>
            <button className="dies" style={{backgroundColor : props.held ? "#59E391" : "white"}} onClick={props.listen}>{props.value}</button>
        </div>
    )
}

export default Die