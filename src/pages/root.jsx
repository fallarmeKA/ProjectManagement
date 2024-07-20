import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthStateChange } from "../services/user";

export default function RootPage() {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStateChange(navigate, true);
  }, []);

  return <></>;
}
