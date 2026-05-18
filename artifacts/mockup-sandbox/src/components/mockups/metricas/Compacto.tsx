import { useState } from "react";

const STATS = {
  pendentes: 8,
  em_analise: 3,
  aprovadas: 14,
  rejeitadas: 4,
  totalUsuarios: 37,
  totalMensagens: 21,
  totalVideos: 12,
};

const STATUS_COLORS: Record<string, string> = {
  pendentes: "#cfff04",
  em_analise: "#00ffff",
  aprovadas: "#4ade80",
  rejeitadas: "#f87171",
};

const STATUS_LABELS: Record<string, string> = {
  pendentes: "Pendentes",
  em_analise: "Em Análise",
  aprovadas: "Aprovadas",
  rejeitadas: "Rejeitadas",
};

const PAUTAS_RECENTES = [
  { titulo: "Cobertura da Semana Acadêmica", autor: "Ana Lima", status: "aprovada", data: "17/05" },
  { titulo: "Entrevista com Reitor", autor: "Pedro Souza", status: "em_analise", data: "16/05" },
  { titulo: "Projeto de Extensão STEM", autor: "Julia Melo", status: "pendente", data: "15/05" },
  { titulo: "Festival de Cinema Universitário", autor: "Carlos R.", status: "rejeitada", data: "14/05" },
  { titulo: "Debate Sobre Sustentabilidade", autor: "Mariana A.", status: "aprovada", data: "13/05" },
];

function DonutChart() {
  const total = STATS.pendentes + STATS.em_analise + STATS.aprovadas + STATS.rejeitadas;
  const slices = [
    { key: "aprovadas", value: STATS.aprovadas, color: "#4ade80" },
    { key: "pendentes", value: STATS.pendentes, color: "#cfff04" },
    { key: "em_analise", value: STATS.em_analise, color: "#00ffff" },
    { key: "rejeitadas", value: STATS.rejeitadas, color: "#f87171" },
  ];

  const R = 80;
  const cx = 100;
  const cy = 100;
  let cumulative = 0;

  const paths = slices.map(({ key, value, color }) => {
    const pct = value / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const endAngle = (cumulative + pct) * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;

    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle);
    const y2 = cy + R * Math.sin(endAngle);
    const largeArc = pct > 0.5 ? 1 : 0;

    return (
      <path
        key={key}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={color}
        opacity={0.9}
      />
    );
  });

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        {paths}
        <circle cx={cx} cy={cy} r={48} fill="#111" />
        <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize={24} fontWeight="bold">
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={11}>
          pautas
        </text>
      </svg>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    aprovada:  { label: "Aprovada",   color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
    pendente:  { label: "Pendente",   color: "#cfff04", bg: "rgba(207,255,4,0.1)"   },
    em_analise:{ label: "Em Análise", color: "#00ffff", bg: "rgba(0,255,255,0.1)"   },
    rejeitada: { label: "Rejeitada",  color: "#f87171", bg: "rgba(248,113,113,0.12)"},
  };
  const s = map[status] ?? { label: status, color: "#fff", bg: "rgba(255,255,255,0.1)" };
  return (
    <span style={{
      fontSize: 11, padding: "3px 9px", borderRadius: 20,
      color: s.color, background: s.bg, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}

export function Compacto() {
  const [active, setActive] = useState<string | null>(null);

  const cards = [
    { label: "Usuários",  value: STATS.totalUsuarios,   color: "#cfff04" },
    { label: "Vídeos",    value: STATS.totalVideos,      color: "#00ffff" },
    { label: "Mensagens", value: STATS.totalMensagens,   color: "#a78bfa" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#000", color: "#fff",
      fontFamily: "Inter, system-ui, sans-serif", padding: 32,
    }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ color: "#cfff04", fontWeight: 900, fontSize: 20, letterSpacing: 2 }}>TV ELOS</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>/ Métricas</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>Atualizado em tempo real · Maio 2026</p>
      </div>

      {/* Top stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {cards.map(c => (
          <div key={c.label} style={{
            background: "#111", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12, padding: "18px 20px",
          }}>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
              {c.label}
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Main area: donut + legend + table */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start" }}>

        {/* Left: donut + legend */}
        <div style={{
          background: "#111", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12, padding: 24, textAlign: "center", minWidth: 220,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 16, textAlign: "left" }}>
            PAUTAS POR STATUS
          </div>
          <DonutChart />
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <div
                key={key}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer", padding: "4px 6px", borderRadius: 6,
                  background: active === key ? "rgba(255,255,255,0.05)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={() => setActive(key)}
                onMouseLeave={() => setActive(null)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_COLORS[key], flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: STATUS_COLORS[key] }}>
                  {STATS[key as keyof typeof STATS]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: recent pautas */}
        <div style={{
          background: "#111", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12, padding: 24,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
            ÚLTIMAS PAUTAS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {PAUTAS_RECENTES.map((p, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: i < PAUTAS_RECENTES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.titulo}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    {p.autor} · {p.data}
                  </div>
                </div>
                <div style={{ marginLeft: 12, flexShrink: 0 }}>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
