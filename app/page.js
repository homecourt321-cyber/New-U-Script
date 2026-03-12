"use client";

import { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [goal, setGoal] = useState("");
  const [script, setScript] = useState("");
  const [copied, setCopied] = useState(false);

  function generateScript() {
    const generated = `Hey ${name || "[Name]"}, I wanted to reach out because you came to mind.

I know we know each other through ${relationship || "[relationship]"}, and I’ve been having more conversations lately with people who are looking for support around ${goal || "[goal]"}.

I’m working with a wellness company and sharing some simple tools that have been getting a lot of great feedback. Not sure if it’s for you, but would you be open to taking a quick look?`;

    setScript(generated);
    setCopied(false);
  }

  async function copyScript() {
    if (!script) return;

    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  }

  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "32px",
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>Let's Connect</h1>
      <p style={{ marginBottom: "24px", color: "#444" }}>
        Fill out a few details to generate a simple connection script.
      </p>

      <div style={{ display: "grid", gap: "12px" }}>
        <input
          type="text"
          placeholder="Prospect name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "12px", fontSize: "16px" }}
        />

        <input
          type="text"
          placeholder="How do you know them?"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          style={{ padding: "12px", fontSize: "16px" }}
        />

        <input
          type="text"
          placeholder="What are they interested in?"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={{ padding: "12px", fontSize: "16px" }}
        />

        <button
          onClick={generateScript}
          style={{
            padding: "14px",
            fontSize: "16px",
            backgroundColor: "#0E7C86",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Generate Script
        </button>
      </div>

      {script && (
        <div style={{ marginTop: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ margin: 0 }}>Your Script</h2>
            <button
              onClick={copyScript}
              style={{
                padding: "10px 14px",
                fontSize: "14px",
                backgroundColor: copied ? "#1F9D55" : "#0E7C86",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {copied ? "Copied!" : "Copy Script"}
            </button>
          </div>
          <textarea
            value={script}
            readOnly
            style={{
              width: "100%",
              minHeight: "220px",
              padding: "12px",
              fontSize: "15px",
            }}
          />
        </div>
      )}
    </main>
  );
}
