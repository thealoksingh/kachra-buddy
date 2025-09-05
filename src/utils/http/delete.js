import axios from "axios";

export const apiDeleteRequest = async (request) => {
   
        console.log("Calling delete API:", request);
        // console.log("Headers:", { Authorization: `Bearer ${request.accessToken}` });

        const response = await axios.delete(request.apiUrl, {
            headers: {
                "accept": "*/*",
                "content-type": request.content_type,
                Authorization: `Bearer ${request.accessToken}`, // Add Bearer token here
            },
        });

        // Log the raw response for debugging
        console.log("Raw Delete API Response:", response.data);

        return response; // Axios automatically parses JSON
   
};