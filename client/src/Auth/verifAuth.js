import axios from "axios";

export default async function verifAuth() {
    if (!localStorage.getItem("token")) return false;
    return axios
        .post("/auth")
        .then((res) => {
            if (res) return true;
            return false;
        })
        .catch((err) => {
            return false;
        });
}
