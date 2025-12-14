import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth } from '../../firebase/firebase.init';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [backendData, setBackendData] = useState(null);
    const [backendLoading, setBackendLoading] = useState(true);
    const axiosSecure = useAxiosSecure();


    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signInGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const logOut = async () => {
        setLoading(true);
        await axiosSecure.post("/logout"); // clears cookie
        return signOut(auth);
    };


    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile);
    };


    // Observe Firebase login state
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (!currentUser?.email) {
                setBackendData(null);
                setBackendLoading(false);
                return;
            }

            try {
                setBackendLoading(true);

                const res = await axiosSecure.get(`/users/${currentUser.email}`);
                const { role, status, chefId } = res.data;
                setBackendData({ role, status, chefId });
            } catch (error) {
                console.error(error);
                setBackendData({ role: 'user', status: 'active', chefId: null });
            } finally {
                setBackendLoading(false);
            }
        });

        return () => unSubscribe();
    }, [axiosSecure, user]);


    const authInfo = {
        user,
        loading,
        backendData,
        backendLoading,
        registerUser,
        logInUser,
        signInGoogle,
        logOut,
        updateUserProfile,
    };

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;