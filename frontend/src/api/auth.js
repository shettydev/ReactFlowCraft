import { useMutation } from "@tanstack/react-query";
import axios from "axios"
import Cookies from "js-cookie";

const authAPI = axios.create({
    baseURL: import.meta.env.VITE_API_AUTH
})


export const registerUser = async (data) => {
    const response = await authAPI.post('/register', data)
    return response.data;
}

export const registerUserQuery = () => useMutation({
    mutationFn: registerUser
})

export const loginUser = async (data) => {
    const response = await authAPI.post('/login', data)
    return response.data;
}

export const loginUserQuery = () => useMutation({
    mutationFn: loginUser
})

export const logoutUser = async (data) => {
    const response = await authAPI.get('/logout', {
        headers: {
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    })
    return response.data;
}

export const logoutUserQuery = () => useMutation({
    mutationFn: logoutUser
})