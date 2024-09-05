import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function TweetsPage() {
    const [tweets, setTweets] = useState([]);
    const [tweetToUpdate, setTweetToUpdate] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTweet, setNewTweet] = useState({ title: '', description: '' });
    const [error, setError] = useState('');
    //this grabs the tweets

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await axios.get('https://localhost:7227/api/Tweet');
                setTweets(response.data.data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError('Failed to fetch tweets');
            }
        };

        fetchTweets();
    }, []);

    const handleUpdateTweet = async (e) => {
        e.preventDefault();
        if (!tweetToUpdate) return;

        try {
            const response = await axios.put(
                `https://localhost:7227/api/Tweet/${tweetToUpdate.id}`,
                tweetToUpdate
            );

            if (response.data.success) {
                setTweets((prev) =>
                    prev.map((tweet) =>
                        tweet.id === response.data.data.id ? response.data.data : tweet
                    )
                );
                setTweetToUpdate(null);
                setShowUpdateModal(false);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error("Update error:", err);
            setError('Failed to update tweet');
        }
    };

    const handleDeleteTweet = async (id) => {
        try {
            if (window.confirm("Are you sure you want to delete this Tweet?")) {
                const response = await axios.delete(`https://localhost:7227/api/tweet/${id}`);

                if (response.data.success) {
                    setTweets((prev) => prev.filter((tweet) => tweet.id !== id));
                } else {
                    setError(response.data.message);
                }
            }
        } catch (err) {
            console.error("Delete error:", err);
            setError('Failed to delete tweet');
        }
    };

    const handleCreateTweet = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7227/api/tweet', newTweet);
            if (response.data.success) {
                setTweets((prev) => [response.data.data, ...prev]);
                setNewTweet({ title: '', description: '' });
                setShowCreateModal(false);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error("Create error:", err);
            setError('Failed to create tweet');
        }
    };

    const [expandedId, setExpandedId] = useState(null);

    const handleReadMoreToggle = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const truncateText = (text, maxLines) => {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.visibility = 'hidden';
        element.style.whiteSpace = 'pre-line';
        element.style.width = '100%';
        element.innerText = text;
        document.body.appendChild(element);

        const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
        const maxHeight = lineHeight * maxLines;
        const truncatedText = text.split('\n').map(line => {
            if (line.length > maxHeight) {
                return line.substring(0, maxHeight) + '...';
            }
            return line;
        }).join('\n');

        document.body.removeChild(element);
        return truncatedText;
    };

    const getLineCount = (text) => {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.visibility = 'hidden';
        element.style.whiteSpace = 'pre-line';
        element.innerText = text;
        document.body.appendChild(element);

        const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 5);
        const height = element.scrollHeight;
        document.body.removeChild(element);

        return Math.ceil(height / lineHeight);
    };

    return (
        <Container>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Twitter</h1>

            <Button
                variant="outline-dark"
                style={{ width: '100%', marginBottom: '1rem' }}
                onClick={() => setShowCreateModal(true)}
            >
                Create Tweet
            </Button>

            {tweets.length ? (
                <Row className="justify-content-center">
                    {tweets.map((tweet) => (
                        <Col key={tweet.id} xs={12} md={6} lg={4} className="mb-4">
                            <div
                                style={{
                                    marginBottom: '1rem',
                                    border: 'solid lightgray 1px',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                }}
                            >
                                <h4>{tweet.title}</h4>
                                <p style={{ whiteSpace: 'pre-line' }}>
                                    {expandedId === tweet.id || getLineCount(tweet.description) <= 3
                                        ? tweet.description
                                        : truncateText(tweet.description, 3)}
                                </p>
                                {getLineCount(tweet.description) > 3 && (
                                    <Button
                                        variant="link"
                                        onClick={() => handleReadMoreToggle(tweet.id)}
                                    >
                                        {expandedId === tweet.id ? 'Show Less' : 'Read More'}
                                    </Button>
                                )}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginTop: '1rem',
                                    }}
                                >
                                    <Button
                                        variant="outline-info"
                                        onClick={() => {
                                            setTweetToUpdate(tweet);
                                            setShowUpdateModal(true);
                                        }}
                                        style={{ flex: 1, marginRight: '1rem' }}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => handleDeleteTweet(tweet.id)}
                                        style={{ flex: 1 }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p>No tweets available</p>
            )}

            {/* Create Tweet Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Tweet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateTweet}>
                        <Form.Group controlId="formTitle">
                            <Form.Control
                                type="text"
                                placeholder="Title"
                                value={newTweet.title}
                                onChange={(e) => setNewTweet({ ...newTweet, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription" className="mt-2">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Description"
                                value={newTweet.description}
                                onChange={(e) => setNewTweet({ ...newTweet, description: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Create
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Update Tweet Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Tweet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateTweet}>
                        <Form.Group controlId="formTitle">
                            <Form.Control
                                type="text"
                                placeholder="Title"
                                value={tweetToUpdate?.title || ''}
                                onChange={(e) => setTweetToUpdate({ ...tweetToUpdate, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription" className="mt-2">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Description"
                                value={tweetToUpdate?.description || ''}
                                onChange={(e) => setTweetToUpdate({ ...tweetToUpdate, description: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Update
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default TweetsPage;
