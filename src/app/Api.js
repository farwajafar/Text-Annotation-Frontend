import axios from "axios";

// const baseUrl = "http://10.10.56.115:9601/";

export default class Api {
    static postVideoData = (newData) => {
		console.log('post video');
		return axios.post(
			"http://localhost:8080/api/annotator/update-annotation",
			newData
		);
	};

    // static getCategories = () => {
	// 	return axios.get(baseUrl + "list-categories");
	// 	////return axios.get(baseUrlHR + "employee_api/surnames/");
	// };

	// static postLogin = () => {
	// 	return axios.post(baseUrl + "login");
	// 	////return axios.get(baseUrlHR + "employee_api/surnames/");
	// };
	
}



