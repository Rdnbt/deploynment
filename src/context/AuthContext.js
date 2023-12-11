import React, { useContext, useEffect, useState } from 'react';
import { auth } from "../services/firebase"
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateEmail as firebaseUpdateEmail, updatePassword as firebaseUpdatePassword } from 'firebase/auth';

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    function reauthenticate(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function updateEmail(newEmail, currentPassword) {
        return reauthenticate(currentUser.email, currentPassword)
            .then(() => firebaseUpdateEmail(currentUser, newEmail));
    }

    function updatePassword(newPassword, currentPassword) {
        return reauthenticate(currentUser.email, currentPassword)
            .then(() => firebaseUpdatePassword(currentUser, newPassword));
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []); 

      useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            console.log("Auth State Changed. Current user: ", user); // Add this line
            setCurrentUser(user);
            setLoading(false);
        });
    
        return unsubscribe;
    }, []);
    

    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword
    }
    return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
    )
}
