import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios"

const graphAPI = axios.create({
    baseURL: import.meta.env.VITE_API_GRAPH
})


export const createGraph = async (data) => {
    const response = await graphAPI.post('/', data, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data;
}

export const createGraphQuery = () => useMutation({
    mutationFn: createGraph
})

export const getGraphs = async () => {
    const response = await graphAPI.get('/')
    return response.data;
}

export const getGraphQuery = () => {
    const { isLoading, isError, data } = useQuery({
        queryKey: ['graphs'],
        queryFn: getGraphs
    })

    return { isLoading, isError, data }
}

export const deleteGraph = async (id) => {
    const response = await graphAPI.delete(`/${id}`)
    return response.data;
}

export const deleteGraphQuery = () => useMutation({
    mutationFn: deleteGraph
})
