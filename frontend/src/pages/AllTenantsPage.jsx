/**
 * AllTenantsPage.jsx
 * This page serves as the central hub for landlords to view all their tenants.
 * It features filtering, searching, and a grid of TenantCard components.
 */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTenants } from "../features/tenants/tenantSlice";
import TenantCard from "../components/tenants/TenantCard";
import { Input } from "@/components/ui/input";

const AllTenantsPage = () => {
  const dispatch = useDispatch();
  const { allTenants, isLoading } = useSelector((state) => state.tenants);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getTenants());
  }, [dispatch]);

  const filteredTenants = allTenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-4 md:p-8">
      <header className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tenant Management</h1>
          <p className="text-muted-foreground">
            View and manage all tenants in your portfolio.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main>
        {isLoading ? (
          <p className="text-center text-muted-foreground py-10">
            Loading tenants...
          </p>
        ) : filteredTenants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenants.map((tenant) => (
              <TenantCard key={tenant._id} tenant={tenant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
            <p className="text-muted-foreground">No tenants found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllTenantsPage;
