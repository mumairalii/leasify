/**
 * LandlordPropertiesPage.jsx
 * This page serves as the central hub for landlords to view, add, edit, and manage all their properties.
 * It features a paginated grid of properties and links to dedicated pages for creation and editing.
 */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-toastify";

// --- Redux Imports ---
import {
  getProperties,
  deleteProperty,
} from "../features/properties/propertySlice";

// --- UI & Icon Imports ---
import { Button } from "@/components/ui/button";

// --- Custom Component Imports ---
import PropertyCard from "@/components/dashboard/PropertyCard";

const LandLordPropertiesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation

  // --- Redux State Selectors ---
  const { properties, page, totalPages, isLoading, isError, message } =
    useSelector((state) => state.properties);

  // --- Data Fetching Effect ---
  useEffect(() => {
    dispatch(getProperties({ page }));
  }, [page, dispatch]);

  // --- Error Handling Effect ---
  useEffect(() => {
    if (isError) {
      toast.error(message || "An error occurred.");
    }
  }, [isError, message]);

  // --- Event Handlers ---
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages && newPage !== page) {
      dispatch(getProperties({ page: newPage }));
    }
  };

  // --- UPDATED: Navigate to a dedicated edit page ---
  const handleEditProperty = (property) => {
    // This will navigate to a future edit page.
    navigate(`/landlord/properties/edit/${property._id}`);
  };

  const handleDeleteProperty = (propertyId) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this property? This action cannot be undone."
      )
    ) {
      dispatch(deleteProperty(propertyId))
        .unwrap()
        .then(() => {
          toast.success("Property deleted.");
          dispatch(getProperties({ page }));
        })
        .catch((error) =>
          toast.error(error.message || "Failed to delete property.")
        );
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <header className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">All Properties</h1>
          <p className="text-muted-foreground">
            Manage your portfolio of properties.
          </p>
        </div>

        {/* --- THIS IS THE KEY CHANGE --- */}
        {/* The button is now a Link that navigates to the new page */}
        <Button asChild>
          <Link to="/landlord/properties/new">+ Add Property</Link>
        </Button>
      </header>

      <main>
        {isLoading && properties.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            Loading properties...
          </p>
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  context="landlord"
                  onEdit={() => handleEditProperty(property)} // Updated handler
                  onDelete={() => handleDeleteProperty(property._id)}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || isLoading}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
            <p className="text-muted-foreground">
              You have not added any properties yet.
            </p>
            {/* This button also now links to the new page */}
            <Button asChild className="mt-4">
              <Link to="/landlord/properties/new">Add Your First Property</Link>
            </Button>
          </div>
        )}
      </main>

      {/* The Dialog and PropertyForm modal have been removed from this page */}
    </div>
  );
};

export default LandLordPropertiesPage;

// /**
//  * LandlordPropertiesPage.jsx
//  * This page serves as the central hub for landlords to view, add, edit, and manage all their properties.
//  * It features a paginated grid of properties and utilizes modals for creating and editing.
//  */
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { toast } from "react-toastify";

// // --- Redux Imports ---
// import {
//   getProperties,
//   createProperty,
//   updateProperty,
//   deleteProperty,
// } from "../features/properties/propertySlice";

// // --- UI & Icon Imports ---
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent } from "@/components/ui/dialog";

// // --- Custom Component Imports ---
// import PropertyCard from "@/components/dashboard/PropertyCard";
// import PropertyForm from "@/components/forms/PropertyForm";

// const LandlordPropertiesPage = () => {
//   const dispatch = useDispatch();

//   // --- State for Modals and Editing ---
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProperty, setEditingProperty] = useState(null);

//   // --- Redux State Selectors ---
//   const { properties, page, totalPages, isLoading, isError, message } =
//     useSelector((state) => state.properties);

//   // --- Data Fetching Effect ---
//   // This effect runs when the component mounts and when the page number changes.
//   useEffect(() => {
//     dispatch(getProperties({ page }));
//   }, [page, dispatch]);

