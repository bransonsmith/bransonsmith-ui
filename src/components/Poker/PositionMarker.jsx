export default function PositionMarker({ position, isSelected, onClick }) {
    return (
        <div
            className={
                `bg-slate-800 text-slate-300 font-bold border-2 text-xs rounded-full px-2 py-1 cursor-pointer transition-opacity duration-300 
                ${isSelected ? 'opacity-100 border-blue-700' : 'opacity-50 border-slate-800'}`}
            onClick={onClick}
        >
            {position}
        </div>
    );
}