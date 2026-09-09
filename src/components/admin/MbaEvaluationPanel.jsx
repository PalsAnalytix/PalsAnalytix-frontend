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
        {["students", "questions", "tests", "performance"].map((t) => (
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
      {tab === "performance" && <PerformanceTab />}
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

  // Batch image upload state
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchRows, setBatchRows] = useState([]);
  const [batchResults, setBatchResults] = useState([]);
  const [batchUploading, setBatchUploading] = useState(false);
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
    const handleBatchFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setBatchFiles(files);
    setBatchRows(files.map((f, i) => ({ file: f, qNum: i + 1, qType: "Question", status: "Not uploaded" })));
    setBatchResults([]);
  };

  const updateBatchRow = (i, field, value) => {
    setBatchRows((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const uploadBatch = async () => {
    setBatchUploading(true);
    const results = [];
    for (let i = 0; i < batchRows.length; i++) {
      const row = batchRows[i];
      updateBatchRow(i, "status", "Uploading...");
      const formData = new FormData();
      formData.append("image", row.file);
      try {
        const res = await axios.post(`${BASE_URL}/api/mba/admin/upload/image`, formData, {
          headers: { ...authHeader().headers, "Content-Type": "multipart/form-data" },
        });
        updateBatchRow(i, "status", "Done");
        results.push({ label: `Q${row.qNum} – ${row.qType}`, filename: row.file.name, url: res.data.url });
      } catch (err) {
        updateBatchRow(i, "status", "Failed");
      }
    }
    setBatchResults(results);
    setBatchUploading(false);
  };

  const copyBatchTable = () => {
    const tsv = batchResults.map((r) => `${r.label}\t${r.url}`).join("\n");
    navigator.clipboard.writeText(tsv).then(() => {
      alert("Copied! Paste into a spare area of your spreadsheet (two columns: label, URL).");
    });
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

      const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [selectedForDelete, setSelectedForDelete] = useState(new Set());

  const checkDuplicates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/mba/admin/questions/duplicates`, authHeader());
      setDuplicateGroups(res.data);
      setMsg(res.data.length ? `${res.data.length} duplicate group(s) found — see below` : "No duplicates found!");
    } catch (err) {
      setMsg("Failed to check duplicates");
    }
  };

    const deleteFromDuplicates = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/mba/admin/questions/${id}`, authHeader());
      checkDuplicates();
      loadQuestions();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const toggleSelected = (id) => {
    setSelectedForDelete((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deleteSelected = async () => {
    if (!selectedForDelete.size) return;
    if (!window.confirm(`Delete ${selectedForDelete.size} selected question(s)? This cannot be undone.`)) return;
    setMsg("Deleting...");
    for (const id of selectedForDelete) {
      try {
        await axios.delete(`${BASE_URL}/api/mba/admin/questions/${id}`, authHeader());
      } catch (err) {
        // continue even if one fails
      }
    }
    setSelectedForDelete(new Set());
    checkDuplicates();
    loadQuestions();
    setMsg("Selected questions deleted.");
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
        <h3 className="font-semibold mb-2">Batch Upload Images</h3>
        <p className="text-xs text-gray-500 mb-2">Select multiple images at once, label each with its question number and type, then upload them all together.</p>
        <input type="file" accept="image/*" multiple onChange={handleBatchFileSelect} className="mb-3" />

        {batchRows.length > 0 && (
          <div className="space-y-2 mb-3">
            {batchRows.map((row, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 text-sm border-b pb-2">
                <span className="w-40 truncate">{row.file.name}</span>
                <input
                  type="number"
                  value={row.qNum}
                  onChange={(e) => updateBatchRow(i, "qNum", e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="Q#"
                />
                <select
                  value={row.qType}
                  onChange={(e) => updateBatchRow(i, "qType", e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="Question">Question</option>
                  <option value="Option A">Option A</option>
                  <option value="Option B">Option B</option>
                  <option value="Option C">Option C</option>
                </select>
                <span className="text-gray-500">{row.status}</span>
              </div>
            ))}
            <button
              onClick={uploadBatch}
              disabled={batchUploading}
              className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded px-4 py-2"
            >
              {batchUploading ? "Uploading..." : "Upload All Images"}
            </button>
          </div>
        )}

        {batchResults.length > 0 && (
          <div>
            <button onClick={copyBatchTable} className="bg-gray-200 rounded px-4 py-2 text-sm mb-2">Copy table</button>
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Label</th>
                  <th className="border px-2 py-1">File</th>
                  <th className="border px-2 py-1">URL</th>
                  <th className="border px-2 py-1">Preview</th>
                </tr>
              </thead>
              <tbody>
                {batchResults.map((r, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{r.label}</td>
                    <td className="border px-2 py-1">{r.filename}</td>
                    <td className="border px-2 py-1 break-all">{r.url}</td>
                    <td className="border px-2 py-1"><img src={r.url} alt="" className="w-12 h-12 object-cover" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
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

           {duplicateGroups.length > 0 && (
        <div className="mb-6 space-y-3">
          <button
            onClick={deleteSelected}
            disabled={!selectedForDelete.size}
            className="bg-red-600 disabled:bg-gray-300 text-white rounded px-4 py-2 text-sm mb-2"
          >
            Delete Selected ({selectedForDelete.size})
          </button>
          {duplicateGroups.map((g, i) => (
            <div key={i} className="border border-yellow-400 bg-yellow-50 rounded p-3">
              <p className="font-medium mb-2">"{g._id}" — appears {g.count} times:</p>
              <ul className="space-y-1">
                {g.questions.map((q) => (
                  <li key={q.id} className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedForDelete.has(q.id)}
                      onChange={() => toggleSelected(q.id)}
                    />
                    <span className="flex-1">Q{q.questionNumber || "?"}</span>
                    <button onClick={() => deleteFromDuplicates(q.id)} className="text-red-600 hover:underline">Delete this one</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
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

// ---------------- PERFORMANCE ----------------
const PerformanceTab = () => {
  const [attempts, setAttempts] = useState([]);
  const [msg, setMsg] = useState("");
  const [studentFilter, setStudentFilter] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/mba/admin/performance`, authHeader());
        setAttempts(res.data);
      } catch (err) {
        setMsg("Failed to load performance data");
      }
    };
    load();
  }, []);

  const summary = {};
  attempts.forEach((a) => {
    const key = a.studentUsername;
    if (!summary[key]) {
      summary[key] = { fullName: a.studentFullName, username: a.studentUsername, count: 0, totalScore: 0 };
    }
    summary[key].count += 1;
    summary[key].totalScore += a.score;
  });
  const summaryRows = Object.values(summary).map((s) => ({
    ...s,
    avgScore: Math.round(s.totalScore / s.count),
  }));

  const filteredAttempts = studentFilter
    ? attempts.filter((a) => a.studentUsername === studentFilter)
    : attempts;

  return (
    <div>
      {msg && <p className="text-sm text-red-600 mb-4">{msg}</p>}

      <h3 className="font-semibold mb-2">By Student</h3>
      <table className="min-w-full bg-white border text-sm mb-8">
        <thead>
          <tr>
            <th className="border px-2 py-1">Student</th>
            <th className="border px-2 py-1">Username</th>
            <th className="border px-2 py-1">Tests Taken</th>
            <th className="border px-2 py-1">Average Score</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {summaryRows.map((s) => (
            <tr key={s.username}>
              <td className="border px-2 py-1">{s.fullName}</td>
              <td className="border px-2 py-1">{s.username}</td>
              <td className="border px-2 py-1 text-center">{s.count}</td>
              <td className="border px-2 py-1 text-center">{s.avgScore}%</td>
              <td className="border px-2 py-1">
                <button onClick={() => setStudentFilter(s.username)} className="text-blue-600 hover:underline">
                  View history
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">
          {studentFilter ? `History for ${studentFilter}` : "All Attempts"}
        </h3>
        {studentFilter && (
          <button onClick={() => setStudentFilter("")} className="text-sm text-gray-600 hover:underline">
            Clear filter
          </button>
        )}
      </div>
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1">Student</th>
            <th className="border px-2 py-1">Test</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Score</th>
            <th className="border px-2 py-1">Correct</th>
            <th className="border px-2 py-1">Attempt #</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Auto-submitted?</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttempts.map((a) => (
            <tr key={a.attemptId}>
              <td className="border px-2 py-1">{a.studentFullName} ({a.studentUsername})</td>
              <td className="border px-2 py-1">{a.testTitle}</td>
              <td className="border px-2 py-1 capitalize">{a.testType}</td>
              <td className="border px-2 py-1 text-center">{a.score}%</td>
              <td className="border px-2 py-1 text-center">{a.totalCorrect}/{a.totalQuestions}</td>
              <td className="border px-2 py-1 text-center">{a.attemptNumber}</td>
              <td className="border px-2 py-1">{new Date(a.submittedAt).toLocaleString()}</td>
              <td className="border px-2 py-1 text-center">{a.autoSubmitted ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MbaEvaluationPanel;
