import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Form } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import axios from 'axios';

function Tweets() {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await axios.get('https://localhost:7227/api/Tweet')
                if (response.data.success) {
                    setTweets(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError('Failed to fetch tweets');
            } finally {
                setLoading(false);
            }
        };

        fetchTweets();
    }, []);

    if (loading) return <p>Loading tweets...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Tweets</h1>
            <ul>
                {tweets.map((tweet) => (
                    <li key={tweet.id}>
                        <h3>{tweet.title}</h3>
                        <p>{tweet.description}</p>
                        <small>{new Date(tweet.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tweets;
