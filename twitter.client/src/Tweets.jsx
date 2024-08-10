import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

function Tweets() {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await axios.get('https://localhost:7227/api/tweet');
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

    if (loading) return <Spinner animation="border" />;

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container>
            <h1 className="my-4">Tweets</h1>
            <Row>
                {tweets.map((tweet) => (
                    <Col key={tweet.id} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{tweet.title}</Card.Title>
                                <Card.Text>{tweet.description}</Card.Text>
                                <Card.Footer className="text-muted">
                                    {new Date(tweet.createdAt).toLocaleString()}
                                </Card.Footer>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Tweets;
