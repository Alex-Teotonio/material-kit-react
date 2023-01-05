import api from "./api";

const token = localStorage.getItem('token')
if(token) {
api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`;
}

export async function loadSlots(id = 39) {
    const response = await api.get(`/slot/${id}`);
    return response.data;
}

export async function get(path) {
    const response = await api.get(path);
    if(response.status === 200) return response.data
    throw new Error(`${response.status} - ${response.statusText}`)
}


export async function post(path, payload) {
    const response = await api.post(path, payload);
    return response;
}


export async function loadTeams(id = 49) {
    const response = await api.get(`/team/${id}`);
    return response.data;
}

export async function loadLeagues() {
    const response = await api.get('/league');
    return response.data
}


export async function updateTeams({ name, leagueId, venue, initials }, id=39) {
    await api.put(`/team/${id}`, { name, leagueId, venue, initials });
}

export async function createUser(firstName, lastName, password, email) {
    const newUser = await api.post('/user', {firstName, lastName, password, email})
    return newUser;
}


export async function auth(email, password) {
    try{
        const response = await api.post('/auth', {email, password});
        return response;
    } catch(error) {
        throw new Error(error)
    }
    
}