import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const MbaEvaluationPanel = () => {
  const [tab, setTab] = useState("students");

  return (
    <div className="bg-white rounded shadow p-4 sm:p-6">
      <div className="flex gap-2 mb-6">
        {["students", "questions", "tests"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded capitalize text-sm sm:text-base ${
              tab === t ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "students" && <StudentsTab />}
      {tab === "questions" && <QuestionsTab />}
      {tab === "tests" && <TestsTab />}
    </div>
  );
};

// ---------------- STUDENTS ----------------
const StudentsTab = () => {
  const [students, setStudents] = useState([]);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const loadStudents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/mba/admin/students`, authHeader());
      setStudents(res.data);
    } catch (err) {
      setMsg("Failed to load students");
    }
  };

  useEffect(() => { loadStudents(); }, []);

  const createStudent = async (e) => {
    e.preventDefault();
    setMsg("Creating...");
    try {
      await axios.post(`${BASE_URL}/api/mba/admin/students`, { username, fullName, password }, authHeader());
      setMsg("Student created!");
      setUsername(""); setFullName(""); setPassword("");
      loadStudents();
    } catch (err) {
      setMsg("Failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <form onSubmit={createStudent} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border rounded px-3 py-2" required />
        <input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="border rounded px-3 py-2" required />
        <input placeholder="Temporary password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded px-3 py-2" required />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white rounded px-4 py-2 sm:col-span-3">Create Student</button>
      </form>
      {msg && <p className="text-sm text-gray-700 mb-4">{msg}</p>}
            <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1">Username</th>
            <th className="border px-2 py-1">Full Name</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td className="border px-2 py-1">{s.username}</td>
              <td className="border px-2 py-1">{s.fullName}</td>
              <td className="border px-2 py-1">{s.status}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={async () => {
                    if (!window.confirm(`Delete student "${s.username}"? This cannot be undone.`)) return;
                    try {
                      await axios.delete(`${BASE_URL}/api/mba/admin/students/${s._id}`, authHeader());
                      loadStudents();
                    } catch (err) {
                      alert("Failed to delete student");
                    }
                  }}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---------------- QUESTIONS ----------------
const QuestionsTab = () => {
  const [questions, setQuestions] = useState([]);
  const [msg, setMsg] = useState("");
    const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageQNum, setImageQNum] = useState("");
  const [imageType, setImageType] = useState("Question");
  const [imageLabel, setImageLabel] = useState("");
  const loadQuestions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/mba/admin/questions`, authHeader());
      setQuestions(res.data);
    } catch (err) {
      setMsg("Failed to load questions");
    }
  };

  useEffect(() => { loadQuestions(); }, []);

  const uploadFile = async () => {
    if (!file) return;
    setMsg("Uploading...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${BASE_URL}/api/mba/admin/questions/bulk-upload`, formData, {
        headers: { ...authHeader().headers, "Content-Type": "multipart/form-data" },
      });
      setMsg(res.data.message);
      loadQuestions();
    } catch (err) {
      setMsg("Failed: " + (err.response?.data?.error || err.message));
    }
  };

    const uploadImage = async () => {
    if (!imageFile) return;
    if (!imageQNum) { setMsg("Please enter a question number first."); return; }
    setMsg("Uploading image...");
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const res = await axios.post(`${BASE_URL}/api/mba/admin/upload/image`, formData, {
        headers: { ...authHeader().headers, "Content-Type": "multipart/form-data" },
      });
      setImageUrl(res.data.url);
      setImageLabel(`Q${imageQNum} – ${imageType}`);
      setMsg("Image uploaded! Copy the label and URL below into your spreadsheet.");
    } catch (err) {
      setMsg("Failed: " + (err.response?.data?.error || err.message));
    }
  };
  
  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/mba/admin/questions/${id}`, authHeader());
      loadQuestions();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const renumberAll = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/mba/admin/questions/renumber`, {}, authHeader());
      setMsg(res.data.message);
      loadQuestions();
    } catch (err) {
      setMsg("Failed to renumber");
    }
  };

  const checkDuplicates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/mba/admin/questions/duplicates`, authHeader());
      if (!res.data.length) { setMsg("No duplicates found!"); return; }
      setMsg(`${res.data.length} duplicate group(s) found — check browser console (F12) for details`);
      console.log(res.data);
    } catch (err) {
      setMsg("Failed to check duplicates");
    }
  };

  return (
    <div>
            <div className="mb-6 border rounded p-4">
        <h3 className="font-semibold mb-2">Upload an Image (for a question or option)</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          <input
            type="number"
            placeholder="Question #"
            value={imageQNum}
            onChange={(e) => setImageQNum(e.target.value)}
            className="border rounded px-3 py-2 w-32"
          />
          <select value={imageType} onChange={(e) => setImageType(e.target.value)} className="border rounded px-3 py-2">
            <option value="Question">Question image</option>
            <option value="Option A">Option A image</option>
            <option value="Option B">Option B image</option>
            <option value="Option C">Option C image</option>
          </select>
        </div>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="mb-2" />
        <button onClick={uploadImage} className="bg-blue-500 hover:bg-blue-700 text-white rounded px-4 py-2 block mb-2">Upload Image</button>
        {imageUrl && (
          <div>
            <p className="text-sm font-semibold">{imageLabel}</p>
            <p className="text-sm break-all">{imageUrl}</p>
            <img src={imageUrl} alt="" className="max-w-xs mt-2" />
          </div>
        )}
      </div>
      <div className="mb-6 border rounded p-4">
        <h3 className="font-semibold mb-2">Bulk Upload Questions (Excel/CSV)</h3>
        <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
        <button onClick={uploadFile} className="bg-blue-500 hover:bg-blue-700 text-white rounded px-4 py-2">Upload Questions</button>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={renumberAll} className="bg-gray-200 rounded px-4 py-2 text-sm">Renumber All</button>
        <button onClick={checkDuplicates} className="bg-gray-200 rounded px-4 py-2 text-sm">Check Duplicates</button>
      </div>

      {msg && <p className="text-sm text-gray-700 mb-4">{msg}</p>}

      <p className="font-semibold mb-2">{questions.length} question(s) in the bank</p>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {questions.map((q) => (
          <div key={q._id} className="border rounded p-3">
            <p className="font-medium">{q.questionNumber ? `Q${q.questionNumber}: ` : ""}{q.text}</p>
            <p className="text-xs text-gray-500">Tags: {(q.tags || []).join(", ") || "none"} — Difficulty: {q.difficulty}</p>
            <button onClick={() => deleteQuestion(q._id)} className="text-red-600 text-sm mt-1">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------- TESTS ----------------
const TestsTab = () => {
  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("assignment");
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(60);
  const [tags, setTags] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [mode, setMode] = useState("random");
  const [msg, setMsg] = useState("");

  const loadTests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/mba/admin/tests`, authHeader());
      setTests(res.data);
    } catch (err) {
      setMsg("Failed to load tests");
    }
  };

  useEffect(() => { loadTests(); }, []);

  const createTest = async (e) => {
    e.preventDefault();
    setMsg("Creating...");
    try {
      await axios.post(`${BASE_URL}/api/mba/admin/tests`, {
        title, type,
        totalQuestions: Number(totalQuestions),
        timePerQuestionSeconds: Number(timePerQuestion),
        tags, difficulty, questionSelectionMode: mode,
      }, authHeader());
      setMsg("Test created as a draft!");
      setTitle("");
      loadTests();
    } catch (err) {
      setMsg("Failed: " + (err.response?.data?.error || err.message));
    }
  };

  const togglePublish = async (id, status) => {
    const action = status === "published" ? "unpublish" : "publish";
    await axios.patch(`${BASE_URL}/api/mba/admin/tests/${id}/${action}`, {}, authHeader());
    loadTests();
  };

  const grantAccess = async (id, usernamesStr) => {
    const usernames = usernamesStr.split(",").map((u) => u.trim()).filter(Boolean);
    try {
      const res = await axios.post(`${BASE_URL}/api/mba/admin/tests/${id}/grant-access`, { usernames }, authHeader());
      loadTests();
      return res.data.notFound;
    } catch (err) {
      alert("Failed to grant access");
    }
  };

  const grantRetake = async (id, username) => {
    try {
      await axios.post(`${BASE_URL}/api/mba/admin/tests/${id}/grant-retake`, { username }, authHeader());
      alert("Retake granted");
    } catch (err) {
      alert("Failed to grant retake");
    }
  };

  return (
    <div>
      <form onSubmit={createTest} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 border rounded p-4">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded px-3 py-2" required />
        <select value={type} onChange={(e) => setType(e.target.value)} className="border rounded px-3 py-2">
          <option value="assignment">Assignment</option>
          <option value="exam">Exam</option>
        </select>
        <input type="number" placeholder="Total questions" value={totalQuestions} onChange={(e) => setTotalQuestions(e.target.value)} className="border rounded px-3 py-2" />
        <input type="number" placeholder="Time per question (sec)" value={timePerQuestion} onChange={(e) => setTimePerQuestion(e.target.value)} className="border rounded px-3 py-2" />
        <input placeholder="Tags (optional, comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="border rounded px-3 py-2" />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="border rounded px-3 py-2 sm:col-span-2">
          <option value="random">Random draw per student</option>
          <option value="fixed">Same fixed set for everyone</option>
        </select>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white rounded px-4 py-2 sm:col-span-2">Create Test (Draft)</button>
      </form>

      {msg && <p className="text-sm text-gray-700 mb-4">{msg}</p>}

      <div className="space-y-4">
        {tests.map((test) => (
          <TestCard key={test._id} test={test} onTogglePublish={togglePublish} onGrantAccess={grantAccess} onGrantRetake={grantRetake} />
        ))}
      </div>
    </div>
  );
};

