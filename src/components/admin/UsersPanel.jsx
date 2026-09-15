import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const PLAN_OPTIONS = ["FREE", "BASIC", "PREMIUM", "ENTERPRISE"];
const STATUS_OPTIONS = ["ACTIVE", "SUSPENDED", "DEACTIVATED"];

const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/users`, authHeader());
      setUsers(res.data);
    } catch (err) {
      setMsg("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      currentSubscriptionPlan: user.currentSubscriptionPlan || "FREE",
      accountStatus: user.accountStatus || "ACTIVE",
      subscriptionExpiryDate: user.subscriptionExpiryDate
        ? new Date(user.subscriptionExpiryDate).toISOString().slice(0, 10)
        : "",
    });
  };

  const closeEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await axios.put(`${BASE_URL}/api/admin/users/${editingUser._id}`, editForm, authHeader());
      closeEdit();
      loadUsers();
    } catch (err) {
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Permanently delete "${user.username}" (${user.email})? This cannot be undone.`)) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/users/${user._id}`, authHeader());
      loadUsers();
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <div className="font-mono text-xs tracking-[.14em] uppercase text-accent-orange2 mb-1">Admin</div>
      <h2 className="font-sora text-2xl font-bold text-charcoal mb-1">Registered Users</h2>
      <div className="h-1 w-16 bg-brand-gradient rounded-full mb-6" />

      {msg && <p className="text-sm text-red-600 mb-4">{msg}</p>}
      {loading && <p className="text-sand-700 mb-4">Loading...</p>}

      {!loading && (
        <>
          <p className="font-sora font-semibold text-charcoal mb-3">{users.length} user(s) registered</p>
          <div className="bg-white rounded-lg border border-sand-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-sand-100">
                  <th className="border border-sand-200 px-3 py-2 text-left">Username</th>
                  <th className="border border-sand-200 px-3 py-2 text-left">Email</th>
                  <th className="border border-sand-200 px-3 py-2 text-left">Phone</th>
                  <th className="border border-sand-200 px-3 py-2 text-left">Plan</th>
                  <th className="border border-sand-200 px-3 py-2 text-left">Status</th>
                  <th className="border border-sand-200 px-3 py-2 text-left">Verified</th>
                  <th className="border border-sand-200 px-3 py-2 text-left">Joined</th>
                  <th className="border border-sand-200 px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="border border-sand-200 px-3 py-2 text-charcoal">{user.username}</td>
                    <td className="border border-sand-200 px-3 py-2 text-sand-900">{user.email}</td>
                    <td className="border border-sand-200 px-3 py-2 text-sand-900">{user.phoneNumber}</td>
                    <td className="border border-sand-200 px-3 py-2">
                      <span className="inline-block bg-accent-yellow/20 text-accent-orange2 rounded-full px-2 py-0.5 text-xs font-semibold">
                        {user.currentSubscriptionPlan}
                      </span>
                    </td>
                    <td className="border border-sand-200 px-3 py-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                          user.accountStatus === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : user.accountStatus === "SUSPENDED"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="border border-sand-200 px-3 py-2 text-center">{user.isVerified ? "✓" : "—"}</td>
                    <td className="border border-sand-200 px-3 py-2 text-sand-700">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="border border-sand-200 px-3 py-2">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(user)} className="text-accent-orange2 hover:underline">
                          Edit
                        </button>
                        <button onClick={() => deleteUser(user)} className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-ink border border-line rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-line">
              <h3 className="font-sora text-xl font-bold text-paper">Edit User</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sand-300 text-sm font-semibold mb-1">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full p-2 bg-transparent border border-line-light rounded text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sand-300 text-sm font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-2 bg-transparent border border-line-light rounded text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sand-300 text-sm font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  className="w-full p-2 bg-transparent border border-line-light rounded text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sand-300 text-sm font-semibold mb-1">Subscription Plan</label>
                <select
                  value={editForm.currentSubscriptionPlan}
                  onChange={(e) => setEditForm({ ...editForm, currentSubscriptionPlan: e.target.value })}
                  className="w-full p-2 bg-transparent border border-line-light rounded text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
                >
                  {PLAN_OPTIONS.map((plan) => (
                    <option key={plan} value={plan} className="text-charcoal">{plan}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sand-300 text-sm font-semibold mb-1">Subscription Expiry</label>
                <input
                  type="date"
                  value={editForm.subscriptionExpiryDate}
                  onChange={(e) => setEditForm({ ...editForm, subscriptionExpiryDate: e.target.value })}
                  className="w-full p-2 bg-transparent border border-line-light rounded text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sand-300 text-sm font-semibold mb-1">Account Status</label>
                <select
                  value={editForm.accountStatus}
                  onChange={(e) => setEditForm({ ...editForm, accountStatus: e.target.value })}
                  className="w-full p-2 bg-transparent border border-line-light rounded text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status} className="text-charcoal">{status}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-sand-600">Password cannot be edited here for security reasons.</p>
            </div>
            <div className="px-6 py-4 border-t border-line flex justify-end gap-3">
              <button
                onClick={closeEdit}
                className="px-4 py-2 bg-sand-700 text-paper rounded-[3px] hover:bg-sand-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className={`px-4 py-2 rounded-[3px] font-semibold transition-colors ${
                  saving ? "bg-sand-700 text-sand-400 cursor-not-allowed" : "bg-brand-gradient text-charcoal hover:opacity-90"
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPanel;
