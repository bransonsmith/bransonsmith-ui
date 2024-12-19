import { useEffect, useState } from 'react';
import ObjectService from '../Services/ObjectService';

export default function VotingResults() {
    const [loading, setLoading] = useState(true);
    const [votes, setVotes] = useState([]);
    const [aggregatedResults, setAggregatedResults] = useState({});
    const [message, setMessage] = useState(null);

    useEffect(() => {
        ObjectService.getAll('GB_Votes').then((response) => {
            if (!response.data) {
                console.error("No votes found");
                setLoading(false);
                setMessage("No votes found")
                return;
            }
            if (response.data.length === 0) {
                console.error("No votes found");
                setLoading(false);
                setMessage("0 votes found")
                return;
            }
            setVotes(response.data);
            aggregateVotes(response.data);
            setLoading(false);
        }).catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });
    }, []);

    const aggregateVotes = (votes) => {
        const results = {};

        votes.forEach((vote) => {
            vote.votes.forEach((v) => {
                if (!results[v.categoryId]) {
                    results[v.categoryId] = {
                        categoryName: v.categoryName,
                        teams: {}
                    };
                }
                if (!results[v.categoryId].teams[v.teamName]) {
                    results[v.categoryId].teams[v.teamName] = 0;
                }
                results[v.categoryId].teams[v.teamName] += 1;
            });
        });

        setAggregatedResults(results);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mb-6">
            <h1 className="">Voting Results</h1>
            {message && <h2>{message}</h2>}
            {Object.keys(aggregatedResults).map((categoryId) => (
                <div key={categoryId} className="border-t py-3 border-gray-700">
                    <div className="text-lg text-gray-500 font-bold">{aggregatedResults[categoryId].categoryName}</div>
                    <ul className="pl-10 text-gray-500">
                    {Object.keys(aggregatedResults[categoryId].teams)
                        .sort((a, b) => aggregatedResults[categoryId].teams[b] - aggregatedResults[categoryId].teams[a])
                        .map((teamName) => (
                            <li key={teamName} className="flex flex-row w-full gap-3">
                                <div className="w-5/12 text-right font-bold" style={{color: teamName}}>{teamName} Team </div>
                                <div className="w-5/12">{aggregatedResults[categoryId].teams[teamName]}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}