import React, { useRef, useState } from 'react';
import Key from '../constants/key';
import { Linking } from "react-native";

export const trimText = (text, maxLength) => {
  if (typeof text !== "string") return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export const fetchImageForCity = async ({ city }) => {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?query=mountain&orientation=landscape&client_id=${Key.unsplashApiKey}`
  );
  const data = await response.json();
  // console.log("image data",data?.urls?.regular);
  if (data && data?.urls) {
    return data?.urls?.regular;
  }
};
export const openGoogleMaps = (lat, lng) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  Linking.openURL(url).catch(err => console.error("Failed to open maps:", err));
};


export const callUser = (phoneNumber) => {
  Linking.openURL(`tel:${phoneNumber}`).catch(err =>
    console.error("Failed to make call:", err)
  );
};

// export const fetchAddress = async (latitude, longitude) => {
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Key.mapApiKey}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.status !== "OK" || !data.results.length) {
//       console.log("Geocoding failed:", data.status);
//       return null;
//     }

//     const address = data.results[0].formatted_address;
//     const locationComponents = data.results[0].address_components;

//     const cityComponent = locationComponents.find(
//       (component) =>
//         component.types.includes("locality") ||
//         component.types.includes("administrative_area_level_2")
//     );
//     const state = locationComponents.find((component) =>
//       component.types.includes("administrative_area_level_1")
//     );
//     const country = locationComponents.find((component) =>
//       component.types.includes("country")
//     );
//     const pinCode = locationComponents.find((component) =>
//       component.types.includes("postal_code")
//     );

//     const city = cityComponent ? cityComponent.long_name : "";
//     const addressData = {
//       latitude,
//       longitude,
//       address,
//       city,
//       state: state ? state.long_name : "",
//       pinCode: pinCode ? pinCode.long_name : "",
//       country: country ? country.long_name : "",
//     };
//     console.log("address data in fetchAddress ", addressData);
//     return addressData;
//   } catch (error) {
//     console.log("Error fetching address:", error);
//     return null;
//   }
// };