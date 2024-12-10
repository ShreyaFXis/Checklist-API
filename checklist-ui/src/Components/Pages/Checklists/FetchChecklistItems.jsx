import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FetchChecklistItems = ({
  checklistId,
  page = 1,
  setLoadingItems,
  setChecklistItems,
  setPaginationState,
}) => {
  const fetchChecklistItems = async () => {
    setLoadingItems((prev) => ({ ...prev, [checklistId]: true }));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/checklists/${checklistId}/items?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const pageCount = Math.ceil(response.data.count / 10);

      if (page > pageCount && pageCount > 0) {
        await fetchChecklistItems(checklistId, pageCount);
        return;
      }

      setChecklistItems((prevItems) => ({
        ...prevItems,
        [checklistId]: response.data.results,
      }));

      setPaginationState((prevState) => ({
        ...prevState,
        [checklistId]: {
          currentPage: page,
          totalPages: pageCount || 1,
        },
      }));
    } catch (err) {
      toast.error(
        `Error fetching checklist items: ${err.message || "Unknown error"}`
      );
    } finally {
      setLoadingItems((prev) => ({ ...prev, [checklistId]: false }));
    }
  };

  return (
    <button onClick={fetchChecklistItems}>
      Fetch Items for Checklist {checklistId}
    </button>
  );
};

export default FetchChecklistItems;
