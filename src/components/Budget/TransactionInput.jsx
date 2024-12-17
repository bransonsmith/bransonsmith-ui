import { useState } from 'react';
import { makeRequestToApi } from '../../Services/ApiService';
import TransactionImportEntry from './TransactionImportEntry';

export default function TransactionInput(props) {
    const [file, setFile] = useState(null);
    const [fileContents, setFileContents] = useState(null);
    const [lines, setLines] = useState([]);
    const [incomingTransactions, setIncomingTransactions] = useState([]);
    const [processedTransactions, setProcessedTransactions] = useState([]);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [places, setPlaces] = useState([]);
    const [tags, setTags] = useState([]);
    const [importResponse, setImportResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(true);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                setFileContents(text);
                const splitLines = text.split(/\r?\n/);
                setLines(splitLines);
                setProcessedTransactions(splitLines.map((line, index) => {
                    const splitLine = line.split(',');
                    const obj = {
                        transactionDate: splitLine[0].replace(/^\"+/, '').replace(/\"+$/, ''),
                        amount: splitLine[1].replace(/^\"+/, '').replace(/\"+$/, ''),
                        star: splitLine[2].replace(/^\"+/, '').replace(/\"+$/, ''),
                        blank: splitLine[3].replace(/^\"+/, '').replace(/\"+$/, ''),
                        description: splitLine[4].replace(/^\"+/, '').replace(/\"+$/, ''),
                        tagIds: [],
                        status: 'unprocessed'
                    }
                    if (index === 0) {
                        setCurrentTransaction(obj);
                    }
                    return obj
                }))
            };
            reader.readAsText(file); 
        }
    };

    const nextTransaction = () => {
        const currentIndex = incomingTransactions.indexOf(currentTransaction);
        if (currentIndex < incomingTransactions.length - 1) {
            setCurrentTransaction(incomingTransactions[currentIndex + 1]);
        } else {
            setCurrentTransaction(incomingTransactions[0]);
        }
    }

    const attemptToImportTransaction = async (transaction) => {
        try {
            transaction.amount = parseFloat(transaction.amount);
            console.log('Attempting to import transaction: ', transaction);
            const response = await makeRequestToApi('api/Transaction/import', 'POST', transaction);
            if (response.status === 200) {
                setImportResponse('Transaction imported.');
                console.log('Transaction imported: ', response);
            }
            else if (response.status === 400) {

                var instructionString = '';
                var instructions = response.data.instructions;
                if (instructions) {
                    for (var key in instructions) {
                        instructionString += instructions[key] + '\n\t';
                    }
                }

                var errorString = '';
                var errors = response.data.errors;
                if (errors) {
                    for (var key in errors) {
                        errorString += key + ': ' + errors[key] + ' ';
                    }
                }

                let outputString = 'Transaction not imported: ' + instructionString + ' ' + errorString;

                setImportResponse(outputString);
                console.error('Transaction not imported: ', response);
                setError(outputString);
                return
            }
            else {
                console.error('Error importing transaction: ', response);
                setImportResponse('Transaction imported: ' + response.data.detail);
                setError('Error importing transaction: ' + response.data.detail);
                return;
            }
        } catch (error) {
            console.error('Exception importing transaction: ', error);
            setError(error);
            return;
        }
    }

    return (
        <div className="w-full flex flex-col mb-12">
            <div className="w-full flex flex-row">
                <div className="m-auto">
                    <h1 className="mx-4">Upload Transaction File</h1>
                    <input className="mx-4" type="file" onChange={handleFile} />
                </div>
            </div>

            <div className="w-full flex flex-row my-2">
                { currentTransaction &&
                    <TransactionImportDetails transaction={currentTransaction} />
                }
            </div>

            <div className="w-full cursor-pointer bg-popUpBg border-t-2 border-gray-800 min-h-[300px] max-h-96 overflow-y-scroll overflow-x-hidden rounded-lg">
            {processedTransactions &&
                processedTransactions.map((transaction, index) => {
                    return (
                        <div key={index} className="w-full">
                            <span onClick={() => { setCurrentTransaction(transaction) }}>
                                <TransactionImportEntry transaction={transaction}/>
                            </span>
                        </div>
                    )
                })
            }
            </div>

        </div>
    )

}

export function TransactionImportDetails(props) {
    

    return (
        <div className="w-full flex flex-col bg-popUpBg p-6 border-2 border-gray-800 rounded-lg shadow-md shadow-gray-900">
            <div className="w-full my-4">
                <div className="w-full">
                    {props.transaction.date} {props.transaction.amount} {props.transaction.star} {props.transaction.blank} {props.transaction.description}
                </div>
                <div className="w-full my-4">
                    <button 
                    // onClick={() => attemptToImportTransaction(currentTransaction)}
                    >Import</button>
                </div>
                {/* {importResponse &&
                    <div className="w-full my-4">
                         {importResponse} 
                    </div>
                } */}
                <div className="w-full my-4">
                    <button 
                    // onClick={nextTransaction}
                    >Next</button>
                </div>
            </div>
        </div>
    );
}

export function TransactionImportRecord(props) {

    return (
        <div className="w-full flex flex-row border-2 border-t-0 border-gray-800 rounded-lg shadow-md shadow-gray-900">

            <div className="w-1/12 m-auto"> {props.transaction.transactionDate} </div>
            <div className="w-1/12 m-auto"> {props.transaction.amount} </div>
            <div className="w-6/12 m-auto"> {props.transaction.description} </div>
            <div className="w-2/12 m-auto"> 
                {props.transaction.status}
                <button className="mx-1 p-1" onClick={props.import} >Import</button>
            </div>
            {/* <div className="w-1/4"> {props.transaction.amount} </div> */}
        </div>
    );
}
