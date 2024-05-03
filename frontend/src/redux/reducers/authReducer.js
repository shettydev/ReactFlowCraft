// Import necessary dependencies 
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebaseInit";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Define the initial state of the authentication slice
const initialState = {
    userList: [],
    isLoggedIn: false,
    userLoggedIn: null,
}

// Create an async thunk to fetch the initial user list from the database
export const getInitialUserList = createAsyncThunk(
    "auth/userList",
    (args, thunkAPI) => {

        onSnapshot(collection(db, "learninghub"), (snapShot) => {
            const users = snapShot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            });
            thunkAPI.dispatch(setUserList(users));
        })
    }
)

// Create an async thunk to add a new user to the database
export const createUserThunk = createAsyncThunk(
    "auth/createUser",
    async (data, thunkAPI) => {
        const {authReducer} = thunkAPI.getState();
        const {userList} = authReducer;

        const index = userList.findIndex((user) => user.email === data.email);

        // Check if the provided email already exists in the user list
        if(index !== -1){
            toast.error(
                "Email already exists. Try again with different email or Sign-in!"
            );
            return;
        }

        // Add a new document to the 'learninghub' collection in the database
        const docRef = await addDoc(collection(db, "learninghub"), {
            name: data.name,
            email: data.email,
            password: data.password,
            cart: [],
            orders: [],
        });
        toast.success("User created successfully!");
    }
)


// Create an async thunk to establish a user session
export const createSessionThunk = createAsyncThunk(
    "auth/createSession",
    async (data, thunkAPI) => {
        const {authReducer} = thunkAPI.getState();
        const {userList} = authReducer;
        const index = userList.findIndex((user) => user.email === data.email);

        // Find the index of the user with the provided email
        if (index === -1) {
            toast.error("Email does not exist. Try again or Sign-up!");
            return false;
        }

        // Check if the provided password matches the user's password        
        if (userList[index].password === data.password) {

            toast.success(`Welcome!`);

            // Update the state to reflect the user's login status and details
            thunkAPI.dispatch(setLoggedIn(true));
            thunkAPI.dispatch(setUserLoggedIn(userList[index]));

            // Store the login status and user details in local storage            
            window.localStorage.setItem("token", true);
            window.localStorage.setItem("index", JSON.stringify(userList[index]));

            return true;
        } else {
            toast.error("Incorrect Username or Password!");
            return false;
        }
    }
)


// Create an async thunk to delete a user's session (log out)
export const deleteSessionThunk = createAsyncThunk(
    "auth/deleteSession",
    (data, thunkAPI) => {

        // Remove the login-related data from local storage
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("index");

        // Update the state to indicate that the user is logged out
        thunkAPI.dispatch(setLoggedIn(false));
        thunkAPI.dispatch(setUserLoggedIn(null));
        
        toast.error("Signed Out!");
    }
)

// Create an authSlice using createSlice
const authSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {

        // Set the user list in the state        
        setUserList: (state, action) => {
            state.userList = action.payload;
        },
        // Set the login status in the state
        setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        // Set the currently logged-in user's details in the state
        setUserLoggedIn: (state,action) => {
            state.userLoggedIn = action.payload;
        }
    }
});

// Export the authReducer and action creators
export const authReducer = authSlice.reducer;

export const {setUserList, setLoggedIn, setUserLoggedIn } = authSlice.actions;

// Define a selector to access the authentication state
export const authSelector = (state) => state.authReducer;