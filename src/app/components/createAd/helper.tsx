import {Position} from "@/app/model/model";
import axios from "axios";
import {GOOGLE_API_KEY} from "@/app/constants/constants";

export const geocodeAddress = async (address: string): Promise<Position | undefined> => {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address,
                key: GOOGLE_API_KEY
            }
        });
        if (response.data.results && response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry.location;
            return { lat, lng };
        } else {
            console.error('Geocoding failed');
            return undefined;
        }
    } catch (error) {
        console.error('Error geocoding address:', error);
        return undefined;
    }
};

export const createNewPropertyDto = (data, position, pictures)=>{
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('shortDescription', data.shortDescription);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('email', data.email);
    formData.append('street', data.street);
    formData.append('streetNumber', data.streetNumber);
    formData.append('zip', data.zip);

    // Combine lat and lng into a single JSON string for the position
    if (position) {
        const positionString = JSON.stringify(position); // Convert the position object to a JSON string
        formData.append('position', positionString); // Send the position as a stringified JSON object
    } else {
        const defaultPosition = JSON.stringify({ lat: 0, lng: 0 });
        formData.append('position', defaultPosition);
    }

    if (data.district) {
        formData.append('district', data.district);
    }
    formData.append('city', data.city);
    formData.append('country', data.country);

    pictures.forEach((picture) => {
        formData.append('pictures', picture);
    });
    return formData;
}
