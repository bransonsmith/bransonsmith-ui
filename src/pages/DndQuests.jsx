import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from 'react';

export default function DndQuests() {
    const [quests, setQuests] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchQuests = async () => {
            setIsLoading(true);
            if (isAuthenticated) {
                try {
                    const accessToken = await getAccessTokenSilently({
                        authorizationParams: {
                          audience: import.meta.env.VITE_APP_AUTH0_AUD,
                          scope: "read:dndQuestLog",
                        },
                    });
                    try {
                        const url = import.meta.env.VITE_API_APIG_URL + '/dndQuestLog'
                        const response = await fetch(url, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        if (!response.ok) {
                            throw new Error(`Error: ${response.status}`);
                        }
                        const data = await response.json();
                        setQuests(data);
                    } catch (error) {
                        throw error
                    }
                } catch (error) {
                    if (error.message.includes('Consent required')) {
                        setError('You are not authorized to view this page.')
                    }
                    else {
                        setError('Failed to fetch data. Please try again later.')
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchQuests();
    }, [isAuthenticated]);

    return (
        <div className='w-full flex flex-col'>
            <h2>Get DnD Quests</h2>
            {isLoading && <p className="m-auto py-10 px-2">Loading...</p>}
            {error && <p className="m-auto my-10 py-3 px-3 text-red-500 w-8/12 border-2 rounded border-red-900 bg-red-950">Error: {error}</p>}
            {quests && (
                <div className="w-full py-2 px-2 mx-auto my-10 flex flex-row">
                    {quests}
                </div>
            )}
        </div>
    );
}
