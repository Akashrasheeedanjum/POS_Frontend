"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // or "react-hot-toast"

const Page = () => {
    const params = useSearchParams();
    // const [prevPath, setPrevPath] = useState<any>(null)
    // const origin = window.location.origin;
      useEffect(() => {
    const reason = params?.get("reason");
    const deniedPath = decodeURIComponent(params?.get("denied") || "");
    // setPrevPath(deniedPath)
    if (reason === "unauthorized") {
      toast.error(`You are not authorized to access ${deniedPath || "this page"}.`);
      // Remove query params after showing toast
      window.history.replaceState(null, "", "/dashboard/unAuthorized");
    }
  }, []);

  return (
    <div className="flex h-[90vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          You don’t have permission to view that page.
        </p>
        {/* <p className="text-red-600">{prevPath ? `${String(origin)}${prevPath}`: null}</p> */}
      </div>
    </div>
  )
}

export default Page
