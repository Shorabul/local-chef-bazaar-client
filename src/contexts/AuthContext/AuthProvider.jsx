import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth } from '../../firebase/firebase.init';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);
    const axiosSecure = useAxiosSecure();
    // console.log(user);
    // console.log(role);

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

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile);
    };


    // Observe Firebase login state
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser?.email) {
                try {
                    setRoleLoading(true);

                    const res = await axiosSecure.get(`/users/${currentUser.email}`);
                    setRole(res.data?.role || 'user');

                    // Now you can get chefId
                    setUser(prev => ({ ...prev, chefId: res.data?.chefId }));
                } catch (error) {
                    setRole('user');
                    console.log(error);
                } finally {
                    setRoleLoading(false);
                }
            }
            else {
                setRole(null);
                setRoleLoading(false);
            }

            setLoading(false);
        });

        return () => unSubscribe();
    }, [axiosSecure]);


    const authInfo = {
        user,
        loading,
        role,
        roleLoading,
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