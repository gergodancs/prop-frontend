import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import './createAd.scss';
import { useAuth } from '@/context/AuthContext';
import { GOOGLE_API_KEY } from "@/app/constants/constants";
import { Position } from "@/app/model/model";
import { useFlats } from "@/context/FlatContext";

const CreateAd = ({ onClose }) => {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        mode: 'onChange'
    });
    const { auth } = useAuth();
    const { addNewFlat } = useFlats();
    const [message, setMessage] = useState('');
    const [pictures, setPictures] = useState([]);
    const [forSale, setForSale] = useState(false);

    const geocodeAddress = async (address: string): Promise<Position | undefined> => {
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

    const onSubmit = async (data: any) => {
        const address = `${data.street} ${data.streetNumber}, ${data.city}, ${data.zip}, ${data.country}`;
        try {
            const position = await geocodeAddress(address);
            const formData = new FormData();

            formData.append('title', data.title);
            formData.append('shortDescription', data.shortDescription);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('email', data.email);
            if (position) {
                formData.append('position[lat]', `${position.lat}`);
                formData.append('position[lng]', `${position.lng}`);
            } else {
                formData.append('position[lat]', `0`);
                formData.append('position[lng]', `0`);
            }
            if (data.district) {
                formData.append('district', data.district);
            }
            formData.append('city', data.city);
            formData.append('country', data.country);

            pictures.forEach((picture) => {
                formData.append('pictures', picture);
            });

            if (!auth) {
                setMessage('You are not logged in.');
                return;
            }

            const endpoint = forSale ? 'sale' : 'rent';

            const response = await axios.post(`http://localhost:5000/flats/${endpoint}`, formData, {
                headers: {
                    authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            addNewFlat(response.data);

            setMessage('Advertisement created successfully!');
            onClose();
        } catch (err) {
            console.error('Failed to create advertisement:', err);
            setMessage('Failed to create advertisement.');
        }
    };

    const handlePictureChange = (e) => {
        setPictures(Array.from(e.target.files));
    };

    return (
        <div className="create-ad-container">
            <h2>Create New Advertisement</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register('title', { required: true })}
                    type="text"
                    placeholder="Title"
                />
                {errors.title && <p className="error">Title is required</p>}
                <input
                    {...register('shortDescription', { required: true })}
                    type="text"
                    placeholder="Short Description"
                />
                {errors.shortDescription && <p className="error">Short Description is required</p>}
                <textarea
                    {...register('description', { required: true })}
                    placeholder="Description"
                />
                {errors.description && <p className="error">Description is required</p>}
                <input
                    {...register('price', { required: true })}
                    type="number"
                    placeholder="Price"
                />
                {errors.price && <p className="error">Price is required</p>}
                <input
                    {...register('email', { required: true })}
                    type="email"
                    placeholder="Email"
                />
                {errors.email && <p className="error">Email is required</p>}
                <input
                    {...register('street', { required: true })}
                    type="text"
                    placeholder="Street"
                />
                {errors.street && <p className="error">Street is required</p>}
                <input
                    {...register('streetNumber', { required: true })}
                    type="text"
                    placeholder="Street Number"
                />
                {errors.streetNumber && <p className="error">Street Number is required</p>}
                <input
                    {...register('zip', { required: true })}
                    type="text"
                    placeholder="ZIP Code"
                />
                {errors.zip && <p className="error">ZIP Code is required</p>}
                <input
                    {...register('city', { required: true })}
                    type="text"
                    placeholder="City"
                />
                {errors.city && <p className="error">City is required</p>}
                <input
                    {...register('country', { required: true })}
                    type="text"
                    placeholder="Country"
                />
                {errors.country && <p className="error">Country is required</p>}
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePictureChange}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={forSale}
                        onChange={() => setForSale(!forSale)}
                    />
                    For Sale
                </label>
                <button type="submit" disabled={!isValid}>Save</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateAd;
