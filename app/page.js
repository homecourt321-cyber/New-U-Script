"use client";

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const TOP_ID = "you";
const LEVEL_2_IDS = ["l2-1", "l2-2", "l2-3", "l2-4", "l2-5"];
const LEVEL_3_GROUPS = {
  "l2-1": ["l3-1-1", "l3-1-2", "l3-1-3", "l3-1-4", "l3-1-5"],
  "l2-4": ["l3-4-1", "l3-4-2", "l3-4-3", "l3-4-4", "l3-4-5"],
};
const LEVEL_3_IDS = Object.values(LEVEL_3_GROUPS).flat();
const STORAGE_KEY = "nul-525-structure-widget-v2";

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

  Object.entries(LEVEL_3_GROUPS).forEach(([parentId, ids]) => {
    ids.forEach((id, index) => {
      base[id] = makeNode(id, String(index + 1), 3, parentId);
    });
  });

  return base;
}

function completionPct(count, total) {
  return Math.round((count / total) * 100);
}

function Circle({ node, selected, onClick }) {
  const activeBg = "linear-gradient(180deg, #58d5cf 0%, #0f7c95 100%)";
  const inactiveBg = "linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%)";

  return (
    <button
      onClick={onClick}
      style={{
        width: node.level === 1 ? 72 : node.level === 2 ? 58 : 50,
        height: node.level === 1 ? 72 : node.level === 2 ? 58 : 50,
        borderRadius: 999,
        border: selected ? "2px solid #0f7c95" : "1px solid rgba(15,23,42,0.08)",
        background: node.active ? activeBg : inactiveBg,
        color: node.active ? "#fff" : "#475569",
        display: "grid",
        placeItems: "center",
        fontWeight: 800,
        fontSize: node.level === 1 ? 13 : node.level === 2 ? 16 : 15,
        boxShadow: selected
          ? "0 0 0 5px rgba(15,124,149,0.18), 0 14px 28px rgba(15,23,42,0.14)"
          : "0 8px 18px rgba(15,23,42,0.10)",
        cursor: "pointer",
        transition: "transform 180ms ease, box-shadow 180ms ease, background 180ms ease, border-color 180ms ease",
        transform: selected ? "scale(1.06)" : "scale(1)",
      }}
      aria-label={node.level === 1 ? "You" : `Position ${node.label}`}
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

function StatPill({ label, value }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.14)",
        padding: "8px 12px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {label}: {value}
    </div>
  );
}

function ProgressBlock({ title, count, total, accent = "#0f7c95" }) {
  const pct = completionPct(count, total);
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 14,
        border: "1px solid rgba(15,23,42,0.06)",
        boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{title}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: accent }}>{count}/{total}</div>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${accent}, #58d5cf)`,
            transition: "width 220ms ease",
          }}
        />
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#64748b", fontWeight: 600 }}>{pct}% complete</div>
    </div>
  );
}

