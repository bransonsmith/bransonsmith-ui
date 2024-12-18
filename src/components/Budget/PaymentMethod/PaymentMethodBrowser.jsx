import { useEffect, useState } from 'react';
import { makeRequestToApi } from '../../../Services/ApiService';
import Loading from '../../Loading';
import PaymentMethodEntry from './PaymentMethodEntry';
import PaymentMethodAdder from './PaymentMethodAdder';

export default function PaymentMethodBrowser(props) {

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
                <div className="mt-8">
                    { showAddForm ? <PaymentMethodAdder RefreshEntities={RefreshEntities} Hide={HideAdder}/> : <button onClick={() => setShowAddForm(true)}>Add PaymentMethod</button> }
                </div>
                { props.paymentMethods &&
                    <div className="w-full">
                        <h2>Payment Methods</h2>
                        <ul>
                            { props.paymentMethods.map((PaymentMethod, index) => {
                                return (
                                    <li key={index} className="p-4 border-2 border-white w-full">
                                        <PaymentMethodEntry PaymentMethod={PaymentMethod} RefreshEntities={RefreshEntities}/>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                }
                <button onClick={() => setShow(false)} className="my-12"> Hide PaymentMethods </button>
            </div>
        }
        { !show && <button onClick={() => setShow(true)} className="my-12"> Show PaymentMethods </button> }

        </>
    )
}
