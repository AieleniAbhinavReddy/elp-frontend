import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const CompilerPage = () => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(
    '# Write your Python code here\nprint("Hello, World!")'
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- START: ADD NEW LANGUAGES HERE ---
  const languageOptions = [
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
  ];

  const defaultCode = {
    python: '# Write your Python code here\nprint("Hello, World!")',
    javascript:
      '// Write your JavaScript code here\nconsole.log("Hello, World!");',
    java: `// The class name must be Main
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    c: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
    cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!";
    return 0;
}`,
  };
  // --- END: ADD NEW LANGUAGES HERE ---

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(defaultCode[newLang] || "");
  };

  const handleRunCode = async () => {
    setLoading(true);
    setOutput("");
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/compiler/run",
        {
          language,
          code,
          input,
        }
      );

      if (response.data.error && response.data.error.trim() !== "") {
        setError(response.data.error);
      } else {
        setOutput(response.data.output);
      }
    } catch (err) {
      setError(
        "Failed to connect to the compiler service. Please check your connection and ensure the backend is running."
      );
      console.error(err);
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
              {output && <pre className="text-dark mb-0">{output}</pre>}
              {error && <pre className="text-danger mb-0">{error}</pre>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompilerPage;
