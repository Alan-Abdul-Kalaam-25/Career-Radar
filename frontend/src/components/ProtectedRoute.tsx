import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getMe } from "../utils/auth";
import LoadingState from "./LoadingState";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    getMe()
      .then(() => mounted && setAuthed(true))
      .catch(() => mounted && setAuthed(false))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  if (loading) return <LoadingState label="Authorising your session" />;
  if (!authed) return <Navigate to="/login" replace />;
  return <Outlet />;
}
