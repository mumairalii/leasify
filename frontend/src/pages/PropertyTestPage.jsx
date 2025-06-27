import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProperties, reset } from '../features/properties/propertySlice';

function PropertyTestPage() {
    const dispatch = useDispatch();

    // Log when the component first renders
    console.log('--- Test Page has rendered ---');

    // Select the necessary state from the Redux store
    const { properties, isLoading, isError, message } = useSelector(
        (state) => state.properties
    );
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        // Log when the useEffect hook runs
        console.log('--- Test Page useEffect has been triggered ---');
        console.log('Current user inside useEffect:', user);

        // This guard clause is key. Only fetch properties if a user object exists.
        if (user) {
            console.log('User exists, dispatching getProperties...');
            dispatch(getProperties());
        }

        // The cleanup function will run when we navigate away from this page
        return () => {
            dispatch(reset());
        };
    }, [user, dispatch]); // The dependency array ensures this runs when the user object is available

    // --- Render logic ---

    if (isLoading) {
        return <h1>(Test Page) Loading properties...</h1>;
    }

    if (isError) {
        return <h1 className="text-red-500">(Test Page) An error occurred: {message}</h1>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold border-b pb-2">Property Test Page</h1>
            <p className="mt-2 text-gray-600">This page is for testing the `getProperties` action in isolation.</p>
            
            <div className="mt-6 p-4 bg-gray-100 rounded">
                <h2 className="text-xl font-semibold">Debugging Info:</h2>
                <p>Is Loading: {isLoading.toString()}</p>
                <p>Is Error: {isError.toString()}</p>
                <p>Properties Found: {properties ? properties.length : 'null or undefined'}</p>
            </div>
            
            <div className="mt-6">
                <h2 className="text-xl font-semibold">Rendered Properties:</h2>
                {properties && properties.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {properties.map(property => (
                            <li key={property._id} className="border p-2 my-2 rounded">
                                <p><strong>Street:</strong> {property.address.street}</p>
                                <p><strong>ID:</strong> {property._id}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded">No properties were found to display.</p>
                )}
            </div>
        </div>
    );
}

export default PropertyTestPage;