//   // Effect for handling toast notifications for errors
//   useEffect(() => {
//     if (isError) {
//       toast.error(message || "An error occurred.");
//     }
//   }, [isError, message]);

//   // --- Event Handlers ---
//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages && newPage !== page) {
//       dispatch(getProperties({ page: newPage }));
//     }
//   };

//   const handleOpenCreateModal = () => {
//     setEditingProperty(null); // Ensure we are in "create" mode
//     setIsModalOpen(true);
//   };

//   const handleOpenEditModal = (property) => {
//     setEditingProperty(property); // Set the property to edit
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingProperty(null);
//   };

//   const handleFormSubmit = async (propertyData) => {
//     const action = editingProperty
//       ? updateProperty({ _id: editingProperty._id, ...propertyData })
//       : // When creating, the backend controller assigns the owner and organization
//         createProperty(propertyData);

//     try {
//       await dispatch(action).unwrap();
//       toast.success(
//         `Property ${editingProperty ? "updated" : "created"} successfully!`
//       );
//       handleCloseModal();
//       // Optionally, refetch the current page to see changes
//       dispatch(getProperties({ page }));
//     } catch (error) {
//       toast.error(error.message || "Failed to save property.");
//     }
//   };

//   const handleDeleteProperty = (propertyId) => {
//     if (
//       window.confirm(
//         "Are you sure you want to permanently delete this property? This action cannot be undone."
//       )
//     ) {
//       dispatch(deleteProperty(propertyId))
//         .unwrap()
//         .then(() => {
//           toast.success("Property deleted.");
//           // Refetch properties after deletion
//           dispatch(getProperties({ page }));
//         })
//         .catch((error) =>
//           toast.error(error.message || "Failed to delete property.")
//         );
//     }
//   };

//   return (
//     <div className="space-y-8 p-4 md:p-8">
//       <header className="flex flex-wrap justify-between items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">All Properties</h1>
//           <p className="text-muted-foreground">
//             Manage your portfolio of properties.
//           </p>
//         </div>

//         <Button onClick={handleOpenCreateModal}>+ Add Property</Button>
//       </header>

//       <main>
//         {isLoading && properties.length === 0 ? (
//           <p className="text-center text-muted-foreground py-10">
//             Loading properties...
//           </p>
//         ) : properties.length > 0 ? (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {properties.map((property) => (
//                 <PropertyCard
//                   key={property._id}
//                   property={property}
//                   context="landlord" // Ensures edit/delete options are visible
//                   onEdit={handleOpenEditModal}
//                   onDelete={handleDeleteProperty}
//                   // These props already exist on your PropertyCard component
//                 />
//               ))}
//             </div>
//             {totalPages > 1 && (
//               <div className="flex items-center justify-center gap-4 mt-8">
//                 <Button
//                   variant="outline"
//                   onClick={() => handlePageChange(page - 1)}
//                   disabled={page <= 1 || isLoading}
//                 >
//                   Previous
//                 </Button>
//                 <span className="text-sm font-medium">
//                   Page {page} of {totalPages}
//                 </span>
//                 <Button
//                   variant="outline"
//                   onClick={() => handlePageChange(page + 1)}
//                   disabled={page >= totalPages || isLoading}
//                 >
//                   Next
//                 </Button>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
//             <p className="text-muted-foreground">
//               You have not added any properties yet.
//             </p>
//             <Button onClick={handleOpenCreateModal} className="mt-4">
//               Add Your First Property
//             </Button>
//           </div>
//         )}
//       </main>

//       {/* --- Modal for Creating/Editing Properties --- */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent>
//           <PropertyForm
//             isEditing={!!editingProperty}
//             initialData={editingProperty}
//             onSubmit={handleFormSubmit}
//             isLoading={isLoading} // The main slice loading state can be used here
//             onCancel={handleCloseModal}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default LandlordPropertiesPage;
