import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext, useAuthContext } from "../context/AuthContext";

export default function AuthenticatedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAuthContext();
    let location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
}