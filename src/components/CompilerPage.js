import React, { useState } from "react";
import Editor from "@monaco-editor/react";
// Import the new function from your api.js file
import { apiExecuteCode } from "../services/api"; // Adjust path to api.js if necessary

const CompilerPage = () => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(
    '# Write your Python code here\nprint("Hello, World!")',
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [memory, setMemory] = useState("");
  const [cpuTime, setCpuTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Supported languages: java, python, javascript, cpp
  const languageOptions = [
    { value: "python", label: "Python 3" },
    { value: "javascript", label: "JavaScript (Node.js)" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
  ];

  const defaultCode = {
    python: '# Write your Python code here\nprint("Hello, World!")',
    javascript:
      '// Write your JavaScript code here\nconsole.log("Hello, World!");',
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(defaultCode[newLang] || "");
  };

  const handleRunCode = async () => {
    setLoading(true);
    setOutput("");
    setError("");
    setMemory("");
    setCpuTime("");
    try {
      // Call backend endpoint with exact parameters
      const response = await apiExecuteCode({
        script: code,
        language: language,
        versionIndex: 0,  // Integer, not string
        stdin: input,
      });

      const data = response.data;
      // Backend response: { output, error, statusCode, memory, cpuTime }
      // statusCode: "200" for success, "-1" for errors
      
      if (data.statusCode === "-1" || data.statusCode === -1) {
        // Execution error
        setError(data.error || "Execution failed");
        setOutput("");
      } else if (data.statusCode === "200" || data.statusCode === 200) {
        // Successful execution
        setOutput(data.output || "Code executed successfully with no output.");
        setError("");
        setMemory(data.memory || "");
        setCpuTime(data.cpuTime || "");
      } else {
        // Unexpected status code
        setError(`Unexpected status: ${data.statusCode}`);
      }
    } catch (err) {
      // Handle network and other errors
      const errorMessage = 
        err.normalizedError?.message ||
        err.response?.data?.error ||
        err.response?.data?.message || 
        err.message || 
        "Network error or server unavailable";
      setError(errorMessage);
      console.error("Execute code error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid p-4"
      style={{ height: "calc(100vh - 60px)" }}
    >
      <div className="row h-100">
        <div className="col-md-8 d-flex flex-column h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">Online Code Editor</h3>
            <div>
              <select
                className="form-select d-inline-block me-2"
                style={{ width: "150px" }}
                value={language}
                onChange={handleLanguageChange}
              >
                {languageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-success"
                onClick={handleRunCode}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span className="ms-1">Running...</span>
                  </>
                ) : (
                  "▶ Run Code"
                )}
              </button>
            </div>
          </div>
          <div className="flex-grow-1 border rounded">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
            />
          </div>
        </div>

        <div className="col-md-4 d-flex flex-column h-100">
          <div className="d-flex flex-column h-50">
            <h5>Input</h5>
            <textarea
              className="form-control flex-grow-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter standard input (stdin) here..."
              style={{ resize: "none", fontFamily: "monospace" }}
            ></textarea>
          </div>
          <div className="d-flex flex-column h-50 mt-3">
            <h5>Output</h5>
            <div
              className="p-3 border rounded flex-grow-1 bg-light"
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                overflowY: "auto",
              }}
            >
              {loading && <p className="text-muted">Executing...</p>}
              {error && <pre className="text-danger mb-2">{error}</pre>}
              {output && <pre className="text-dark mb-0">{output}</pre>}
              {cpuTime && <p className="text-muted small mt-2">⏱️ Time: {cpuTime}s | 💾 Memory: {memory} bytes</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompilerPage;
