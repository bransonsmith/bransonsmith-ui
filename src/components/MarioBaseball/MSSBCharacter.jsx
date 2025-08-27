
export default function MSSBCharacter(props) {
    
    function getBgColor(i) {
        if (i % 2 === 0) {
            return "bg-neutral-900";
        } else {
            return "bg-neutral-950";
        }
    }

    function shortenName(name) {
        
        let shortenedName = name
        
        shortenedName = shortenedName.replace("Light Blue", "LB.");   shortenedName = shortenedName.replace("light blue", "LB.");
        shortenedName = shortenedName.replace("Green", "G.");         shortenedName = shortenedName.replace("green", "G.");
        shortenedName = shortenedName.replace("Gray", "G.");         shortenedName = shortenedName.replace("gray", "G.");
        shortenedName = shortenedName.replace("Red", "R.");           shortenedName = shortenedName.replace("red", "R.");
        shortenedName = shortenedName.replace("Blue", "B.");          shortenedName = shortenedName.replace("blue", "B.");
        shortenedName = shortenedName.replace("Yellow", "Y.");        shortenedName = shortenedName.replace("yellow", "Y.");
        shortenedName = shortenedName.replace("Black", "B.");         shortenedName = shortenedName.replace("black", "B.");
        shortenedName = shortenedName.replace("White", "W.");         shortenedName = shortenedName.replace("white", "W.");
        shortenedName = shortenedName.replace("Pink", "P.");          shortenedName = shortenedName.replace("pink", "P.");
        shortenedName = shortenedName.replace("Orange", "O.");        shortenedName = shortenedName.replace("orange", "O.");
        shortenedName = shortenedName.replace("Purple", "P.");        shortenedName = shortenedName.replace("purple", "P.");
        shortenedName = shortenedName.replace("Brown", "B.");        shortenedName = shortenedName.replace("brown", "B.");
        shortenedName = shortenedName.replace("Dark", "D.");        shortenedName = shortenedName.replace("dark", "D.");
        shortenedName = shortenedName.replace("Koopa Paratroopa", "Paratroopa");        shortenedName = shortenedName.replace("koopa paratroopa", "Paratroopa");

        return shortenedName;
    }

    return <div className={`flex flex-row gap-x-2 mx-auto w-fit px-3 py-1 rounded-sm ` + getBgColor(props.i)} style={{fontSize: "12px"}}>
        <img className="h-fit my-auto text-center w-6 h-6 border border-gray-400 rounded-full" src={`/Mssb/mugshot/${props.character.Name}.png`} alt={props.character.Name} />
        <div className="h-fit my-auto text-center w-32">{shortenName(props.character.Name)}</div>
        <div className="h-fit my-auto text-center w-6">{props.character.Bat}</div>
        <div className="h-fit my-auto text-center w-6">{props.character.Run}</div>
        <div className="h-fit my-auto text-center w-6">{props.character.Pitch}</div>
        <div className="h-fit my-auto text-center w-6">{props.character.Field}</div>
        <div className="h-fit my-auto text-center w-10">{props.character.Lean}</div>
        <div className="h-fit my-auto text-center w-6">{props.character.Zone}</div>
        <div className="h-fit my-auto text-center w-10">{props.character.Agility}</div>
        <div className="h-fit my-auto text-center w-10">{props.character.Coverage}</div>
        <div className="h-fit my-auto text-center w-10">{props.character.ReachOut}</div>
        <div className="h-fit my-auto text-center w-10">{props.character.ReachIn}</div>
        <div className="h-fit my-auto text-center w-6">{props.character.Dive}</div>
        <div className="h-fit my-auto text-center w-6">{props.character.Size}</div>
        <div className="h-fit my-auto text-center w-6">{props.character.Arm}</div>
        <div className="h-fit my-auto text-center w-6">{props.character.Jump}</div>
        <div className="h-fit my-auto text-center w-10">{props.character.Chemistry}</div>
        <div className="h-fit my-auto text-center w-10">{props.character.Stamina}</div>
        <div className="h-fit my-auto text-center w-10">{props.character.Curve}</div>
        <div className="h-fit my-auto text-center w-10">{props.character.Velocity}</div>
        <div className="h-fit my-auto text-center w-10">{props.character.ChargVelocity}</div>
        <div className="h-fit my-auto text-center w-10">{props.character.ChangeUp}</div>

    </div>

}
