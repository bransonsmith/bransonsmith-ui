
import logo from '../../assets/BS_Dev_logo.png';

export default function PokerCard( { suit, value }) {

    function getSuitSymbol() {
        if (suit === 'h') return '♥';
        if (suit === 'd') return '♦';
        if (suit === 's') return '♠';
        if (suit === 'c') return '♣';
        return 'x'
    }

    function getValueText() {    
        if (value == '1') return 'A';
        if (value == '13') return 'K';
        if (value == '12') return 'Q';
        if (value == '11') return 'J';
        if (value == '10') return 'T';
        return value;
    }
    

    if (suit === 'h' || suit === 'd') {

        return <div className="flex flex-row rounded-md bg-pokerCard  text-2xl font-bold w-12 h-16 text-pokerRed border-2 border-pokerBlack" >
            <div className="ml-auto my-auto">{getValueText()}</div>
            <div className="mr-auto my-auto">{getSuitSymbol()}</div>
        </div>
    }
    if (suit === 'c' || suit === 's') {
        return <div className="flex flex-row rounded-md bg-pokerCard  w-12  h-16 font-bold text-2xl text-pokerBlack border-2 border-pokerBlack" >
            <div className="ml-auto my-auto">{getValueText()}</div>
            <div className="mr-auto my-auto">{getSuitSymbol()}</div>
        </div>
    }
    return <div className="flex flex-row rounded-md bg-pokerBack w-12  h-16 font-bold text-6xl text-pokerBlack border-2 border-pokerBlack" >
        <img src={logo} alt="Card Back" className="m-auto object-cover h-8 w-8 rounded-full" />
    </div>

}
