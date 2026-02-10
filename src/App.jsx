import { useState, useEffect, useRef, useCallback } from "react";

// --- Mock Data (simulating API responses) ---
const LAUNCH_DATA = [
  {
    id: "1",
    provider: "SpaceX",
    vehicle: "Falcon 9",
    mission: "Starlink Group 12-5",
    site: "Cape Canaveral SFS",
    state: "Florida",
    pad: "SLC-40",
    launchTime: new Date(Date.now() + 2 * 3600000 + 1400000).toISOString(),
    status: "Go",
    description: "SpaceX Starlink mission deploying 23 satellites to low Earth orbit for global broadband coverage.",
    windowEnd: new Date(Date.now() + 2 * 3600000 + 1400000 + 7200000).toISOString(),
    isWindow: true,
  },
  {
    id: "2",
    provider: "United Launch Alliance",
    vehicle: "Vulcan Centaur",
    mission: "NROL-107",
    site: "Cape Canaveral SFS",
    state: "Florida",
    pad: "SLC-41",
    launchTime: new Date(Date.now() + 86400000 * 2 + 3600000 * 14).toISOString(),
    status: "Scheduled",
    description: "National Reconnaissance Office classified payload. Details restricted under national security protocols.",
    windowEnd: null,
    isWindow: false,
  },
  {
    id: "3",
    provider: "SpaceX",
    vehicle: "Falcon Heavy",
    mission: "GOES-U",
    site: "Kennedy Space Center",
    state: "Florida",
    pad: "LC-39A",
    launchTime: new Date(Date.now() + 86400000 * 5 + 3600000 * 9).toISOString(),
    status: "Scheduled",
    description: "Geostationary weather satellite for NOAA, enhancing severe weather prediction and space weather monitoring.",
    windowEnd: new Date(Date.now() + 86400000 * 5 + 3600000 * 13).toISOString(),
    isWindow: true,
  },
  {
    id: "4",
    provider: "Rocket Lab",
    vehicle: "Electron",
    mission: "Live and Let Fly",
    site: "Wallops Flight Facility",
    state: "Virginia",
    pad: "LC-2",
    launchTime: new Date(Date.now() + 86400000 * 8 + 3600000 * 6).toISOString(),
    status: "Scheduled",
    description: "Dedicated rideshare mission carrying multiple small satellites for commercial Earth observation customers.",
    windowEnd: null,
    isWindow: false,
  },
  {
    id: "5",
    provider: "SpaceX",
    vehicle: "Starship",
    mission: "Starship Flight 9",
    site: "Starbase",
    state: "Texas",
    pad: "OLP-1",
    launchTime: new Date(Date.now() + 86400000 * 12 + 3600000 * 11).toISOString(),
    status: "Hold",
    description: "Ninth integrated flight test of the Starship launch system. Full-stack booster catch attempt planned.",
    windowEnd: new Date(Date.now() + 86400000 * 12 + 3600000 * 13).toISOString(),
    isWindow: true,
  },
  {
    id: "6",
    provider: "Blue Origin",
    vehicle: "New Glenn",
    mission: "NG-3",
    site: "Cape Canaveral SFS",
    state: "Florida",
    pad: "LC-36",
    launchTime: new Date(Date.now() + 86400000 * 18 + 3600000 * 8).toISOString(),
    status: "Scheduled",
    description: "Third New Glenn mission carrying commercial communications satellites to geostationary transfer orbit.",
    windowEnd: null,
    isWindow: false,
  },
  {
    id: "7",
    provider: "Firefly Aerospace",
    vehicle: "Alpha",
    mission: "FLTA005",
    site: "Vandenberg SFB",
    state: "California",
    pad: "SLC-2W",
    launchTime: new Date(Date.now() + 86400000 * 22 + 3600000 * 15).toISOString(),
    status: "Scheduled",
    description: "Dedicated launch carrying a technology demonstration payload for the U.S. Space Force.",
    windowEnd: null,
    isWindow: false,
  },
  {
    id: "8",
    provider: "SpaceX",
    vehicle: "Falcon 9",
    mission: "CRS-32",
    site: "Kennedy Space Center",
    state: "Florida",
    pad: "LC-39A",
    launchTime: new Date(Date.now() + 86400000 * 28 + 3600000 * 10).toISOString(),
    status: "Scheduled",
    description: "NASA Commercial Resupply Services mission to the International Space Station with science experiments and supplies.",
    windowEnd: null,
    isWindow: false,
  },
];

