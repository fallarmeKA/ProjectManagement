import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthStateChange, firebaseSendReset } from "../../services/user";
import { setDocumentTitle } from "../../utils/document-title";
import { notify } from "../../utils/toast";
import "./../account.css";

export default function ResetPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    notify.info("Sending password reset email...");
    const success = await firebaseSendReset(email);
    if (success) notify.success("Sent password reset email!");
    else notify.error("Error sending password reset email.");
  };

  useEffect(() => {
    setDocumentTitle("Reset Password");
    checkAuthStateChange(navigate, true, false);
  }, []);

  return (
    <form className="reset" onSubmit={onSubmit}>
      <h1 className="title">Reset Password</h1>

      <input
        className="field extra-space"
        type="email"
        value={email}
        onInput={(event) => setEmail(event.target.value)}
        placeholder="Email Address"
      />

      <input
        className="button"
        type="submit"
        value="Submit"
        disabled={!email}
      />

      <input
        className="button"
        type="button"
        value="Cancel"
        onClick={() => navigate(-1)}
      />
    </form>
  );
}