export default function Mobile525StructureWidget() {
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedId, setSelectedId] = useState("l2-1");
  const [expandedGroups, setExpandedGroups] = useState({ "l2-1": true, "l2-4": true });
  const [activeTab, setActiveTab] = useState("details");
  const tabsRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setNodes({ ...initialNodes(), ...(parsed.nodes || parsed) });
        if (parsed.expandedGroups) setExpandedGroups(parsed.expandedGroups);
      }
    } catch (e) {
      console.error("Failed to load saved structure", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, expandedGroups }));
    } catch (e) {
      console.error("Failed to save structure", e);
    }
  }, [nodes, expandedGroups]);

  const selected = useMemo(() => nodes[selectedId], [nodes, selectedId]);
  const activeCountL2 = LEVEL_2_IDS.filter((id) => nodes[id]?.active).length;
  const activeCountL3 = LEVEL_3_IDS.filter((id) => nodes[id]?.active).length;
  const leaderOneCount = LEVEL_3_GROUPS["l2-1"].filter((id) => nodes[id]?.active).length;
  const leaderFourCount = LEVEL_3_GROUPS["l2-4"].filter((id) => nodes[id]?.active).length;

  const updateNode = (patch) => {
    setNodes((prev) => ({
      ...prev,
      [selectedId]: {
        ...prev[selectedId],
        ...patch,
      },
    }));
  };

  const resetAll = () => {
    const fresh = initialNodes();
    setNodes(fresh);
    setSelectedId("l2-1");
    setExpandedGroups({ "l2-1": true, "l2-4": true });
    setActiveTab("details");
    localStorage.removeItem(STORAGE_KEY);
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tabsRef.current) {
      tabsRef.current.scrollTo({ left: tab === "details" ? 0 : 200, behavior: "smooth" });
    }
  };

  const handleSwipeStart = useRef(null);
  const onTouchStart = (e) => {
    handleSwipeStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (handleSwipeStart.current == null) return;
    const delta = e.changedTouches[0].clientX - handleSwipeStart.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) setActiveTab("progress");
      if (delta > 0) setActiveTab("details");
    }
    handleSwipeStart.current = null;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, Arial, sans-serif", color: "#0f172a" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
        <div
          style={{
            background: "linear-gradient(135deg, #083344 0%, #0f7c95 55%, #57d3cf 100%)",
            color: "white",
            borderRadius: 24,
            padding: 18,
            boxShadow: "0 14px 30px rgba(15,23,42,0.15)",
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", opacity: 0.85 }}>NEW U LIFE</div>
          <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.05, marginTop: 8 }}>5-2-5 Structure Tracker</div>
          <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.45, opacity: 0.95 }}>
            Tap any circle to track activity, details, notes, and progress.
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <StatPill label="Active 5" value={`${activeCountL2}/5`} />
            <StatPill label="Active depth" value={`${activeCountL3}/10`} />
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: 16, boxShadow: "0 10px 24px rgba(15,23,42,0.08)", border: "1px solid rgba(15,23,42,0.06)" }}>
          <div style={{ display: "grid", justifyItems: "center", gap: 16 }}>
            <Circle node={nodes[TOP_ID]} selected={selectedId === TOP_ID} onClick={() => setSelectedId(TOP_ID)} />
            <div style={{ width: 3, height: 20, background: "#0f7c95", borderRadius: 999 }} />

            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, width: "100%", flexWrap: "wrap" }}>
              {LEVEL_2_IDS.map((id) => {
                const isExpandable = !!LEVEL_3_GROUPS[id];
                const isExpanded = expandedGroups[id];
                const childIds = LEVEL_3_GROUPS[id] || [];

                return (
                  <div key={id} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 18%", minWidth: 60 }}>
                    <Circle node={nodes[id]} selected={selectedId === id} onClick={() => setSelectedId(id)} />

                    {isExpandable ? (
                      <div style={{ marginTop: 14, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <button
                          onClick={() => toggleGroup(id)}
                          style={{
                            border: "1px solid #cbd5e1",
                            background: "#f8fafc",
                            borderRadius: 999,
                            padding: "6px 10px",
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#0f7c95",
                            cursor: "pointer",
                          }}
                        >
                          {isExpanded ? "Hide 5" : "Show 5"}
                        </button>

                        {isExpanded && (
                          <>
                            <div style={{ width: 3, height: 16, background: "#0f7c95", borderRadius: 999 }} />
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                              {childIds.map((childId) => (
                                <Circle
                                  key={childId}
                                  node={nodes[childId]}
                                  selected={selectedId === childId}
                                  onClick={() => setSelectedId(childId)}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div style={{ height: 110 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          style={{ background: "white", borderRadius: 24, padding: 16, boxShadow: "0 10px 24px rgba(15,23,42,0.08)", border: "1px solid rgba(15,23,42,0.06)", marginTop: 14 }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
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

          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <button onClick={() => switchTab("details")} style={{ ...tabStyle, ...(activeTab === "details" ? tabActiveStyle : {}) }}>Details</button>
            <button onClick={() => switchTab("progress")} style={{ ...tabStyle, ...(activeTab === "progress" ? tabActiveStyle : {}) }}>Progress</button>
          </div>

          <div ref={tabsRef} style={{ overflow: "hidden" }}>
            {activeTab === "details" ? (
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
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                <ProgressBlock title="Your 5 Active" count={activeCountL2} total={5} />
                <ProgressBlock title="Leader 1 Depth" count={leaderOneCount} total={5} accent="#155e75" />
                <ProgressBlock title="Leader 4 Depth" count={leaderFourCount} total={5} accent="#0e7490" />
                <ProgressBlock title="Total Active Depth" count={activeCountL3} total={10} accent="#0f766e" />
              </div>
            )}
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

const tabStyle = {
  flex: 1,
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  color: "#334155",
  borderRadius: 12,
  padding: "11px 12px",
  fontWeight: 800,
  fontSize: 14,
  cursor: "pointer",
};

const tabActiveStyle = {
  background: "#0f7c95",
  color: "#fff",
  borderColor: "#0f7c95",
};

