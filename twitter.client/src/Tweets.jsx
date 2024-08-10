import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function TweetsPage() {
    const [tweets, setTweets] = useState([]);
    const [tweetToUpdate, setTweetToUpdate] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTweet, setNewTweet] = useState({ title: '', description: '' });
    const [error, setError] = useState('');

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

            if (window.confirm("are you sure you want to delete this Tweet?"))
            {
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

    return (
        <Container>
            <Row className="justify-content-center mt-4">
                {tweets.map((tweet) => (
                    <Col key={tweet.id} xs={12} md={6} lg={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{tweet.title}</Card.Title>
                                <Card.Text>{tweet.description}</Card.Text>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => {
                                        setTweetToUpdate(tweet);
                                        setShowUpdateModal(true);
                                    }}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteTweet(tweet.id)}
                                >
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

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
