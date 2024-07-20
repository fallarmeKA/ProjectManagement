import { useRef } from "react";
import "./index.css";

export default function ModalLayout({ children, active, setActive }) {
  const modalRef = useRef(null);

  const onClick = () => setActive(false);

  return (
    <div className={`modal-layout ${active ? "active" : ""}`}>
      <div className="bg" onClick={onClick} />
      <div className="modal" ref={modalRef}>
        {children}
      </div>
    </div>
  );
}
