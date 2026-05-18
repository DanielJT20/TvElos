const STATS = {
  pendentes: 8,
  em_analise: 3,
  aprovadas: 14,
  rejeitadas: 4,
  totalUsuarios: 37,
  totalMensagens: 21,
  totalVideos: 12,
};

const HISTORICO = [
  { mes: "Jan", aprovadas: 6,  pendentes: 4,  rejeitadas: 1 },
  { mes: "Fev", aprovadas: 9,  pendentes: 5,  rejeitadas: 2 },
  { mes: "Mar", aprovadas: 11, pendentes: 6,  rejeitadas: 1 },
  { mes: "Abr", aprovadas: 10, pendentes: 7,  rejeitadas: 3 },
  { mes: "Mai", aprovadas: 14, pendentes: 8,  rejeitadas: 4 },
];

const ATIVIDADE = [
  { tipo: "pauta", msg: "Ana Lima enviou uma nova pauta",         tempo: "2 min atrás",  cor: "#cfff04" },
  { tipo: "video", msg: "Novo vídeo publicado: Semana Acadêmica", tempo: "18 min atrás", cor: "#00ffff" },
  { tipo: "user",  msg: "Carlos R. criou uma conta",              tempo: "1h atrás",     cor: "#a78bfa" },
  { tipo: "pauta", msg: 'Pauta "Entrevista Reitor" aprovada',     tempo: "2h atrás",     cor: "#4ade80" },
  { tipo: "msg",   msg: "Nova mensagem de contato recebida",      tempo: "3h atrás",     cor: "#fb923c" },
];

const BAR_MAX = Math.max(...HISTORICO.map(h => h.aprovadas + h.pendentes + h.rejeitadas));

function BarChart() {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 140, padding: "0 4px" }}>
      {HISTORICO.map((h, i) => {
        const total = h.aprovadas + h.pendentes + h.rejeitadas;
        const scale = (v: number) => (v / BAR_MAX) * 120;
        const isLast = i === HISTORICO.length - 1;
        return (
          <div key={h.mes} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              height: 120, width: "100%", gap: 1, borderRadius: 4, overflow: "hidden",
              outline: isLast ? "1px solid rgba(207,255,4,0.4)" : "none",
            }}>
              <div style={{ background: "#f87171", height: scale(h.rejeitadas), width: "100%", transition: "height 0.3s" }} />
              <div style={{ background: "#cfff04", height: scale(h.pendentes), width: "100%", transition: "height 0.3s" }} />
              <div style={{ background: "#4ade80", height: scale(h.aprovadas), width: "100%", transition: "height 0.3s" }} />
            </div>
            <span style={{
              fontSize: 11, color: isLast ? "#cfff04" : "rgba(255,255,255,0.4)",
              fontWeight: isLast ? 700 : 400,
            }}>
              {h.mes}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: color,
          borderRadius: 4, transition: "width 0.4s",
        }} />
      </div>
    </div>
  );
}

function ActivityDot({ color }: { color: string }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
      background: `${color}22`, border: `1.5px solid ${color}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
    </div>
  );
}

function MetricCard({ label, value, color, delta }: { label: string; value: number; color: string; delta?: string }) {
  return (
    <div style={{
      background: "#111", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12, padding: "18px 22px",
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 36, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      {delta && (
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>{delta}</div>
      )}
    </div>
  );
}

export function Completo() {
  const totalPautas = STATS.pendentes + STATS.em_analise + STATS.aprovadas + STATS.rejeitadas;

  return (
    <div style={{
      minHeight: "100vh", background: "#000", color: "#fff",
      fontFamily: "Inter, system-ui, sans-serif", padding: 32,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ color: "#cfff04", fontWeight: 900, fontSize: 20, letterSpacing: 2 }}>TV ELOS</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>/ Painel de Métricas</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Visão geral · Maio 2026</p>
        </div>
        <div style={{
          background: "rgba(207,255,4,0.08)", border: "1px solid rgba(207,255,4,0.2)",
          borderRadius: 8, padding: "8px 16px", fontSize: 12, color: "#cfff04",
        }}>
          ● Ao vivo
        </div>
      </div>

      {/* 4 metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <MetricCard label="Total de Pautas"  value={totalPautas}          color="#cfff04" delta="↑ 4 este mês" />
        <MetricCard label="Aprovadas"        value={STATS.aprovadas}      color="#4ade80" delta="Taxa: 48%" />
        <MetricCard label="Usuários"         value={STATS.totalUsuarios}  color="#00ffff" delta="↑ 6 novos" />
        <MetricCard label="Vídeos"           value={STATS.totalVideos}    color="#a78bfa" delta="↑ 2 este mês" />
      </div>

      {/* Middle row: bar chart + breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Bar chart: evolução mensal */}
        <div style={{
          background: "#111", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12, padding: 24,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
              EVOLUÇÃO MENSAL DE PAUTAS
            </span>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { color: "#4ade80", label: "Aprovadas" },
                { color: "#cfff04", label: "Pendentes" },
                { color: "#f87171", label: "Rejeitadas" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 8, height: 8, background: l.color, borderRadius: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <BarChart />
        </div>

        {/* Breakdown bars */}
        <div style={{
          background: "#111", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12, padding: 24,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>
            SITUAÇÃO ATUAL DAS PAUTAS
          </div>
          <ProgressBar label="Aprovadas"   value={STATS.aprovadas}   max={totalPautas} color="#4ade80" />
          <ProgressBar label="Pendentes"   value={STATS.pendentes}   max={totalPautas} color="#cfff04" />
          <ProgressBar label="Em Análise"  value={STATS.em_analise}  max={totalPautas} color="#00ffff" />
          <ProgressBar label="Rejeitadas"  value={STATS.rejeitadas}  max={totalPautas} color="#f87171" />

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <ProgressBar label="Mensagens recebidas" value={STATS.totalMensagens} max={50} color="#fb923c" />
          </div>
        </div>
      </div>

      {/* Bottom: activity feed */}
      <div style={{
        background: "#111", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12, padding: 24,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
          ATIVIDADE RECENTE
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {ATIVIDADE.map((a, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column", gap: 8,
              padding: 14, background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10,
            }}>
              <ActivityDot color={a.cor} />
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>{a.msg}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: "auto" }}>{a.tempo}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