const TestCard = ({ test, onTogglePublish, onGrantAccess, onGrantRetake }) => {
  const [accessInput, setAccessInput] = useState("");
  const [retakeInput, setRetakeInput] = useState("");
  const [note, setNote] = useState("");

  const students = (test.allowedStudentIds || []).map((s) => `${s.fullName} (${s.username})`).join(", ") || "None yet";

  return (
    <div className="border rounded p-4">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <h4 className="font-semibold">
            {test.title}{" "}
            <span className={`text-xs rounded-full px-2 py-0.5 ml-2 ${test.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {test.status}
            </span>
          </h4>
          <p className="text-sm text-gray-600">{test.type} — {test.totalQuestions} questions — {test.timePerQuestionSeconds}s/question</p>
          <p className="text-xs text-gray-500 mt-1">Access: {students}</p>
        </div>
        <button onClick={() => onTogglePublish(test._id, test.status)} className="bg-gray-200 rounded px-3 py-1 text-sm">
          {test.status === "published" ? "Unpublish" : "Publish"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <input placeholder="Usernames, comma-separated" value={accessInput} onChange={(e) => setAccessInput(e.target.value)} className="border rounded px-2 py-1 text-sm flex-1 min-w-[160px]" />
        <button
          onClick={async () => {
            const notFound = await onGrantAccess(test._id, accessInput);
            setNote(notFound && notFound.length ? `Not found: ${notFound.join(", ")}` : "Access granted!");
            setAccessInput("");
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white rounded px-3 py-1 text-sm"
        >
          Grant Access
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <input placeholder="Username for retake" value={retakeInput} onChange={(e) => setRetakeInput(e.target.value)} className="border rounded px-2 py-1 text-sm flex-1 min-w-[160px]" />
        <button
          onClick={() => { onGrantRetake(test._id, retakeInput); setRetakeInput(""); }}
          className="bg-gray-200 rounded px-3 py-1 text-sm"
        >
          Grant Retake
        </button>
      </div>
      {note && <p className="text-xs text-gray-600 mt-2">{note}</p>}
    </div>
  );
};

export default MbaEvaluationPanel;
