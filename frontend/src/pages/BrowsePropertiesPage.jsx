import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import PropertyCard from "@/components/dashboard/PropertyCard";

const BrowsePropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get("/properties/public");
        setProperties(response.data);
      } catch (err) {
        console.error("Failed to fetch public properties", err);
        setError(
          "Could not load properties at this time. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <p className="text-center text-muted-foreground">
          Loading properties...
        </p>
      );
    }
    if (error) {
      return (
        <p className="text-center text-destructive font-semibold">{error}</p>
      );
    }
    if (properties.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Link
              to={`/properties/${property._id}`}
              key={property._id}
              className="h-full"
            >
              <PropertyCard property={property} context="public" />
            </Link>
          ))}
        </div>
      );
    }
    return (
      <p className="text-center text-muted-foreground">
        No properties are currently listed. Please check back later.
      </p>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Available Properties
        </h1>
        <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
          Find your next home. Click on any property to learn more and submit an
          application.
        </p>
      </header>

      {renderContent()}
    </div>
  );
};

export default BrowsePropertiesPage;
