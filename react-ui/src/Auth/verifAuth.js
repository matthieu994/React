import axios from "axios";

export default async function verifAuth() {
	return await axios
		.post("/auth", {
			token: localStorage.getItem("token")
		})
		.then(res => {
			if (res) return true;
			else return false;
		})
		.catch(err => {
			return false;
		});
}
