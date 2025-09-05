import axios from 'axios';

export const apiPostRequest = async ({ apiUrl, content_type, data, accessToken }) => {
    const headers = {
      'Content-Type': content_type,
      'Accept': '*/*',
    };
  //     const headers = {
  //   Accept: "*/*",
  // };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    console.log(`POST Request: ${apiUrl}`);
    console.log('Headers:', headers);
    console.log('Body:', data);

    const response = await axios.post(apiUrl, data, { headers });
    console.log('raw api response = ', response?.data);
    return response; // axios parses JSON by default
  
};
