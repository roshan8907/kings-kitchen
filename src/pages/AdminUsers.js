import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  // NEW FEATURE: Search and status filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));

      const data = snap.docs.map((userDoc) => ({
        id: userDoc.id,
        ...userDoc.data(),
      }));

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Unable to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // BLOCK USER
  const blockUser = async (id) => {
    try {
      const ref = doc(db, "users", id);

      await updateDoc(ref, {
        status: "blocked",
      });

      fetchUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Unable to block user.");
    }
  };

  // UNBLOCK USER
  const unblockUser = async (id) => {
    try {
      const ref = doc(db, "users", id);

      await updateDoc(ref, {
        status: "active",
      });

      fetchUsers();
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Unable to unblock user.");
    }
  };

  // NEW FEATURE: Filter users
  const filteredUsers = users.filter((user) => {
    const name = (
      user.fullName ||
      user.name ||
      ""
    ).toLowerCase();

    const email = (
      user.email ||
      ""
    ).toLowerCase();

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      name.includes(search) ||
      email.includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>👥 Manage Users</h1>

      {/* NEW FEATURE: SEARCH + STATUS FILTER */}
      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.statusSelect}
        >
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>

        <button
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
          }}
          style={styles.clearBtn}
        >
          Clear
        </button>
      </div>

      <p style={styles.resultText}>
        Showing {filteredUsers.length} of {users.length} users
      </p>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName || user.name || "No Name"}</td>

                <td>{user.email || "No Email"}</td>

                <td>
                  <span
                    style={{
                      color:
                        user.status === "blocked"
                          ? "red"
                          : "lightgreen",
                      fontWeight: "bold",
                    }}
                  >
                    {user.status || "active"}
                  </span>
                </td>

                <td>
                  {user.status === "blocked" ? (
                    <button
                      onClick={() => unblockUser(user.id)}
                      style={styles.unblockBtn}
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => blockUser(user.id)}
                      style={styles.blockBtn}
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={styles.noResults}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    background: "#111",
    minHeight: "100vh",
    color: "white",
  },

  title: {
    color: "#D4AF37",
    marginBottom: "20px",
  },

  filterContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  searchInput: {
    flex: 1,
    minWidth: "250px",
    padding: "10px",
    background: "#222",
    color: "white",
    border: "1px solid #444",
    borderRadius: "5px",
  },

  statusSelect: {
    padding: "10px",
    background: "#222",
    color: "white",
    border: "1px solid #444",
    borderRadius: "5px",
  },

  clearBtn: {
    padding: "10px 15px",
    background: "#555",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  resultText: {
    color: "#aaa",
    marginBottom: "15px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#222",
  },

  blockBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "5px",
  },

  unblockBtn: {
    background: "green",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "5px",
  },

  noResults: {
    textAlign: "center",
    padding: "30px",
    color: "#aaa",
  },
};

export default AdminUsers;