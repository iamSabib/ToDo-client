import  { createContext, useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from '../firebase/firebase.init';
import axios from 'axios';



export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {


    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const userRegister = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const userLogin = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password);
    }


    const signInWithGoogle = () =>{
        setLoading(true);
        return signInWithPopup(auth, provider);
    }

    const logOut = () => {
        setLoading(true)
        return signOut(auth);
    };

    // const displayName = () => //console.log(auth.currentUser.displayName, auth.currentUser.photoURL)

    const authInfo = {
        userRegister,
        userLogin,
        user,
        loading,
        setUser,
        logOut,
        signInWithGoogle,
        setLoading,
    }

    useEffect(() => {
        const unsubcribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if(currentUser){

            // console.log(currentUser.displayName, currentUser.email);
            const newuser = {name: currentUser.displayName, email: currentUser.email}
            //call create user api in backend
            try {
                const res = await axios.post('http://localhost:5000/createUser', newuser);
                // console.log('user created', res.data);
            } catch (error) {
                console.error('Error creating user:', error);
            }
        }
          
            setLoading(false);
        });
        return () => {
            unsubcribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
// export {AuthContext}