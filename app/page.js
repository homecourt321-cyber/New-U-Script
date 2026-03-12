import React, { useEffect, useMemo, useState } from "react";

const TOP_ID = "you";
const LEVEL_2_IDS = ["l2-1", "l2-2", "l2-3", "l2-4", "l2-5"];
const LEVEL_3_IDS = [
  "l3-1-1", "l3-1-2", "l3-1-3", "l3-1-4", "l3-1-5",
  "l3-4-1", "l3-4-2", "l3-4-3", "l3-4-4", "l3-4-5",
];

const STORAGE_KEY = "nul-525-structure-widget-v1";

function makeNode(id, label, level, parentId = null) {
  return {
    id,
    label,
    level,
    parentId,
    name: "",
    contact: "",
    startDate: "",
    type: "subscription",
    notes: "",
    active: false,
  };
}

function initialNodes() {
  const base = {
    [TOP_ID]: makeNode(TOP_ID, "YOU", 1),
  };

  LEVEL_2_IDS.forEach((id, index) => {
    base[id] = makeNode(id, String(index + 1), 2, TOP_ID);
  });

  [1, 4].forEach((leaderNum) => {
    for (let i = 1; i <= 5; i += 1) {
      const id = `l3-${leaderNum}-${i}`;
      base[id] = makeNode(id, String(i), 3, `l2-${leaderNum}`);
    }
  });

  return base;
}

function Circle({ node, selected, onClick }) {
  const bg = node.active ? "linear-gradient(180deg, #55d4cf 0%, #0f7c95 100%)" : "#cbd5e1";
  const color = node.active ? "#ffffff" : "#475569";
  const ring = selected ? "0 0 0 4px rgba(15,124,149,0.20)" : "0 8px 20px rgba(15,23,42,0.10)";

  return (
    <button
      onClick={onClick}
      style={{
        width: node.level === 1 ? 68 : node.level === 2 ? 58 : 50,
        height: node.level === 1 ? 68 : node.level === 2 ? 58 : 50,
        borderRadius: "999px",
        border: selected ? "2px solid #0f7c95" : "1px solid rgba(15,23,42,0.08)",
        background: bg,
        color,
        display: "grid",
        placeItems: "center",
        fontWeight: 800,
        fontSize: node.level === 1 ? 13 : node.level === 2 ? 16 : 15,
        boxShadow: ring,
        cursor: "pointer",
        transition: "all 160ms ease",
      }}
      aria-label={node.level === 1 ? "You" : `Node ${node.label}`}
    >
      {node.level === 1 ? "YOU" : node.label}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>{label}</span>
      {children}
    </label>
  );
}

