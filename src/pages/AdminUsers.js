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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(
        collection(db, "users")
      );

      const data = snap.docs.map((userDoc) => ({
        id: userDoc.id,
        ...userDoc.data(),
      }));

      setUsers(data);
    } catch (error) {
      console.error(
        "Error loading users:",
        error
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const blockUser = async (id) => {
    try {
      await updateDoc(
        doc(db, "users", id),
        {
          status: "blocked",
        }
      );

      fetchUsers();
    } catch (error) {
      console.error(
        "Error blocking user:",
        error
      );
    }
  };

  const unblockUser = async (id) => {
    try {
      await updateDoc(
        doc(db, "users", id),
        {
          status: "active",
        }
      );

      fetchUsers();
    } catch (error) {
      console.error(
        "Error unblocking user:",
        error
      );
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchValue =
      search.toLowerCase().trim();

    const name =
      user.fullName ||
      user.name ||
      "";

    const email =
      user.email || "";

    const matchesSearch =
      name
        .toLowerCase()
        .includes(searchValue) ||
      email
        .toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      statusFilter === "all" ||
      user.status === statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );
  });

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            👥 Manage Users
          </h1>

          <p style={styles.subtitle}>
            Manage customer accounts and
            access status.
          </p>
        </div>

        <div style={styles.totalBox}>
          <span style={styles.totalNumber}>
            {users.length}
          </span>

          <span style={styles.totalLabel}>
            Total Users
          </span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={styles.filterBox}>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={styles.search}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          style={styles.select}
        >
          <option value="all">
            All Users
          </option>

          <option value="active">
            Active
          </option>

          <option value="blocked">
            Blocked
          </option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
          }}
          style={styles.clearButton}
        >
          Clear
        </button>
      </div>

      {/* RESULT COUNT */}
      <div style={styles.resultText}>
        Showing{" "}
        <strong>
          {filteredUsers.length}
        </strong>{" "}
        of {users.length} users
      </div>

      {/* TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>

          <thead>
            <tr>
              <th style={styles.th}>
                Name
              </th>

              <th style={styles.th}>
                Email
              </th>

              <th style={styles.th}>
                Role
              </th>

              <th style={styles.th}>
                Status
              </th>

              <th
                style={{
                  ...styles.th,
                  textAlign: "center",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map((user) => {

              const name =
                user.fullName ||
                user.name ||
                "No Name";

              const isBlocked =
                user.status ===
                "blocked";

              const isAdmin =
                user.role ===
                "admin";

              return (
                <tr key={user.id}>

                  <td style={styles.td}>
                    <div
                      style={
                        styles.nameCell
                      }
                    >
                      <div
                        style={
                          styles.avatar
                        }
                      >
                        {name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <span
                        style={
                          styles.nameText
                        }
                        title={name}
                      >
                        {name}
                      </span>
                    </div>
                  </td>

                  <td style={styles.td}>
                    <span
                      title={
                        user.email || ""
                      }
                      style={
                        styles.emailText
                      }
                    >
                      {user.email ||
                        "No Email"}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.roleBadge,
                        background:
                          isAdmin
                            ? "#D4AF37"
                            : "#333",
                        color:
                          isAdmin
                            ? "#111"
                            : "#ddd",
                      }}
                    >
                      {isAdmin
                        ? "Admin"
                        : "User"}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        background:
                          isBlocked
                            ? "rgba(220,53,69,0.15)"
                            : "rgba(25,135,84,0.15)",
                        color:
                          isBlocked
                            ? "#ff5c6c"
                            : "#4ade80",
                      }}
                    >
                      {isBlocked
                        ? "Blocked"
                        : "Active"}
                    </span>
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      textAlign: "center",
                    }}
                  >
                    {isAdmin ? (
                      <span
                        style={
                          styles.adminText
                        }
                      >
                        Admin Account
                      </span>
                    ) : isBlocked ? (
                      <button
                        onClick={() =>
                          unblockUser(
                            user.id
                          )
                        }
                        style={
                          styles.unblockButton
                        }
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          blockUser(
                            user.id
                          )
                        }
                        style={
                          styles.blockButton
                        }
                      >
                        Block
                      </button>
                    )}
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

        {filteredUsers.length === 0 && (
          <div
            style={
              styles.emptyState
            }
          >
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 80px)",
    background: "#0f0f0f",
    color: "white",
    padding: "35px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    color: "#D4AF37",
    fontSize: "32px",
  },

  subtitle: {
    marginTop: "7px",
    color: "#888",
    fontSize: "14px",
  },

  totalBox: {
    background: "#1b1b1b",
    border: "1px solid #2d2d2d",
    borderRadius: "12px",
    padding: "15px 22px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "110px",
  },

  totalNumber: {
    color: "#D4AF37",
    fontWeight: "700",
    fontSize: "26px",
  },

  totalLabel: {
    color: "#999",
    fontSize: "12px",
    marginTop: "3px",
  },

  filterBox: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    background: "#181818",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #292929",
  },

  search: {
    flex: 1,
    minWidth: "280px",
    padding: "12px 15px",
    background: "#222",
    border: "1px solid #3a3a3a",
    color: "white",
    borderRadius: "7px",
    outline: "none",
    boxSizing: "border-box",
  },

  select: {
    padding: "12px 15px",
    background: "#222",
    border: "1px solid #3a3a3a",
    color: "white",
    borderRadius: "7px",
  },

  clearButton: {
    padding: "12px 18px",
    background: "#444",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
  },

  resultText: {
    margin: "18px 0 12px",
    color: "#888",
    fontSize: "14px",
  },

  tableWrapper: {
    background: "#181818",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #292929",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },

  th: {
    padding: "16px",
    textAlign: "left",
    background: "#222",
    color: "#D4AF37",
    fontSize: "13px",
    borderBottom: "1px solid #333",
  },

  td: {
    padding: "14px 16px",
    borderBottom: "1px solid #262626",
    verticalAlign: "middle",
    maxWidth: "0",
    overflow: "hidden",
  },

  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#8B0000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    flexShrink: 0,
  },

  nameText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
  },

  emailText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
    color: "#bbb",
  },

  roleBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
  },

  statusBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  blockButton: {
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: "600",
  },

  unblockButton: {
    background: "#198754",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: "600",
  },

  adminText: {
    color: "#D4AF37",
    fontSize: "12px",
    fontWeight: "700",
  },

  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#777",
  },
};

export default AdminUsers;