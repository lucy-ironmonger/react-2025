import React, { useState, useEffect, useContext, createContext } from 'react';
import firebase from './firebase';

// FUNCTIONS IN THIS CODE:
// 1) useProvideAuth (meaty function which stores all 3 user functions and the user state)

// useProvideAuth is stored as variable 'auth' in function 2 (ProvideAuth)
// auth is then passed as a prop in function 2, called 'value' to the children components

// 2) ProvideAuth class passes props to children. This function wraps the children
// components in the authContext Provider context so that it has these powers further down the tree

// 3) authContext pulls from react so context can be used in function 2.
// 4) authContext is being fed as an argument to useAuth which is watching for changes in useContext

// In short, we are taking the meaty function and passing this in as context to the children.

// createContext is pulled from React and stored
const authContext = createContext();

export function ProvideAuth({ children }) {
  // useProvideAuth() is a function on line 19, stored as auth, passed into the provider context
  const auth = useProvideAuth();
  //this is making values available to the children
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// useContext is watching for changes in authContext, and the result is being returned in useAuth
// useAuth is the createContext
export const useAuth = () => {
  return useContext(authContext);
};

//START HERE - MAIN FUNCTION - useProvideAuth
function useProvideAuth() {
  // this declares a state variable called user
  // useState is a new way to use the exact same capabilities that this.state provides in a class - it's null
  // setUser is the function that updates useState
  // What does useState return? It returns a pair of values: the current state and a function that updates it.
  const [user, setUser] = useState(null);

  const signinWithGithub = () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => {
        setUser(response.user); //we get a response and we set the user equal to the user we get in the response
        return response.user;
      });
  };

  const signout = () => {
    return firebase
      .auth() // also access auth and sign out which will clear the cookie
      .signOut()
      .then(() => {
        setUser(false);
      });
  };

  // the below says that if the state changes in your auth it will either update the user, or it will clear it
  // out and set it to false
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });
    // this hook will run when that state changes.
    return () => unsubscribe();
  }, []);

  return {
    user,
    signinWithGithub,
    signout
  };
}