const STATUS_CONFIG = {
  Go: { color: "#00E676", bg: "rgba(0,230,118,0.1)", label: "GO FOR LAUNCH" },
  Scheduled: { color: "#64B5F6", bg: "rgba(100,181,246,0.08)", label: "SCHEDULED" },
  Hold: { color: "#FFB74D", bg: "rgba(255,183,77,0.1)", label: "HOLD" },
  Delayed: { color: "#FF8A65", bg: "rgba(255,138,101,0.1)", label: "DELAYED" },
  Scrubbed: { color: "#EF5350", bg: "rgba(239,83,80,0.1)", label: "SCRUBBED" },
  Launched: { color: "#AB47BC", bg: "rgba(171,71,188,0.1)", label: "LAUNCHED" },
};

// --- Countdown Hook ---
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({});
  
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        total: diff,
      };
    };
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  
  return timeLeft;
}

// --- Star Field Component ---
function StarField() {
  const stars = useRef(
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }))
  ).current;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            backgroundColor: "rgba(200,210,240,0.6)",
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// --- Status Badge ---
function StatusBadge({ status, large }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Scheduled;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: large ? "6px 14px" : "3px 10px",
        borderRadius: 20,
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.color}22`,
        fontSize: large ? 13 : 10,
        fontFamily: "'DM Mono', monospace",
        fontWeight: 500,
        color: cfg.color,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
      role="status"
      aria-label={`Status: ${cfg.label}`}
    >
      <span
        style={{
          width: large ? 8 : 6,
          height: large ? 8 : 6,
          borderRadius: "50%",
          backgroundColor: cfg.color,
          animation: status === "Go" ? "pulse 2s ease-in-out infinite" : "none",
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

// --- Countdown Display ---
function CountdownDisplay({ targetDate, status, large }) {
  const { days, hours, minutes, seconds, total } = useCountdown(targetDate);

  if (status === "Hold") {
    return (
      <div style={{ textAlign: "center", padding: large ? "20px 0" : "8px 0" }}>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: large ? 40 : 18,
            color: "#FFB74D",
            letterSpacing: "0.05em",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          T- HOLD
        </span>
      </div>
    );
  }

  if (total <= 0 || status === "Launched") {
    return null;
  }

  const pad = (n) => String(n).padStart(2, "0");
  const unitStyle = {
    fontFamily: "'Outfit', sans-serif",
    fontSize: large ? 10 : 8,
    color: "rgba(160,175,210,0.5)",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    marginTop: 4,
  };
  const numStyle = {
    fontFamily: "'DM Mono', monospace",
    fontSize: large ? 52 : 22,
    fontWeight: 300,
    color: "#E8ECF4",
    letterSpacing: "0.02em",
    lineHeight: 1,
  };
  const sepStyle = {
    fontFamily: "'DM Mono', monospace",
    fontSize: large ? 36 : 16,
    color: "rgba(160,175,210,0.25)",
    margin: large ? "0 6px" : "0 3px",
    alignSelf: "flex-start",
    marginTop: large ? 8 : 2,
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 0,
        padding: large ? "16px 0" : "6px 0",
      }}
      role="timer"
      aria-label={`T-minus ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
    >
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: large ? 20 : 11,
        color: "rgba(160,175,210,0.35)",
        marginRight: large ? 10 : 4,
        alignSelf: "flex-start",
        marginTop: large ? 14 : 5,
      }}>T–</span>
      {days > 0 && (
        <>
          <div style={{ textAlign: "center" }}>
            <div style={numStyle}>{pad(days)}</div>
            <div style={unitStyle}>days</div>
          </div>
          <span style={sepStyle}>:</span>
        </>
      )}
      <div style={{ textAlign: "center" }}>
        <div style={numStyle}>{pad(hours)}</div>
        <div style={unitStyle}>hrs</div>
      </div>
      <span style={sepStyle}>:</span>
      <div style={{ textAlign: "center" }}>
        <div style={numStyle}>{pad(minutes)}</div>
        <div style={unitStyle}>min</div>
      </div>
      <span style={sepStyle}>:</span>
      <div style={{ textAlign: "center" }}>
        <div style={numStyle}>{pad(seconds)}</div>
        <div style={unitStyle}>sec</div>
      </div>
    </div>
  );
}

