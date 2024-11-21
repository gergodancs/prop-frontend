import React from 'react';
import { Property } from '@/app/model/model';

export type PropertyInfoProps = {
 activeProperty: Property,
}

const PropertyInfo = ({ activeProperty }: PropertyInfoProps) => {

    if (!activeProperty) {
        return <div>No property details available</div>;
    }
    
return (
    <div>
        <h4>{activeProperty.title}</h4>
        <p>{activeProperty.description}</p>
        <p>Price: {activeProperty.price}</p>
        <p>Contact: {activeProperty.email}</p>
        <div className="flex">
            {activeProperty?.pictures?.map((picture, index) => (
                <img
                    key={index}
                    src={`http://localhost:5000${picture.url}`}
                    alt={picture.description}
                    style={{ width: '250px', height: '200px', margin: '5px' }}
                />
            ))}
        </div>
    </div>
)
}

export default PropertyInfo;