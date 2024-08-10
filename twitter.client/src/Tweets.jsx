import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TweetsPage() {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [newTweet, setNewTweet] = useState({
        title: '',
        description: ''
    });
    const [tweetToUpdate, setTweetToUpdate] = useState(null);
    const navigate = useNavigate();

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (showUpdateModal && tweetToUpdate) {
            setTweetToUpdate((prev) => ({
                ...prev,
                [name]: value
            }));
        } else {
            setNewTweet((prev) => ({
                ...prev,
                [name]: value
            }));
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
            setError('Failed to create tweet');
        }
    };

    const handleUpdateTweet = async (e) => {
        e.preventDefault();
        if (!tweetToUpdate) return; // Ensure tweetToUpdate is defined
        try {
            const response = await axios.put(`https://localhost:7227/api/tweet/${tweetToUpdate.id}`, tweetToUpdate);
            if (response.data.success) {
                setTweets((prev) => prev.map((tweet) =>
                    tweet.id === response.data.data.id ? response.data.data : tweet
                ));
                setTweetToUpdate(null);
                setShowUpdateModal(false);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to update tweet');
        }
    };

    const handleDeleteTweet = async (id) => {
        try {
            const response = await axios.delete(`https://localhost:7227/api/tweet/${id}`);
            if (response.data.success) {
                setTweets((prev) => prev.filter((tweet) => tweet.id !== id));
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to delete tweet');
        }
    };

    if (loading) return <Spinner animation="border" />;

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container>
            <h1 className="my-4 text-center">Tweets</h1>
            <div className="text-center mb-4">
                <Button
                    onClick={() => setShowCreateModal(true)}
                    variant="outline-primary"
                    style={{ width: '100%' }}
                >
                    Create Tweet
                </Button>
            </div>
            <div>
                {tweets.map((tweet) => (
                    <Card key={tweet.id} className="mb-4">
                        <Card.Body>
                            <Card.Title>{tweet.title}</Card.Title>
                            <Card.Text>{tweet.description}</Card.Text>
                            <Card.Footer className="text-muted">
                                {new Date(tweet.createdAt).toLocaleString()}
                                <div className="mt-2 d-flex justify-content-between">
                                    <Button
                                        variant="outline-warning"
                                        onClick={() => {
                                            setTweetToUpdate(tweet);
                                            setShowUpdateModal(true);
                                        }}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => handleDeleteTweet(tweet.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            <div className="text-center mt-4">
                <Button
                    onClick={() => navigate('/')}
                    variant="outline-primary"
                    style={{ width: '100%' }}
                >
                    Back to Home
                </Button>
            </div>

            {/* Create Tweet Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Tweet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateTweet}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={newTweet.title}
                                onChange={handleChange}
                                placeholder="Enter title"
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={newTweet.description}
                                onChange={handleChange}
                                placeholder="Enter description"
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-3"
                        >
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
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={tweetToUpdate?.title || ''}
                                onChange={handleChange}
                                placeholder="Enter title"
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={tweetToUpdate?.description || ''}
                                onChange={handleChange}
                                placeholder="Enter description"
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-3"
                        >
                            Update
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default TweetsPage;
