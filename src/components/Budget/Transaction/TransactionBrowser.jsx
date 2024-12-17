import { useEffect, useState } from 'react';
import { makeRequestToApi } from '../../../Services/ApiService';
import Loading from '../../Loading';
import TransactionEntry from './TransactionEntry';
import TransactionAdder from './TransactionAdder';

export default function TransactionBrowser(props) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const RefreshEntities = async () => {
        setLoading(true);
        await props.RefreshEntities();
        setLoading(false);
    }

    const HideAdder = () => {
        setShowAddForm(false);
    }

    return (
        <>
        { show && 
            <div className='p-10 shadow-md shadow-black w-full'>
                { loading && <Loading /> }
                { error && <div className="text-error-800">Error: {error}</div> }
                { props.transactions &&
                    <div className="w-full">
                        <h2>Transactions</h2>
                        <button onClick={RefreshEntities}>Refresh Data</button>
                        <ul>
                            { props.transactions.map((Transaction, index) => {
                                return (
                                    <li key={index} className="p-4 border-2 border-white w-full">
                                        <TransactionEntry Transaction={Transaction} RefreshEntities={RefreshEntities} categories={props.categories} places={props.places}/>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="mt-8">
                            { showAddForm ? <TransactionAdder RefreshEntities={RefreshEntities} Hide={HideAdder}/> : <button onClick={() => setShowAddForm(true)}>Add Transaction</button> }
                        </div>
                    </div>
                }
                <button onClick={() => setShow(false)} className="my-12"> Hide Transactions </button>
            </div>
        }
        { !show && <button onClick={() => setShow(true)} className="my-12"> Show Transactions </button> }

        </>
    )
}
