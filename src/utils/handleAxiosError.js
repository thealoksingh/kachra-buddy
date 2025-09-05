export const handleAxiosError = (error) => {
    if (axios.isAxiosError(error)) {
        console.log('error occured in axios', error);

        if (error?.response) {
            // Server responded with a status code outside 2xx
            console.log('error response = ', error?.response?.data);
            return error.response.data;

        } else if (error.request) {
            // No response received from the server
            console.log("Network Error: No response received", error.request);
            return {
                message: "Oops! Something went wrong with the network. Please try again later.",
                statusCode: 500,
                data: null,
                errorCode: "NETWORK_ERROR",
                timestamp: Date.now(),
            };
        } else {
            // Something happened while setting up the request
            console.log("Request Error:", error.message);
            return { message: error.message };
        }
    } else {
        // Non-Axios error (e.g. bug in your code)
        console.log("Unexpected Error:", error);
        return { message: "Unexpected error occurred." };
    }
};