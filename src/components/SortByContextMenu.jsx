import { useEffect, useRef } from "react";
import { MdFilterList } from "react-icons/md";

export default function SortByContextMenu({
  x,
  y,
  onClose,
  onSortingAlphabetiallyFilter,
  onSortingEventDateAscFilter,
  onSortingEventDateDscFilter,
}) {
  const sortByContextMenuRef = useRef(null);

  useEffect(() => {
    const handleClickEvent = (event) => {
      if (
        sortByContextMenuRef.current &&
        !sortByContextMenuRef.current.contains(event.target)
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
    <div className="context-menu-div" ref={sortByContextMenuRef}>
      <ul
        className="dropdown-menu show p-2 shadow"
        style={{
          top: y,
          left: x - 220, // Move left instead of right
          position: "absolute",
          zIndex: 1000,
        }}
      >
        <li>
          <button
            className="dropdown-item d-flex p-0 text-for-short-space"
            onClick={onSortingAlphabetiallyFilter}
          >
            <MdFilterList size={16} className="me-2 text-info" />
            Alphabetically (A &rarr; Z)
          </button>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <button
            className="dropdown-item d-flex p-0 text-for-short-space"
            onClick={onSortingEventDateAscFilter}
          >
            <MdFilterList size={16} className="me-2 text-info" />
            Event Date (Far from today)
          </button>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <button
            className="dropdown-item d-flex p-0 text-for-short-space"
            onClick={onSortingEventDateDscFilter}
          >
            <MdFilterList size={16} className="me-2 text-info" />
            Event Date (First to come)
          </button>
        </li>
      </ul>
    </div>
  );
}
