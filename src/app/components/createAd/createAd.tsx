import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import './createAd.scss';
import { useAuth } from '@/context/AuthContext';
import { GOOGLE_API_KEY } from "@/app/constants/constants";
import { Position } from "@/app/model/model";
import { useFlats } from "@/context/FlatContext";
import { useTranslation } from "react-i18next";

const CreateAd = ({ onClose }) => {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        mode: 'onChange'
    });
    const { auth } = useAuth();
    const { addNewFlat } = useFlats();
    const { t } = useTranslation();
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
        const address = `${data.street} ${data.streetNumber}, ${data.city}, ${data.district}, ${data.country}`;
        try {
            const position = await geocodeAddress(address);
            const formData = new FormData();

            formData.append('title', data.title);
            formData.append('shortDescription', data.shortDescription); // Change to camelCase
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('email', data.email);
            formData.append('street', data.street);
            formData.append('streetNumber', data.streetNumber);
            formData.append('zip', data.zip);
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
            <h2>{t("createAdd.title")}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register('title', { required: true })}
                    type="text"
                    placeholder={t("createAdd.form.title")}
                />
                {errors.title && <p className="error">
                    {t("createAdd.error.required")}
                </p>}
                <input
                    {...register('shortDescription', { required: true })} // Change to camelCase
                    type="text"
                    placeholder={t("createAdd.form.shortDesc")} />
                {errors.shortDescription && <p className="error">
                    {t("createAdd.error.required")}
                </p>}
                <textarea
                    {...register('description', { required: true })}
                    placeholder={t("createAdd.form.description")}
                />
                {errors.description && <p className="error">
                    {t("createAdd.error.required")}
                </p>}
                <input
                    {...register('price', { required: true })}
                    type="number"
                    placeholder={t("createAdd.form.price")}
                />
                {errors.price && <p className="error">
                    {t("createAdd.error.required")}
                </p>}
                <input
                    {...register('email', { required: true })}
                    type="email"
                    placeholder={t("createAdd.form.email")}
                />
                {errors.email && <p className="error">
                    {t("createAdd.error.required")}
                </p>}
                <input
                    {...register('street', { required: true })}
                    type="text"
                    placeholder={t("createAdd.form.street")}
                />
                {errors.street && <p className="error">
                    {t("createAdd.error.required")}
                </p>}
                <input
                    {...register('streetNumber', { required: true })}
                    type="text"
                    placeholder={t("createAdd.form.streetNum")}
                />
                {errors.streetNumber && <p className="error">
                    {t("createAdd.error.required")}
                </p>}
                <input
                    {...register('zip', { required: true })}
                    type="text"
                    placeholder={t("createAdd.form.zip")}
                />
                {errors.zip && <p className="error">
                    {t("createAdd.error.required")}
                </p>}
                <input
                    {...register('city', { required: true })}
                    type="text"
                    placeholder={t("createAdd.form.city")}
                />
                {errors.city && <p className="error">
                    {t("createAdd.error.required")}
                </p>}
                <input
                    {...register('country', { required: true })}
                    type="text"
                    placeholder={t("createAdd.form.country")}
                />
                {errors.country && <p className="error">
                    {t("createAdd.error.required")}
                </p>}
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
                    {forSale ? t("createAdd.form.forSale") : t("createAdd.form.forRent")}
                </label>
                <button type="submit" disabled={!isValid}>
                    {t("createAdd.form.save")}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateAd;
