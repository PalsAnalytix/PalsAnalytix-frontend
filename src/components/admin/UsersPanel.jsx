import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const PLAN_OPTIONS = ["FREE", "BASIC", "PREMIUM", "ENTERPRISE"];
const STATUS_OPTIONS = ["ACTIVE", "SUSPENDED", "DEACTIVATED"];

const COURSE_OPTIONS = [
  { code: "CFA", label: "CFA" },
  { code: "FRM", label: "FRM" },
  { code: "SCR", label: "SCR" },
  { code: "EXCEL", label: "Excel" },
  { code: "ADVANCED_EXCEL", label: "Advanced Excel" },
  { code: "EXCEL_FOR_FINANCE", label: "Excel for Finance" },
];

const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const [courseUser, setCourseUser] = useState(null);
  const [grantCourse, setGrantCourse] = useState(COURSE_OPTIONS[0].code);
  const [grantMonths, setGrantMonths] = useState(1);
  const [courseActionLoading, setCourseActionLoading] = useState(false);

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

  const openCourseManager = (user) => {
    setCourseUser(user);
    setGrantCourse(COURSE_OPTIONS[0].code);
    setGrantMonths(1);
  };

  const closeCourseManager = () => {
    setCourseUser(null);
  };

  const isCourseActive = (user, courseCode) => {
    const entry = user.coursePremium?.find((c) => c.course === courseCode);
    return entry && entry.status === "ACTIVE" && new Date(entry.expiryDate) > new Date()
      ? entry
      : null;
  };

  const handleGrant = async () => {
    setCourseActionLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/admin/users/${courseUser._id}/grant-course`,
        { course: grantCourse, months: grantMonths },
        authHeader()
      );
      await loadUsers();
      // refresh the modal's local copy of the user
      setCourseUser((prev) => {
        const updated = users.find((u) => u._id === prev._id);
        return updated || prev;
      });
    } catch (err) {
      alert("Failed to grant course: " + (err.response?.data?.message || err.message));
    } finally {
      setCourseActionLoading(false);
    }
  };

  const handleRevoke = async (courseCode) => {
    if (!window.confirm(`Revoke ${courseCode} access for this student?`)) return;
    setCourseActionLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/admin/users/${courseUser._id}/revoke-course`,
        { course: courseCode },
        authHeader()
      );
      await loadUsers();
      setCourseUser((prev) => {
        const updated = users.find((u) => u._id === prev._id);
        return updated || prev;
      });
    } catch (err) {
      alert("Failed to revoke course: " + (err.response?.data?.message || err.message));
    } finally {
      setCourseActionLoading(false);
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
                  <th className="border border-sand-200 px-3 py-2 text-left">Courses</th>
                  <th className="border border-sand-200 px-3 py-2 text-left">Status</th>
                  <th className="border border-sand-200 px-3 py-2 text-left">Verified</th>
                  <th className="border border-sand-200 px-3 py-2 text-left">Joined</th>
                  <th className="border border-sand-200 px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const activeCourses = COURSE_OPTIONS.filter((c) => isCourseActive(user, c.code));
                  return (
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
                        {activeCourses.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {activeCourses.map((c) => (
                              <span
                                key={c.code}
                                className="inline-block bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-semibold"
                              >
                                {c.label}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sand-500 text-xs">None</span>
                        )}
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
                        <div className="flex gap-3 flex-wrap">
                          <button onClick={() => openEdit(user)} className="text-accent-orange2 hover:underline">
                            Edit
                          </button>
                          <button onClick={() => openCourseManager(user)} className="text-blue-600 hover:underline">
                            Manage Courses
                          </button>
                          <button onClick={() => deleteUser(user)} className="text-red-600 hover:underline">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {courseUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-ink border border-line rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-line">
              <h3 className="font-sora text-xl font-bold text-paper">
                Manage Courses — {courseUser.username}
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <p className="text-sand-300 text-sm font-semibold mb-2">Current Access</p>
                {COURSE_OPTIONS.filter((c) => isCourseActive(courseUser, c.code)).length === 0 ? (
                  <p className="text-sand-500 text-sm">No active course access.</p>
                ) : (
                  <div className="space-y-2">
                    {COURSE_OPTIONS.filter((c) => isCourseActive(courseUser, c.code)).map((c) => {
                      const entry = isCourseActive(courseUser, c.code);
                      return (
                        <div
                          key={c.code}
                          className="flex items-center justify-between bg-charcoal border border-line-light rounded px-3 py-2"
                        >
                          <div>
                            <p className="text-paper text-sm font-medium">{c.label}</p>
                            <p className="text-sand-500 text-xs">
                              Expires {new Date(entry.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            disabled={courseActionLoading}
                            onClick={() => handleRevoke(c.code)}
                            className="text-red-500 text-xs hover:underline disabled:opacity-50"
                          >
                            Revoke
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-line pt-4">
                <p className="text-sand-300 text-sm font-semibold mb-2">Grant Access</p>
                <div className="flex gap-3 mb-3">
                  <select
                    value={grantCourse}
                    onChange={(e) => setGrantCourse(e.target.value)}
                    className="flex-1 p-2 bg-transparent border border-line-light rounded text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
                  >
                    {COURSE_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code} className="text-charcoal">
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={grantMonths}
                    onChange={(e) => setGrantMonths(e.target.value)}
                    className="w-24 p-2 bg-transparent border border-line-light rounded text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
                    placeholder="Months"
                  />
                </div>
                <button
                  disabled={courseActionLoading}
                  onClick={handleGrant}
                  className="w-full py-2 rounded-[3px] font-semibold bg-brand-gradient text-charcoal hover:opacity-90 transition-colors disabled:opacity-50"
                >
                  {courseActionLoading ? "Saving..." : "Grant Access"}
                </button>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-line flex justify-end">
              <button
                onClick={closeCourseManager}
                className="px-4 py-2 bg-sand-700 text-paper rounded-[3px] hover:bg-sand-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPanel;
