import axios from "axios";

export default async function verifAuth() {
	if (!localStorage.getItem("token")) return false;
	return await axios
		.post("/auth", {
			token: localStorage.getItem("token")
		})
		.then(res => {
			// console.log(res)
			if (res) return true;
			else return false;
		})
		.catch(err => {
			// console.log(err)
			return false;
		});
}
