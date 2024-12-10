import React, { useEffect } from "react";
import axios from "axios";

const FetchChecklists = ({
  page,
  setChecklists,
  setTotalPages,
  setLoading,
  setError,
  itemsPerPage,
}) => {
  const fetchChecklists = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/checklists?page=${page}&titles_only=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setChecklists(response.data.results || []);
      setTotalPages(Math.ceil(response.data.count / itemsPerPage));
    } catch (err) {
      setError(err.message || "Error fetching checklists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, [page]); // Fetch checklists when `page` changes

  return null; // This component doesn’t render anything directly
};

export default FetchChecklists;
