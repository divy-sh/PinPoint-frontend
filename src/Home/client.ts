import axios from "axios";

export const BASE_API = process.env.REACT_APP_API_BASE;
export const POSTS_API = `${BASE_API}/api/posts`;

const api = axios.create({
    withCredentials: true
})

export const findTrendingPosts = async (page: any, size: any) => {
    const response = await api.get(`${POSTS_API}/trending?page=${page}&size=${size}`);
    return response.data;
};

export const findFollowingPosts = async (userid: any, page: any, size: any) => {
    const response = await api.get(`${POSTS_API}/following/${userid}?page=${page}&size=${size}`);
    return response.data;
};

export const createPost = async (post: any) => {
    const token = localStorage.getItem('token');
    console.log("inside client.ts, service", post)
    const Response = await api.post(`${POSTS_API}`, post, {headers: { 'Authorization': `Bearer ${token}`,}})
    return Response.data;
}

export const findUserPost = async (userid: any) => {
    const Response = await api.get(`${POSTS_API}/user/${userid}`)
    return Response.data;
}

export const updatePost = async (postId: any, post: any) => {
    const token = localStorage.getItem('token');
    const Response = await api.put(`${POSTS_API}/${postId}`, post, {headers: { 'Authorization': `Bearer ${token}`,}})
    return Response.data;
}

export const deletePost = async (postId :any) => {
    const token = localStorage.getItem('token');
    const Response = await api.delete(`${POSTS_API}/${postId}`, {headers: { 'Authorization': `Bearer ${token}`,}})
    return Response.data;
}

export const getPostById = async (postId: any) => {
    const Response = await api.get(`${POSTS_API}/${postId}`)
    return Response.data;
}