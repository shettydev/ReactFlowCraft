import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios"
import Cookies from "js-cookie";

const graphAPI = axios.create({
    baseURL: import.meta.env.VITE_API_GRAPH
})


export const createGraph = async (data) => {
    const response = await graphAPI.post('/', data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        },
    })
    return response.data;
}

export const createGraphQuery = () => useMutation({
    mutationFn: createGraph
})

export const updateGraph = async (data) => {
    const response = await graphAPI.patch(`/${data.id}`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        },
    })
    return response.data;
}

export const updateGraphQuery = () => useMutation({
    mutationFn: updateGraph
})

export const getGraphs = async () => {
    const response = await graphAPI.get('/', {
        headers: {
            "Authorization": `Bearer ${Cookies.get('token')}`
        },
    })
    return response.data;
}

export const getGraphQuery = () => {
    const { isLoading, isError, data, isFetching, status } = useQuery({
        queryKey: ['graphs'],
        queryFn: getGraphs
    })

    return { isLoading, isError, data, isFetching, status }
}

export const deleteGraph = async (id) => {
    const response = await graphAPI.delete(`/${id}`, {
        headers: {
            "Authorization": `Bearer ${Cookies.get('token')}`
        },
    })
    return response.data;
}

export const deleteGraphQuery = () => useMutation({
    mutationFn: deleteGraph
})

export const getEachGraph = async (id) => {
    console.log("id", id)
    const response = await graphAPI.get(`/${id}`, {
        headers: {
            "Authorization": `Bearer ${Cookies.get('token')}`
        },
    })
    return response.data;
}

export const getEachGraphQuery = (id) => {
    const { isLoading, isError, data, isFetching } = useQuery({
        queryKey: ['graph', id],
        queryFn: () => getEachGraph(id)
    })

    return { isLoading, isError, data, isFetching }
}