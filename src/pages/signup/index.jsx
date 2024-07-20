import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkAuthStateChange, firebaseSignup } from "../../services/user";
import { setDocumentTitle } from "../../utils/document-title";
import { notify } from "../../utils/toast";
import "./../account.css";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [tcChecked, setTcChecked] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    notify.info("Signing up...");
    let user = await firebaseSignup(name, email, password, role);
    if (user == null) notify.error("Error signing up.");
    else notify.success("Successfully signed up!");
  };

  useEffect(() => {
    setDocumentTitle("Sign Up");
    checkAuthStateChange(navigate, true, false);
  }, []);

  return (
    <form className="signup" onSubmit={onSubmit}>
      <h1 className="title">Create an Account</h1>

      <input
        className="field"
        type="text"
        value={name}
        onInput={(event) => setName(event.target.value)}
        placeholder="Full Name"
      />

      <input
        className="field"
        type="email"
        value={email}
        onInput={(event) => setEmail(event.target.value)}
        placeholder="Email Address"
      />

      <input
        className="field"
        type="password"
        value={password}
        onInput={(event) => setPassword(event.target.value)}
        placeholder="Password"
      />

      <input
        className="field last"
        type="password"
        value={confirmPassword}
        onInput={(event) => setConfirmPassword(event.target.value)}
        placeholder="Confirm Password"
      />

      <label className="radio-label" for="role-admin">
        <input
          type="radio"
          name="role"
          value="admin"
          id="role-admin"
          checked={role === "admin"}
          onChange={() => setRole("admin")}
        />
        Admin
      </label>

      <label className="radio-label" for="role-employee">
        <input
          type="radio"
          name="role"
          value="employee"
          id="role-employee"
          checked={role === "employee"}
          onChange={() => setRole("employee")}
        />
        Employee
      </label>

      <label className="terms-conditions" htmlFor="tc">
        <input
          id="tc"
          type="checkbox"
          checked={tcChecked}
          onChange={() => setTcChecked((val) => !val)}
        />
        I have read the Terms and Conditions and the Privacy Policy.
      </label>

      <input
        className="button"
        type="submit"
        value="Sign Up"
        disabled={
          !(
            name &&
            email &&
            password &&
            confirmPassword &&
            password == confirmPassword &&
            tcChecked
          )
        }
      />

      <p className="other">
        Already have an account? <Link to="/signin">Login here.</Link>
      </p>
    </form>
  );
}
