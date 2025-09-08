import axios from "axios";

export const apiGetRequest = async (request) => {
    
        console.log("Calling GET API:", request);
        // console.log("Headers:", { Authorization: `Bearer ${request.accessToken}` });

        const response = await axios.get(request.apiUrl, {
            headers: {
                "accept": "*/*",
                "content-type": request.content_type,
                Authorization: `Bearer ${request.accessToken}`, // Add Bearer token here
            },
        });

        // Log the raw response for debugging
        console.log("Raw API Response:", response.data);

        return response; // Axios automatically parses JSON
   
};

const apiResponseHandler = async (res) => {
    if (!res.ok) {
        const error = await res.json().catch(() => res.status);
        return Promise.reject(error);
    } else {
        return res.json();
    }
};