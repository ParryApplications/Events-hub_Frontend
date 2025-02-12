import { useEffect, useRef } from "react";

export default function ContextMenu({ x, y, onClose, onDelete }) {
  const contextMenuDivRef = useRef(null);

  useEffect(() => {
    const handleClickEvent = (event) => {
      if (
        contextMenuDivRef.current &&
        !contextMenuDivRef.current.contains(event.target)
      ) {
        onClose();
      }
      //   console.log(event.target);
    };
    document.addEventListener("mousedown", handleClickEvent);

    return () => {
      document.removeEventListener("mousedown", handleClickEvent);
    };
  }, []);

  return (
    <div className="context-menu-div" ref={contextMenuDivRef}>
      <ul
        style={{
          top: y,
          left: x,
          position: "absolute",
          background: "#fff",
          border: "1px solid #ccc",
          padding: "5px",
          listStyle: "none",
          boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        <li style={{ cursor: "pointer", padding: "5px" }} onClick={onDelete}>
          🗑️Delete
        </li>
      </ul>
    </div>
  );
}