// --- Notification Toggle ---
function NotificationToggle({ enabled, onToggle, label }) {
  return (
    <button
      onClick={onToggle}
      aria-label={`${label}: ${enabled ? "enabled" : "disabled"}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "12px 0",
        background: "none",
        border: "none",
        cursor: "pointer",
        borderBottom: "1px solid rgba(160,175,210,0.06)",
      }}
    >
      <span style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 14,
        color: "rgba(200,210,230,0.7)",
      }}>
        {label}
      </span>
      <div
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          backgroundColor: enabled ? "rgba(0,230,118,0.25)" : "rgba(160,175,210,0.1)",
          border: `1px solid ${enabled ? "rgba(0,230,118,0.4)" : "rgba(160,175,210,0.15)"}`,
          position: "relative",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2,
            left: enabled ? 20 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: enabled ? "#00E676" : "rgba(160,175,210,0.35)",
            transition: "all 0.3s ease",
          }}
        />
      </div>
    </button>
  );
}

// --- Launch Card ---
function LaunchCard({ launch, onClick, index }) {
  const { days, hours, minutes, total } = useCountdown(launch.launchTime);
  const isImminent = total < 86400000 && total > 0;

  const quickCountdown = total <= 0
    ? "LAUNCHED"
    : days > 0
    ? `T-${days}d ${hours}h`
    : `T-${hours}h ${minutes}m`;

  return (
    <button
      onClick={() => onClick(launch)}
      style={{
        width: "100%",
        textAlign: "left",
        background: isImminent
          ? "linear-gradient(135deg, rgba(0,230,118,0.04) 0%, rgba(10,14,28,0.95) 60%)"
          : "rgba(16,20,36,0.7)",
        border: isImminent
          ? "1px solid rgba(0,230,118,0.12)"
          : "1px solid rgba(160,175,210,0.06)",
        borderRadius: 16,
        padding: "20px 22px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        backdropFilter: "blur(20px)",
        animation: `fadeSlideIn 0.5s ease ${index * 0.08}s both`,
        position: "relative",
        overflow: "hidden",
      }}
      aria-label={`${launch.mission} by ${launch.provider}, ${launch.vehicle}. ${quickCountdown}`}
    >
      {isImminent && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(0,230,118,0.4), transparent)",
        }} />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11,
            color: "rgba(160,175,210,0.45)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}>
            {launch.provider}
          </div>
          <div style={{
            fontFamily: "'Newsreader', serif",
            fontSize: 20,
            fontWeight: 400,
            color: "#E8ECF4",
            lineHeight: 1.2,
            marginBottom: 4,
          }}>
            {launch.mission}
          </div>
        </div>
        <StatusBadge status={launch.status} />
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}>
        <div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            color: "rgba(160,175,210,0.5)",
            marginBottom: 3,
          }}>
            {launch.vehicle}
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            color: "rgba(160,175,210,0.35)",
          }}>
            {launch.site}, {launch.state}
          </div>
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 15,
          color: isImminent ? "#00E676" : "rgba(200,210,230,0.65)",
          letterSpacing: "0.02em",
        }}>
          {quickCountdown}
        </div>
      </div>
    </button>
  );
}

// --- Detail View ---
function LaunchDetail({ launch, onBack }) {
  const [notifications, setNotifications] = useState({
    "24h": false,
    "1h": true,
    "10m": true,
    liftoff: true,
    changes: true,
  });

  const toggleNotif = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const launchDate = new Date(launch.launchTime);
  const formattedDate = launchDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = launchDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div style={{
      position: "relative",
      zIndex: 2,
      minHeight: "100vh",
      animation: "fadeSlideIn 0.4s ease both",
    }}>
      {/* Header */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        padding: "16px 20px",
        background: "linear-gradient(180deg, rgba(6,8,18,0.98) 0%, rgba(6,8,18,0.85) 80%, transparent 100%)",
        backdropFilter: "blur(20px)",
      }}>
        <button
          onClick={onBack}
          aria-label="Back to launch list"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(160,175,210,0.6)",
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            padding: "4px 0",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          All Launches
        </button>
      </div>

      <div style={{ padding: "0 24px 60px" }}>
        {/* Provider & Mission */}
        <div style={{ marginBottom: 8, marginTop: 8 }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11,
            color: "rgba(160,175,210,0.4)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}>
            {launch.provider}
          </div>
          <h1 style={{
            fontFamily: "'Newsreader', serif",
            fontSize: 32,
            fontWeight: 400,
            color: "#E8ECF4",
            lineHeight: 1.15,
            margin: "0 0 14px 0",
          }}>
            {launch.mission}
          </h1>
          <StatusBadge status={launch.status} large />
        </div>

        {/* Countdown */}
        <div style={{
          margin: "32px 0",
          padding: "28px 0",
          borderTop: "1px solid rgba(160,175,210,0.06)",
          borderBottom: "1px solid rgba(160,175,210,0.06)",
        }}>
          <CountdownDisplay targetDate={launch.launchTime} status={launch.status} large />
        </div>

        {/* Schedule Info */}
        <div style={{
          marginBottom: 32,
          padding: "20px",
          borderRadius: 14,
          background: "rgba(16,20,36,0.5)",
          border: "1px solid rgba(160,175,210,0.06)",
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "rgba(160,175,210,0.35)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}>
            {launch.isWindow ? "Launch Window" : "Target T-0"}
          </div>
          <div style={{
            fontFamily: "'Newsreader', serif",
            fontSize: 18,
            color: "#E8ECF4",
            marginBottom: 4,
          }}>
            {formattedDate}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 15,
            color: "rgba(200,210,230,0.65)",
          }}>
            {formattedTime}
            {launch.isWindow && launch.windowEnd && (
              <span style={{ color: "rgba(160,175,210,0.35)" }}>
                {" "}→{" "}
                {new Date(launch.windowEnd).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Mission Details */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "rgba(160,175,210,0.35)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}>
            Mission
          </div>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 15,
            color: "rgba(200,210,230,0.65)",
            lineHeight: 1.65,
            margin: 0,
          }}>
            {launch.description}
          </p>
        </div>

        {/* Vehicle & Location */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 36,
        }}>
          <div style={{
            padding: "18px",
            borderRadius: 14,
            background: "rgba(16,20,36,0.5)",
            border: "1px solid rgba(160,175,210,0.06)",
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "rgba(160,175,210,0.3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}>
              Vehicle
            </div>
            <div style={{
              fontFamily: "'Newsreader', serif",
              fontSize: 16,
              color: "#E8ECF4",
            }}>
              {launch.vehicle}
            </div>
          </div>
          <div style={{
            padding: "18px",
            borderRadius: 14,
            background: "rgba(16,20,36,0.5)",
            border: "1px solid rgba(160,175,210,0.06)",
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "rgba(160,175,210,0.3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}>
              Launch Pad
            </div>
            <div style={{
              fontFamily: "'Newsreader', serif",
              fontSize: 16,
              color: "#E8ECF4",
            }}>
              {launch.pad}
            </div>
          </div>
        </div>

        <div style={{
          padding: "18px",
          borderRadius: 14,
          background: "rgba(16,20,36,0.5)",
          border: "1px solid rgba(160,175,210,0.06)",
          marginBottom: 36,
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: "rgba(160,175,210,0.3)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}>
            Location
          </div>
          <div style={{
            fontFamily: "'Newsreader', serif",
            fontSize: 16,
            color: "#E8ECF4",
          }}>
            {launch.site}
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            color: "rgba(160,175,210,0.45)",
            marginTop: 3,
          }}>
            {launch.state}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "rgba(160,175,210,0.35)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}>
            Notifications
          </div>
          <div style={{
            padding: "8px 20px",
            borderRadius: 14,
            background: "rgba(16,20,36,0.5)",
            border: "1px solid rgba(160,175,210,0.06)",
          }}>
            <NotificationToggle label="24 hours before" enabled={notifications["24h"]} onToggle={() => toggleNotif("24h")} />
            <NotificationToggle label="1 hour before" enabled={notifications["1h"]} onToggle={() => toggleNotif("1h")} />
            <NotificationToggle label="10 minutes before" enabled={notifications["10m"]} onToggle={() => toggleNotif("10m")} />
            <NotificationToggle label="Liftoff" enabled={notifications.liftoff} onToggle={() => toggleNotif("liftoff")} />
            <NotificationToggle label="Schedule changes" enabled={notifications.changes} onToggle={() => toggleNotif("changes")} />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [filter, setFilter] = useState("all");

  const filteredLaunches = LAUNCH_DATA.filter((l) => {
    if (filter === "all") return true;
    if (filter === "imminent") return new Date(l.launchTime) - new Date() < 86400000 * 3;
    return l.provider.toLowerCase().includes(filter.toLowerCase());
  });

  useEffect(() => {
    const id = setInterval(() => setLastRefresh(new Date()), 300000);
    return () => clearInterval(id);
  }, []);

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "imminent", label: "Soon" },
    { key: "SpaceX", label: "SpaceX" },
    { key: "ULA", label: "ULA" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(170deg, #060812 0%, #0B0F1E 30%, #0A0D1A 60%, #080B16 100%)",
        color: "#E8ECF4",
        position: "relative",
        overflow: "hidden",
        maxWidth: 480,
        margin: "0 auto",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Newsreader:opsz,wght@6..72,300;6..72,400&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        * { box-sizing: border-box; }
        body { margin: 0; background: #060812; }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(160,175,210,0.15); border-radius: 4px; }
        
        button:hover { opacity: 0.85; }
        button:active { transform: scale(0.98); }
        button { transition: all 0.2s ease; }
      `}</style>

      <StarField />

      {selectedLaunch ? (
        <LaunchDetail launch={selectedLaunch} onBack={() => setSelectedLaunch(null)} />
      ) : (
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Header */}
          <div style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "linear-gradient(180deg, rgba(6,8,18,0.98) 0%, rgba(6,8,18,0.9) 70%, transparent 100%)",
            backdropFilter: "blur(20px)",
            padding: "20px 24px 24px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}>
              <div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 4,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.5 }}>
                    <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" stroke="#64B5F6" strokeWidth="1.2" />
                    <circle cx="12" cy="12" r="3" stroke="#64B5F6" strokeWidth="1.2" />
                  </svg>
                  <h1 style={{
                    fontFamily: "'Newsreader', serif",
                    fontSize: 22,
                    fontWeight: 400,
                    margin: 0,
                    color: "#E8ECF4",
                  }}>
                    U.S. Launches
                  </h1>
                </div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "rgba(160,175,210,0.3)",
                  letterSpacing: "0.1em",
                }}>
                  {filteredLaunches.length} UPCOMING
                </div>
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "rgba(160,175,210,0.2)",
                textAlign: "right",
              }}>
                SYNCED<br />
                {lastRefresh.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </div>
            </div>

            {/* Filters */}
            <div style={{
              display: "flex",
              gap: 8,
            }}>
              {filterOptions.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: filter === f.key
                      ? "1px solid rgba(100,181,246,0.3)"
                      : "1px solid rgba(160,175,210,0.08)",
                    background: filter === f.key
                      ? "rgba(100,181,246,0.08)"
                      : "rgba(16,20,36,0.5)",
                    color: filter === f.key
                      ? "#64B5F6"
                      : "rgba(160,175,210,0.45)",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Next Launch Hero */}
          {filteredLaunches.length > 0 && filter === "all" && (
            <div style={{
              margin: "0 20px 24px",
              padding: "28px 24px",
              borderRadius: 20,
              background: "linear-gradient(145deg, rgba(16,20,36,0.85) 0%, rgba(10,14,28,0.9) 100%)",
              border: "1px solid rgba(100,181,246,0.08)",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              animation: "fadeSlideIn 0.5s ease both",
            }}
              onClick={() => setSelectedLaunch(filteredLaunches[0])}
              role="button"
              tabIndex={0}
              aria-label={`Next launch: ${filteredLaunches[0].mission}`}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(100,181,246,0.2), transparent)",
              }} />
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "rgba(160,175,210,0.3)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}>
                Next Launch
              </div>
              <div style={{
                fontFamily: "'Newsreader', serif",
                fontSize: 22,
                color: "#E8ECF4",
                marginBottom: 6,
              }}>
                {filteredLaunches[0].mission}
              </div>
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "rgba(160,175,210,0.45)",
                marginBottom: 18,
              }}>
                {filteredLaunches[0].provider} · {filteredLaunches[0].vehicle}
              </div>
              <CountdownDisplay
                targetDate={filteredLaunches[0].launchTime}
                status={filteredLaunches[0].status}
              />
              <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <StatusBadge status={filteredLaunches[0].status} />
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12,
                  color: "rgba(160,175,210,0.3)",
                }}>
                  Tap for details →
                </span>
              </div>
            </div>
          )}

          {/* Launch List */}
          <div style={{
            padding: "0 20px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            {(filter === "all" ? filteredLaunches.slice(1) : filteredLaunches).map((launch, i) => (
              <LaunchCard
                key={launch.id}
                launch={launch}
                onClick={setSelectedLaunch}
                index={i}
              />
            ))}
          </div>

          {filteredLaunches.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "60px 40px",
              animation: "fadeSlideIn 0.5s ease both",
            }}>
              <div style={{
                fontFamily: "'Newsreader', serif",
                fontSize: 18,
                color: "rgba(160,175,210,0.4)",
                marginBottom: 8,
              }}>
                No launches found
              </div>
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "rgba(160,175,210,0.25)",
              }}>
                Try adjusting your filters
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
