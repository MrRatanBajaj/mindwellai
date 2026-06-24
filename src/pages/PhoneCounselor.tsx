import { Navigate } from "react-router-dom";

// Legacy /phone-counselor route now redirects users to the unified /consultation/audio
// experience (Yaro + Ava). The "Dr. Aria" persona has been retired.
const PhoneCounselor = () => <Navigate to="/consultation/audio" replace />;

export default PhoneCounselor;
