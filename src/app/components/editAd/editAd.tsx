import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/context/AuthContext';
import axios from 'axios';
import {Picture} from "@/app/model/model";
import './editad.scss'

export type EditAdProps = {
    property: any; // Update with your actual Property type
    onClose: () => void;
};

const EditAd = (props: EditAdProps) => {
    const {register, handleSubmit, formState: {errors, isValid}, setValue} = useForm({
        mode: 'onChange',
    });
    const {auth} = useAuth();
    const [pictures, setPictures] = useState<Array<Picture>>([]);
    const [message, setMessage] = useState('');
    const [forSale, setForSale] = useState(props.property.forSale);
    const {t} = useTranslation();

    useEffect(() => {
        console.log(props.property)
        const fields = ['title', 'short_description', 'description', 'price', 'email', 'street', 'street_number', 'zip', 'city', 'country'];
        fields.forEach(field => setValue(field, props.property[field]));
        setPictures(props.property.pictures || []);
    }, [props.property, setValue]);

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => formData.append(key, data[key]));
            formData.append('position', JSON.stringify(props.property.position));
            pictures.forEach((picture) => {
                if (picture instanceof File) {
                    formData.append('pictures', picture);
                }
            });

            if (!auth) {
                setMessage('You are not logged in.');
                return;
            }

            await axios.put(`http://localhost:5000/flats/${props.property.id}`, formData, {
                headers: {
                    authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Advertisement updated successfully!');
            props.onClose();
        } catch (err) {
            console.error('Failed to update advertisement:', err);
            setMessage('Failed to update advertisement.');
        }
    };

    const handlePictureChange = (e) => {
        setPictures(Array.from(e.target.files));
    };

    const handleDeleteAd = async () => {
        try {
            await axios.delete(`http://localhost:5000/flats/${props.property.id}`, {
                headers: {
                    authorization: `Bearer ${auth!.token}`,
                },
            });
            setMessage('Advertisement deleted successfully!');
            props.onClose();
        } catch (err) {
            console.error('Failed to delete advertisement:', err);
            setMessage('Failed to delete advertisement.');
        }
    };

    return (
        <div className="create-ad-container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='edit-ad-row'>
                    <input
                        {...register('title', {required: true})}
                        type="text"
                        placeholder={t("createAdd.form.title")}
                    />
                    {errors.title && <p className="error">{t("createAdd.error.required")}</p>}
                    <input
                        {...register('short_description', {required: true})}
                        type="text"
                        placeholder={t("createAdd.form.shortDesc")}
                    />
                </div>
                {errors.shortDescription && <p className="error">{t("createAdd.error.required")}</p>}
                <textarea
                    {...register('description', {required: true})}
                    placeholder={t("createAdd.form.description")}
                />
                {errors.description && <p className="error">{t("createAdd.error.required")}</p>}
                <div className='edit-ad-row'>

                    <input
                        {...register('price', {required: true})}
                        type="number"
                        placeholder={t("createAdd.form.price")}
                    />
                    {errors.price && <p className="error">{t("createAdd.error.required")}</p>}
                    <input
                        {...register('email', {required: true})}
                        type="email"
                        placeholder={t("createAdd.form.email")}
                    />
                </div>
                <div className='edit-ad-row'>

                    {errors.email && <p className="error">{t("createAdd.error.required")}</p>}
                    <input
                        {...register('street', {required: true})}
                        type="text"
                        placeholder={t("createAdd.form.street")}
                    />
                    {errors.street && <p className="error">{t("createAdd.error.required")}</p>}
                    <input
                        {...register('street_number', {required: true})}
                        type="text"
                        placeholder={t("createAdd.form.streetNum")}
                    />
                </div>
                <div className='edit-ad-row'>

                    {errors.street_number && <p className="error">{t("createAdd.error.required")}</p>}
                    <input
                        {...register('zip', {required: true})}
                        type="text"
                        placeholder={t("createAdd.form.zip")}
                    />
                    {errors.zip && <p className="error">{t("createAdd.error.required")}</p>}
                    <input
                        {...register('city', {required: true})}
                        type="text"
                        placeholder={t("createAdd.form.city")}
                    />
                </div>
                <div className='edit-ad-row'>

                    {errors.city && <p className="error">{t("createAdd.error.required")}</p>}
                    <input
                        {...register('country', {required: true})}
                        type="text"
                        placeholder={t("createAdd.form.country")}
                    />
                    {errors.country && <p className="error">{t("createAdd.error.required")}</p>}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePictureChange}
                    />
                </div>
                <div className='edit-ad-row'>
                    {props.property.pictures.map((pic: Picture, index: number) => (
                        <div key={index}>
                            {pic &&
                                <img src={`http://localhost:5000${pic.url}`}
                                     alt={`pic-${index}`}
                                     style={{width: '250px', height: '200px', margin: '5px'}}/>
                            }
                            <button type="button" onClick={() => setPictures(pictures.filter((_, i) => i !== index))}>
                                {t("createAdd.form.remove")}
                            </button>
                        </div>
                    ))}
                </div>
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
                <button type="button" onClick={handleDeleteAd}>
                    {t("createAdd.form.delete")}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EditAd;
