


export default function EntitySelector(props) {

    const [type, setType] = useState(props.type);
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntity, setSelectedEntity] = useState(null);

    return (
        <div>
            <label> Select {props.type} </label>
            <select onChange={(event) => props.onSelection(event.target.value)} value={selectedEntity}>
                <option value=''>Select {props.type}</option>
                {entities.map((entity) => {
                    return <option key={entity.id} value={entity.id}>{entity.name}</option>
                })}
            </select>
        </div>
    )
}