export default function Mobile525StructureWidget() {
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedId, setSelectedId] = useState("l2-1");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setNodes({ ...initialNodes(), ...parsed });
      }
    } catch (e) {
      console.error("Failed to load saved structure", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
    } catch (e) {
      console.error("Failed to save structure", e);
    }
  }, [nodes]);

  const selected = useMemo(() => nodes[selectedId], [nodes, selectedId]);

  const updateNode = (patch) => {
    setNodes((prev) => ({
      ...prev,
      [selectedId]: {
        ...prev[selectedId],
        ...patch,
      },
    }));
  };

  const activeCountL2 = LEVEL_2_IDS.filter((id) => nodes[id]?.active).length;
  const activeCountL3 = LEVEL_3_IDS.filter((id) => nodes[id]?.active).length;

  const resetAll = () => {
    const fresh = initialNodes();
    setNodes(fresh);
    setSelectedId("l2-1");
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, Arial, sans-serif", color: "#0f172a" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
        <div style={{
          background: "linear-gradient(135deg, #083344 0%, #0f7c95 55%, #57d3cf 100%)",
          color: "white",
          borderRadius: 24,
          padding: 18,
          boxShadow: "0 14px 30px rgba(15,23,42,0.15)",
          marginBottom: 14,
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", opacity: 0.85 }}>NEW U LIFE</div>
          <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.05, marginTop: 8 }}>5-2-5 Structure Tracker</div>
          <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.45, opacity: 0.95 }}>
            Tap a circle to manage contact info, notes, and active status.
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255,255,255,0.14)", padding: "8px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
              Active 5: {activeCountL2}/5
            </div>
            <div style={{ background: "rgba(255,255,255,0.14)", padding: "8px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
              Active depth: {activeCountL3}/10
            </div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: 16, boxShadow: "0 10px 24px rgba(15,23,42,0.08)", border: "1px solid rgba(15,23,42,0.06)" }}>
          <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
            <Circle node={nodes[TOP_ID]} selected={selectedId === TOP_ID} onClick={() => setSelectedId(TOP_ID)} />

            <div style={{ width: 3, height: 24, background: "#0f7c95", borderRadius: 999 }} />

            <div style={{ width: "100%", height: 3, background: "#0f7c95", borderRadius: 999, marginBottom: 10 }} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, width: "100%" }}>
              {LEVEL_2_IDS.map((id) => (
                <div key={id} style={{ display: "grid", justifyItems: "center", gap: 8 }}>
                  <Circle node={nodes[id]} selected={selectedId === id} onClick={() => setSelectedId(id)} />
                  {id === "l2-1" || id === "l2-4" ? (
                    <>
                      <div style={{ width: 3, height: 22, background: "#0f7c95", borderRadius: 999 }} />
                      <div style={{ width: "100%", height: 3, background: "#0f7c95", borderRadius: 999 }} />
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, width: "100%" }}>
                        {Array.from({ length: 5 }).map((_, i) => {
                          const childId = `l3-${id === "l2-1" ? 1 : 4}-${i + 1}`;
                          return (
                            <div key={childId} style={{ display: "grid", justifyItems: "center" }}>
                              <Circle node={nodes[childId]} selected={selectedId === childId} onClick={() => setSelectedId(childId)} />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div style={{ height: 83 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: 16, boxShadow: "0 10px 24px rgba(15,23,42,0.08)", border: "1px solid rgba(15,23,42,0.06)", marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", color: "#0f7c95" }}>SELECTED CIRCLE</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>
                {selected?.level === 1 ? "YOU" : `Position ${selected?.label}`}
              </div>
            </div>
            <button
              onClick={resetAll}
              style={{ border: "1px solid #cbd5e1", background: "#fff", color: "#334155", borderRadius: 12, padding: "10px 12px", fontWeight: 700, fontSize: 13 }}
            >
              Reset All
            </button>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <Field label="Name">
              <input value={selected?.name || ""} onChange={(e) => updateNode({ name: e.target.value })} style={inputStyle} placeholder="Enter full name" />
            </Field>

            <Field label="Contact Info">
              <input value={selected?.contact || ""} onChange={(e) => updateNode({ contact: e.target.value })} style={inputStyle} placeholder="Phone or email" />
            </Field>

            <Field label="Start Date">
              <input type="date" value={selected?.startDate || ""} onChange={(e) => updateNode({ startDate: e.target.value })} style={inputStyle} />
            </Field>

            <Field label="Getting Started With">
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  ["enrollment", "Enrollment Pack"],
                  ["subscription", "Subscription"],
                ].map(([value, label]) => (
                  <label key={value} style={radioWrapStyle}>
                    <input
                      type="radio"
                      name="type"
                      checked={selected?.type === value}
                      onChange={() => updateNode({ type: value })}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Status">
              <button
                onClick={() => updateNode({ active: !selected?.active })}
                style={{
                  ...toggleStyle,
                  background: selected?.active ? "#0f7c95" : "#e2e8f0",
                  color: selected?.active ? "white" : "#334155",
                }}
              >
                {selected?.active ? "Active" : "Inactive"}
              </button>
            </Field>

            <Field label="Notes">
              <textarea
                value={selected?.notes || ""}
                onChange={(e) => updateNode({ notes: e.target.value })}
                style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
                placeholder="Add coaching notes, next follow-up, or goals"
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  padding: "12px 14px",
  fontSize: 16,
  background: "#fff",
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
};

const radioWrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  fontSize: 14,
  fontWeight: 700,
  color: "#334155",
};

const toggleStyle = {
  width: "100%",
  border: "none",
  borderRadius: 14,
  padding: "13px 14px",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
};
