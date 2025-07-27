import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

function Dashboard() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    username: "",
    examplemail: "",
    password: "",
  });

  const notify = (msg) =>
    toast(msg, {
      position: "top-right",
      autoClose: 3000,
      theme: "dark",
      transition: Bounce,
    });

  // ✅ Load passwords from MongoDB
  const getPasswords = async () => {
    try {
      const res = await fetch("http://localhost:3000/");
      const data = await res.json();
      setPasswords(data);
    } catch (err) {
      console.error("Failed to fetch passwords", err);
      notify("⚠️ Could not load data from server.");
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  // ✅ Save or update password to MongoDB
  const savePassword = async () => {
    try {
      const id = editingIndex !== null ? passwords[editingIndex].id : uuidv4();
      const payload = { ...form, id };

      const res = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        notify(
          editingIndex !== null
            ? "✅ Updated successfully!"
            : "✅ Details saved"
        );
        getPasswords(); // Refresh list
        setEditingIndex(null);
        setForm({ username: "", examplemail: "", password: "" });
      } else {
        notify("❌ Failed to save data.");
      }
    } catch (err) {
      console.error("Save error:", err);
      notify("❌ Failed to connect to server.");
    }
  };

  // ✅ Delete password from MongoDB
  const deletePassword = async (index) => {
    try {
      const res = await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: passwords[index].id }),
      });

      const result = await res.json();
      if (result.success) {
        notify("🗑️ Deleted successfully.");
        getPasswords();
        if (editingIndex === index)
          setForm({ username: "", examplemail: "", password: "" });
      } else {
        notify("❌ Delete failed.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      notify("❌ Server error while deleting.");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    notify(`${label} copied!`);
  };

  const editPassword = (index) => {
    setForm(passwords[index]);
    setEditingIndex(index);
    notify("✏️ Editing entry...");
  };
  return (
    <>
      <ToastContainer />
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#f7f7f7]" />

      <div className="max-w-4xl mx-auto px-4 py-6 sm:p-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          <span className="text-green-500">&lt;</span>Pass
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-base sm:text-lg text-center mb-6">
          Password Manager
        </p>

        <div className="flex flex-col gap-6 items-center w-full">
          <input
            className="rounded-full border border-green-500 w-full max-w-xl text-black px-4 py-2"
            name="username"
            value={form.username}
            onChange={handleChange}
            type="text"
            placeholder="Username"
          />

          <div className="flex flex-col gap-4 w-full max-w-xl">
            <input
              name="examplemail"
              value={form.examplemail}
              onChange={handleChange}
              className={`rounded-full border w-full text-black px-4 py-2 ${
                form.examplemail && !form.examplemail.includes("@")
                  ? "border-red-500"
                  : "border-green-500"
              }`}
              type="text"
              placeholder="example@mail.com"
            />

            <div className="relative w-full">
              <input
                className="rounded-full border border-green-500 w-full text-black px-4 py-2 pr-10"
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <span
                className="absolute right-3 top-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <lord-icon
                  src={
                    showPassword
                      ? "https://cdn.lordicon.com/etqbfrgp.json"
                      : "https://cdn.lordicon.com/psnhyobz.json"
                  }
                  trigger="hover"
                  style={{ width: "24px", height: "24px" }}
                ></lord-icon>
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            disabled={
              !form.username ||
              !/^[a-zA-Z\s]+$/.test(form.username) ||
              !form.examplemail.includes("@") ||
              form.password.length < 8 ||
              !/[!@#$%^&*(),.?":{}|<>]/.test(form.password)
            }
            className={`text-white rounded-full px-6 py-2 flex items-center gap-2 border-2 border-green-900 ${
              !form.username ||
              !/^[a-zA-Z\s]+$/.test(form.username) ||
              !form.examplemail.includes("@") ||
              form.password.length < 8 ||
              !/[!@#$%^&*(),.?":{}|<>]/.test(form.password)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-400 hover:bg-green-300"
            }`}
          >
            <lord-icon
              src="https://cdn.lordicon.com/efxgwrkc.json"
              trigger="hover"
              style={{ width: "24px", height: "24px" }}
            ></lord-icon>
            {editingIndex !== null ? "Update Password" : "Save Password"}
          </button>
        </div>

        <h2 className="font-bold text-2xl sm:text-3xl py-4 text-center">
          <span className="text-green-500">&lt;</span>Your Passwords
          <span className="text-green-500">/&gt;</span>
        </h2>

        {passwords.length === 0 && (
          <div className="text-center">No Passwords To Show</div>
        )}

        {passwords.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[640px] table-auto mx-auto rounded-md overflow-hidden text-sm sm:text-base border border-gray-300">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2 px-4 text-left whitespace-nowrap">
                    Username
                  </th>
                  <th className="py-2 px-4 text-left whitespace-nowrap">
                    Email
                  </th>
                  <th className="py-2 px-4 text-left whitespace-nowrap">
                    Password
                  </th>
                  <th className="py-2 px-4 text-left whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwords.map((entry, index) => (
                  <tr key={index} className="hover:bg-green-200 transition">
                    <td className="py-2 px-4 border border-white text-left whitespace-nowrap">
                      {entry.username}
                      <button
                        onClick={() =>
                          copyToClipboard(entry.username, "Username")
                        }
                        className="ml-2 inline-block"
                        title="Copy username"
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="hover"
                          style={{ width: "20px", height: "20px" }}
                        ></lord-icon>
                      </button>
                    </td>
                    <td className="py-2 px-4 border border-white text-left whitespace-nowrap">
                      {entry.examplemail}
                      <button
                        onClick={() =>
                          copyToClipboard(entry.examplemail, "Email")
                        }
                        className="ml-2 inline-block"
                        title="Copy email"
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="hover"
                          style={{ width: "20px", height: "20px" }}
                        ></lord-icon>
                      </button>
                    </td>
                    <td className="py-2 px-4 border border-white text-left whitespace-nowrap">
                      {"•".repeat(entry.password.length)}
                    </td>
                    <td className="py-2 px-4 border border-white text-left whitespace-nowrap">
                      <div className="flex justify-start gap-2">
                        <button
                          onClick={() => editPassword(index)}
                          title="Edit"
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/gwlusjdu.json"
                            style={{ width: "20px", height: "20px" }}
                          ></lord-icon>
                        </button>
                        <button
                          onClick={() => deletePassword(index)}
                          title="Delete"
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/skkahier.json"
                            trigger="hover"
                            style={{ width: "20px", height: "20px" }}
                          ></lord-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
