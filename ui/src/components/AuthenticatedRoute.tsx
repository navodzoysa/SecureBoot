import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AuthenticatedRoute({ children }: { children: JSX.Element }) {
    return <Navigate to="/login" state={{ from: location }} replace />;
}