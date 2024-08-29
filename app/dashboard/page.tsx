import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import React from "react";

const DashboardPage = () => {
  const user = useQuery(api.users.getCurrentUser);
  return (
    <div>
      <p>Dashboard page</p>
      <Link href={`/judge/${user?._id}/create-fair`}>
        <Button className="m-10">Create fair</Button>
      </Link>
    </div>
  );
};

export default DashboardPage;
