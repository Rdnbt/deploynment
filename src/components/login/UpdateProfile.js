import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'

export default function UpdateProfile() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const currentPasswordRef = useRef(); // useRef for current password
    const { currentUser, updatePassword, updateEmail } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match");
        }

        const promises = [];
        setLoading(true);
        setError("");

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value, currentPasswordRef.current.value));
        }
        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value, currentPasswordRef.current.value));
        }

        Promise.all(promises)
            .then(() => {
                navigate("/deploynment");
            })
            .catch((error) => {
                setError("Failed to update account: " + error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                ref={emailRef}
                                required
                                defaultValue={currentUser.email}
                            />
                        </Form.Group>
                        <Form.Group id="current-password">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                type="password"
                                ref={currentPasswordRef}
                                placeholder="Enter current password"
                                required
                            />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                ref={passwordRef}
                                placeholder="Leave blank to keep the same"
                            />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control
                                type="password"
                                ref={passwordConfirmRef}
                                placeholder="Leave blank to keep the same"
                            />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-3" type="submit">
                            Update
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/deploynment">Cancel</Link>
            </div>
        </>
    );
}
