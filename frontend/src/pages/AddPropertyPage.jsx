/**
 * AddPropertyPage.jsx
 * A dedicated page for creating a new property.
 */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProperty } from "../features/properties/propertySlice";
import PropertyForm from "../components/forms/PropertyForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const AddPropertyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.properties);

  const handleFormSubmit = async (propertyData) => {
    try {
      await dispatch(createProperty(propertyData)).unwrap();
      toast.success("Property created successfully!");
      // Redirect the user back to the main properties list after creation
      navigate("/landlord/properties");
    } catch (error) {
      toast.error(error.message || "Failed to create property.");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add a New Property</CardTitle>
          <CardDescription>
            Fill out the details below to add a new property to your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyForm
            isEditing={false}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            onCancel={() => navigate("/landlord/properties")} // Go back if user cancels
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPropertyPage;
