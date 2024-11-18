import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Property } from "@/app/model/model";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import api from "@/axios-interceptor";

export type FlatContextType = {
    myFlats: MyFlats
    allFlats: Array<Property>
    flatsForSale: Array<Property>
    flatsForRent: Array<Property>
    addNewFlat: (newFlat: Property) => void;
}

export type MyFlats = {
    flatsForRent: Array<Property>
    flatsForSale: Array<Property>
};

const FlatContext = createContext<FlatContextType | undefined>(undefined);

export const FlatProvider = ({ children }: { children: ReactNode }) => {
    const { auth } = useAuth();
    const [myFlats, setMyFlats] = useState<MyFlats>({ flatsForSale: [], flatsForRent: [] });
    const [allFlats, setAllFlats] = useState<Array<Property>>([]);
    const [flatsForSale, setFlatsForSale] = useState<Array<Property>>([]);
    const [flatsForRent, setFlatsForRent] = useState<Array<Property>>([]);

    useEffect(() => {
        if (auth?.token) {
         void fetchMyFlats();
        }
        void fetchAllFlat();
    }, [auth]);

    const fetchAllFlat = async () => {
        try {
            const response = await axios.get('http://localhost:5000/flats/all');
            setAllFlats(response.data)
            }
        catch(err){
            console.log(err)
            }
        }

    const fetchMyFlats = async () => {
        try {
            const response = await api.get('/flats/user');
            setMyFlats(response.data ?? []);
             }
         catch (error) {
             console.error('Error fetching flats:', error);
             }
        }

    const addNewFlat = (newFlat: Property) => {
        fetchAllFlat();
        fetchMyFlats();
    };

    return (
        <FlatContext.Provider value={{ myFlats, allFlats, flatsForSale, flatsForRent, addNewFlat }}>
            {children}
        </FlatContext.Provider>
    );
}

export const useFlats = () => {
    const context = useContext(FlatContext);
    if (context === undefined) {
        throw new Error('useFlats must be used within an FlatProvider');
    }
    return context;
}
