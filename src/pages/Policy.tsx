import { Navigate } from "react-router-dom";

// Legacy /policy route now splits into /privacy, /terms, and /trust.
const Policy = () => <Navigate to="/privacy" replace />;

export default Policy;
