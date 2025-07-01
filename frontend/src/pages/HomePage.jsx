import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import PropertyCard from '@/components/dashboard/PropertyCard';

const HomePage = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // 1. Add a new state for handling errors

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await api.get('/properties/public');
                setProperties(response.data);
            } catch (error) {
                console.error("Failed to fetch public properties", error);
                // 2. Set a user-friendly error message if the API call fails
                setError('Could not load properties at this time. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, []);

    // Helper function to render content based on state
    const renderContent = () => {
        if (isLoading) {
            return <p className="text-center text-muted-foreground">Loading properties...</p>;
        }

        // 3. Display the error message if an error occurred
        if (error) {
            return <p className="text-center text-destructive font-semibold">{error}</p>;
        }

        if (properties.length > 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <Link to={`/properties/${property._id}`} key={property._id} className="h-full">
                            <PropertyCard property={property} context="public" />
                        </Link>
                    ))}
                </div>
            );
        }

        return <p className="text-center text-muted-foreground">No properties are currently listed. Please check back later.</p>;
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Find Your Next Home</h1>
                <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
                    Browse our collection of available properties. Click on any property to learn more and apply.
                </p>
            </header>
            
            {renderContent()}
        </div>
    );
};

export default HomePage;
// // src/pages/HomePage.jsx
// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import { Link } from 'react-router-dom';
// import PropertyCard from '@/components/dashboard/PropertyCard'; // Import the reusable component

// const HomePage = () => {
//     const [properties, setProperties] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchProperties = async () => {
//             try {
//                 const response = await api.get('/properties/public');
//                 setProperties(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch public properties", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProperties();
//     }, []);

//     return (
//         <div className="container mx-auto p-4 md:p-8">
//             <header className="text-center mb-12">
//                 <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Find Your Next Home</h1>
//                 <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
//                     Browse our collection of available properties. Click on any property to learn more and apply.
//                 </p>
//             </header>
            
//             {isLoading ? (
//                 <p className="text-center">Loading properties...</p>
//             ) : properties.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {properties.map((property) => (
//                         <Link to={`/properties/${property._id}`} key={property._id} className="h-full">
//                             {/* Use the reusable PropertyCard in a public context */}
//                             <PropertyCard property={property} context="public" />
//                         </Link>
//                     ))}
//                 </div>
//             ) : (
//                 <p className="text-center text-muted-foreground">No properties are currently listed. Please check back later.</p>
//             )}
//         </div>
//     );
// };

// export default HomePage;
// // src/pages/HomePage.jsx
// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import { Card, CardContent } from "@/components/ui/card";
// import { Link } from 'react-router-dom';

// const HomePage = () => {
//     const [properties, setProperties] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchProperties = async () => {
//             try {
//                 const response = await api.get('/properties/public');
//                 setProperties(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch public properties", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProperties();
//     }, []);

//     return (
//         <div className="container mx-auto p-4 md:p-8">
//             <header className="text-center mb-12">
//                 <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Find Your Next Home</h1>
//                 <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
//                     Browse our collection of available properties. Click on any property to learn more and apply.
//                 </p>
//             </header>
            
//             {isLoading ? (
//                 <p className="text-center">Loading properties...</p>
//             ) : properties.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {properties.map((property) => (
//                         <Card key={property._id} className="overflow-hidden group transition-all hover:shadow-lg hover:-translate-y-1">
//                             <Link to={`/properties/${property._id}`}>
//                                 <div className="h-48 bg-muted flex items-center justify-center">
//                                     <p className="text-muted-foreground">Property Image</p>
//                                 </div>
//                                 <CardContent className="p-4">
//                                     <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{property.address.street}</h3>
//                                     <p className="text-sm text-muted-foreground">{property.address.city}, {property.address.state}</p>
//                                     <p className="text-lg font-bold mt-4 text-primary">${property.rentAmount.toLocaleString()}/month</p>
//                                 </CardContent>
//                             </Link>
//                         </Card>
//                     ))}
//                 </div>
//             ) : (
//                 <p className="text-center text-muted-foreground">No properties are currently listed. Please check back later.</p>
//             )}
//         </div>
//     );
// };

// export default HomePage;