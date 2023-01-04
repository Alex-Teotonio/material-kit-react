import api from "./api";

export async function loadSlots(id = 39) {
    const response = await api.get(`/slot/${id}`);
    return response.data;
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