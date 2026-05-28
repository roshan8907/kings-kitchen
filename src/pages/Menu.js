import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function Menu() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState("");

  const menuRef = collection(db, "menu");

  // CLOUDINARY UPLOAD
  const uploadImage = async (file) => {
    if (!file) return "";

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "kingskitchen");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dvn5dvuxf/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.secure_url || "";
  };

  // GET MENU
  const getMenu = async () => {
    const data = await getDocs(menuRef);
    setItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getMenu();
  }, []);

  // SAVE / UPDATE
  const handleSave = async () => {
    if (!name || !price || !category) {
      alert("Fill all required fields");
      return;
    }

    if (editId) {
      await updateDoc(doc(db, "menu", editId), {
        name,
        category,
        price,
        status,
        image,
        description,
      });
      setEditId("");
    } else {
      await addDoc(menuRef, {
        name,
        category,
        price,
        status,
        image,
        description,
      });
    }

    setName("");
    setCategory("");
    setPrice("");
    setStatus("Available");
    setImage("");
    setDescription("");

    getMenu();
  };

  // DELETE
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "menu", id));
    getMenu();
  };

  // EDIT
  const handleEdit = (item) => {
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price);
    setStatus(item.status);
    setImage(item.image);
    setDescription(item.description);
    setEditId(item.id);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>🍽 Menu Management (Admin Panel)</div>

      <div style={styles.container}>
        {/* FORM */}
        <div style={styles.formBox}>
          <h3>{editId ? "Update Item" : "Add Food"}</h3>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={styles.input}
          />

          <input
            type="file"
            onChange={async (e) => {
              const file = e.target.files[0];
              const url = await uploadImage(file);
              setImage(url);
            }}
            style={styles.input}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.input}
          >
            <option>Available</option>
            <option>Hidden</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
          >
            <option value="">Select Category</option>
            <option>Breakfast Food</option>
            <option>Lunch Food</option>
            <option>Dinner Food</option>
            <option>Main Meal</option>
            <option>Other</option>
          </select>

          <button onClick={handleSave} style={styles.button}>
            {editId ? "Update Item" : "Add Item"}
          </button>
        </div>

        {/* TABLE */}
        <div style={styles.tableBox}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>
                    <img
                      src={item.image || "https://via.placeholder.com/70"}
                      alt={item.name}
                      style={styles.tableImage}
                    />
                  </td>

                  <td style={styles.td}>{item.name}</td>

                  <td style={styles.descriptionTd}>
                    {item.description}
                  </td>

                  <td style={styles.td}>{item.category}</td>

                  <td style={styles.td}>₹{item.price}</td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          item.status === "Available" ? "green" : "gray",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <button onClick={() => handleEdit(item)} style={styles.edit}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} style={styles.delete}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {

  page: {
    background: "#0f0f0f",
    minHeight: "100vh",
    color: "white",
  },

  header: {
    padding: "20px",
    fontSize: "22px",
    background: "#1a1a1a",
    borderBottom: "1px solid #333",
  },

  container: {
    display: "flex",
    gap: "20px",
    padding: "20px",
  },

  formBox: {
    width: "300px",
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "10px",
  },

  tableBox: {
    flex: 1,
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "10px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    background: "#222",
    border: "1px solid #333",
    color: "white",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#D4AF37",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  edit: {
    background: "orange",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px",
    cursor: "pointer",
  },

  delete: {
    background: "red",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  badge: {
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "12px",
  },
  th: {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #333",
},

td: {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #222",
},


tableImage: {
  width: "70px",
  height: "70px",
  objectFit: "cover",
  borderRadius: "8px",
},

descriptionTd: {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #222",
  minWidth: "250px",
  maxWidth: "350px",
  lineHeight: "1.5",
},

textarea: {
  width: "100%",
  height: "100px",
  padding: "10px",
  marginBottom: "10px",
  background: "#222",
  border: "1px solid #333",
  color: "white",
  borderRadius: "5px",
  resize: "none",
},


};

export default Menu;