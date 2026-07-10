import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PrivateRouting = ({ children, requiredRole }) => {
  const { user } = useSelector((store) => store.authSlice);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/user-side");
      return;
    }
    if(!requiredRole.includes(user.role)){
      navigate("/unauthorize");
      return;
    }
  }, [user, navigate, requiredRole]);

  if(!user || !requiredRole.includes(user.role)){
    return null; // or a loading spinner
  }
  return children;
};

export default PrivateRouting;
