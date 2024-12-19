import { useEffect, useState } from 'react';
import { makeRequestToApi } from '../../Services/ApiService';

export default function TransactionImportEntry(props) {

    const [transaction, setTransaction] = useState(props.transaction);
    const [loading, setLoading] = useState(false);
    const [importResponse, setImportResponse] = useState(null);
    const [status, setStatus] = useState("START");

    // useEffect(() => {
    //     attemptImport();
    // }, []);

    const attemptImport = async () => {
        setLoading(true);
        try {
            transaction.amount = parseFloat(transaction.amount);
            // console.log('Attempting to import transaction: ', transaction);
            const response = await makeRequestToApi('api/Transaction/import', 'POST', transaction);
            if (response.status === 200) {
                setStatus("IMPORTED");
                setImportResponse('');
                // console.log('Transaction imported: ', response);
            }
            else if (response.status === 400) {
                setStatus("ERROR");
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
                return
            }
            else {
                console.error('Error importing transaction: ', response);
                setImportResponse('Transaction imported: ' + response.data.detail);
                setStatus("ERROR");
                return;
            }
        } catch (error) {
            console.error('Exception importing transaction: ', error);
            setStatus("ERROR");
            return;
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-row flex-wrap">
            <div className="w-full">
                {transaction.date} {transaction.amount} {transaction.star} {transaction.blank} {transaction.description}
            </div>
            <div className="w-full flex flex-row">
                <div className="w-1/4">
                    { status === "IMPORTED" && <span className="text-accent-400">{status}</span> }
                    { status === "ERROR" && <span className="text-error-900">{status}</span> }
                    { status === "START" && <span className="text-defaultText">{status}</span> }
                    
                </div>
                { importResponse &&
                    <div className="w-3/4">
                        {importResponse}
                    </div>
                }
                {
                    <div className="w-3/4">
                        <button onClick={attemptImport}>Import</button>
                    </div>
                }
            </div>
        </div>
    )
}