import axios from "axios";

export default async function verifAuth() {
    return await axios.post('/auth', {
        token: localStorage.getItem('token')
    }).then(res => {
        if (res.status === 200) return true;
        return false;
    }).catch(err => console.log(err))
}