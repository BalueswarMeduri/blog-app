import { showToast } from "./showToast";

export const deleteData = async (endpoint) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this data?"
  );

  if (!confirmDelete) return false;

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      showToast("error", data.message || "Delete failed");
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    showToast("error", error.message);
    return false;
  }
};
