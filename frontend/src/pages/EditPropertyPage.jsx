/**
 * EditPropertyPage.jsx
 * A dedicated page for editing an existing property.
 */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getPropertyById,
  updateProperty,
} from "../features/properties/propertySlice";
import PropertyForm from "../components/forms/PropertyForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const EditPropertyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { propertyId } = useParams(); // Get the ID from the URL

  const { data: property, isLoading } = useSelector(
    (state) => state.properties.selectedProperty
  );
  const { isLoading: isUpdateLoading } = useSelector(
    (state) => state.properties
  );

  // Fetch the property data when the page loads
  useEffect(() => {
    dispatch(getPropertyById(propertyId));
  }, [dispatch, propertyId]);

  const handleFormSubmit = async (propertyData) => {
    try {
      await dispatch(
        updateProperty({ _id: propertyId, ...propertyData })
      ).unwrap();
      toast.success("Property updated successfully!");
      navigate("/landlord/properties"); // Redirect back to the list
    } catch (error) {
      toast.error(error.message || "Failed to update property.");
    }
  };

  if (isLoading || !property) {
    return <div className="p-8">Loading property details...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Property</CardTitle>
          <CardDescription>
            Update the details for: {property.address.street}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyForm
            isEditing={true}
            initialData={property}
            onSubmit={handleFormSubmit}
            isLoading={isUpdateLoading}
            onCancel={() => navigate("/landlord/properties")}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPropertyPage;
