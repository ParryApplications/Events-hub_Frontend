import { useEffect, useRef } from "react";
import { FaTrash, FaEdit } from "react-icons/fa"; // Import icons

export default function ContextMenu({ x, y, onClose, onDelete, onEdit }) {
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
          padding: "8px",
          listStyle: "none",
          boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
          borderRadius: "6px",
          minWidth: "150px",
          zIndex: 1000, // Ensure it's on top
        }}
      >
        <li
          style={{
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "blue",
          }}
          onClick={onEdit}
        >
          <FaEdit size={14} /> Edit
        </li>

        <li
          style={{
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px", // Spacing between icon and text
            color: "red",
          }}
          onClick={onDelete}
        >
          <FaTrash size={14} /> Delete
        </li>
      </ul>
    </div>
  );
}
