import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkAuthStateChange, firebaseLogin } from "../../services/user";
import { setDocumentTitle } from "../../utils/document-title";
import { notify } from "../../utils/toast";
import "./../account.css";

export default function SignInPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    notify.info("Logging in...");
    let user = await firebaseLogin(email, password);
    if (user == null) notify.error("Error logging in.");
    else notify.success("Successfully logged in!");
  };

  useEffect(() => {
    setDocumentTitle("Sign In");
    checkAuthStateChange(navigate, true, false);
  }, []);

  return (
    <form className="signin" onSubmit={onSubmit}>
      <h1 className="title">Login to Account</h1>

      <input
        className="field"
        type="email"
        value={email}
        onInput={(event) => setEmail(event.target.value)}
        placeholder="Email Address"
      />

      <input
        className="field last"
        type="password"
        value={password}
        onInput={(event) => setPassword(event.target.value)}
        placeholder="Password"
      />

      <Link to="/reset" className="forgot-password">
        Forgot Password?
      </Link>

      <input
        className="button"
        type="submit"
        value="Login"
        disabled={!(email && password)}
      />

      <p className="other">
        Don't have an account? <Link to="/signup">Create an account.</Link>
      </p>
    </form>
  );
}
