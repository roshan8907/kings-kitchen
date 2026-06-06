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

  // FETCH USERS
  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));

    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // BLOCK USER
  const blockUser = async (id) => {
    const ref = doc(db, "users", id);

    await updateDoc(ref, {
      status: "blocked",
    });

    fetchUsers();
  };

  // UNBLOCK USER
  const unblockUser = async (id) => {
    const ref = doc(db, "users", id);

    await updateDoc(ref, {
      status: "active",
    });

    fetchUsers();
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>👥 Manage Users</h1>

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
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
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
                  {user.status}
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
          ))}
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
  
};

export default AdminUsers;