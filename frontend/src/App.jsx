 
import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "/api/incidents";
const initialIncidents = [
  {
    id: "INC-1001",
    title: "Payment service returned HTTP 500",
    service: "Payment Service",
    severity: "Critical",
    status: "Open",
    message: "Internal server error while processing payment",
  },
  {
    id: "INC-1002",
    title: "Database connection timeout",
    service: "Order Service",
    severity: "High",
    status: "Investigating",
    message: "Connection timed out while accessing the database",
  },
  {
    id: "INC-1003",
    title: "Authentication request failed",
    service: "Auth Service",
    severity: "Medium",
    status: "Open",
    message: "HTTP 401 unauthorized response",
  },
  {
    id: "INC-1004",
    title: "Slow inventory API response",
    service: "Inventory Service",
    severity: "Low",
    status: "Resolved",
    message: "API response exceeded expected latency",
  },
];

function App() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [backendError, setBackendError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  useEffect(() => {
    fetch(API_URL).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load incidents");
      }
      return response.json();
    })
    .then((data) => {
      setIncidents(data);
      setBackendError("");
    })
    .catch((error) => {
      console.error("Backend connection error:", error);
      setBackendError("Backend connection failed");
    })
  }, []);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [backendMessage, setBackendMessage] = useState("Connecting to backend...");
  useEffect(() => {
    fetch("api/health").then((response) => response.json()).then((data) => {
      setBackendMessage(`${data.application}: ${data.status}`);
 
    })
    .catch(() => {
      setBackendMessage("Backend connection failed");
    });
}, []);
  const [title, setTitle] = useState("");
  const [service, setService] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [message, setMessage] = useState("");

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = String(incident.title || "").toLowerCase().includes(search.toLowerCase()) || String(incident.service || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter = (filter === "All" || incident.status === filter) && (selectedStatus === "All" || incident.severity === selectedSeverity);

    return matchesSearch && matchesFilter;
  });
 
  const visibleIncidents = incidents.filter((incident) => {
    const matchesSearch =
      `${incident.id} ${incident.title} ${incident.service}`
        .toLowerCase()
        .includes(search.toLowerCase());
 
    const matchesFilter =
      (filter === "All" || incident.status === filter) && (selectedStatus === "All" || incident.status === selectedStatus);
 
    return matchesSearch && matchesFilter;
  });
       
const updateStatus = async (id, newStatus) => {
  try {
    const response = await fetch(`/api/incidents/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: newStatus
      })
    });
 
    if (!response.ok) {
      throw new Error("Failed to update incident status");
    }
 
    const updatedIncident = await response.json();
 
    setIncidents((currentIncidents) =>
      currentIncidents.map((incident) =>
        incident.id === id ? updatedIncident : incident
      )
    );
 
  } catch (error) {
    console.error("Status update error:", error);
    alert("Unable to update status. Please try again.");
  }
};
 
  const openCount = incidents.filter(
    (incident) => incident.status === "Open"
  ).length;
 
  const investigatingCount = incidents.filter(
    (incident) => incident.status === "Investigating"
  ).length;
  
  const resolvedCount = incidents.filter((incident) => incident.status === "Resolved").length;
  const criticalCount = incidents.filter(
    (incident) => incident.severity === "Critical"
  ).length;
  const highCount = incidents.filter((incident) => incident.severity === "High").length;
  const mediumCount = incidents.filter((incident) => incident.severity === "Medium").length;
  const lowCount = incidents.filter((incident) => incident.severity === "Low").length;
  const maxSeverityCount = Math.max(criticalCount,highCount,mediumCount,lowCount,1);
 
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">T</div>
          <div>
            <h2>TraceWise</h2>
            <span>Incident Intelligence</span>
          </div>
        </div>
 
        <p className="nav-label">WORKSPACE</p>
        <button className="nav-item active">Overview</button>
        <button className="nav-item">Incidents</button>
        <button className="nav-item">Services</button>
        <button className="nav-item">Reports</button>
 
        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot" />
            <div>
              <strong>Demo environment</strong>
              <p>Local simulation</p>
            </div>
          </div>
        </div>
      </aside>
 
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Overview</p>
            <h1>Incident Overview</h1>
            <p>{backendMessage}</p>
            <p className="subtitle">
              Monitor failures and investigate incidents.
            </p>
          </div>
          <span className="environment-badge">LIVE BACKEND</span>
        </header>
 
        <section className="metrics-grid">
          <MetricCard label="Total incidents" value={incidents.length}
          onClick={() => {setSelectedStatus("All");
          setSElectedSeverity("All");
          setFilter("All");
          setSearch("");
          }}
          />
          <MetricCard label="Open incidents" 
          value={openCount} 
          onClick={() => setSelectedStatus("Open")}
          />
          <MetricCard
            label="Investigating"
            value={investigatingCount}
            onClick={() => setSelectedStatus("Investigating")}
            />
          <MetricCard label="Resolved incidents" 
            value={resolvedCount}
            onClick={() => setSelectedStatus("Resolved")}
          />
          <MetricCard label="Critical severity" value={criticalCount}
          onClick={() => {
            setSelectedStatus("All");
            setSelectedSeverity("Critical");
          }}
           />
        </section>
        
        
         
<section className="panel create-panel">
  <div className="panel-heading">
    <div>
      <h2>Create a new incident</h2>
      <p>Record a service failure for investigation.</p>
    </div>
  </div>
 
  <form
    className="incident-form"
    onSubmit={async (event) => {
      event.preventDefault();
      const newIncident = {
        title: title,
        service: service,
        severity: severity,
        message: message,
      };

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:
        JSON.stringify(newIncident),
        });

        if(!response.ok) {
          throw new Error("Failed to create incident");
        }

        const savedIncident = await response.json();

        setIncidents((currentIncidents) => 
        [
          savedInciednt, ...currentIncidents,
        ]);

        setTitle("");
        setService("");
        setSeverity("Medium");
        setMessage("");
        setBackendError("");
      } catch (error) {
        setBackendError("Could not save incident. Please try again.");
        console.error(error);
      }
    }}
  >
    <label htmlFor="incident-title">Incident title</label>
    <input
      id="incident-title"
      type="text"
      placeholder="e.g. Payment API failure"
      value={title}
      onChange={(event) => setTitle(event.target.value)}
      required
    />
 
    <label htmlFor="incident-service">Service name</label>
    <input
      id="incident-service"
      type="text"
      placeholder="e.g. Payment Service"
      value={service}
      onChange={(event) => setService(event.target.value)}
      required
    />
 
    <label htmlFor="incident-severity">Severity</label>
    <select
      id="incident-severity"
      value={severity}
      onChange={(event) => setSeverity(event.target.value)}
    >
      <option value="Critical">Critical</option>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
 
    <label htmlFor="incident-message">Error message</label>
    <textarea
      id="incident-message"
      placeholder="Describe the error..."
      value={message}
      onChange={(event) => setMessage(event.target.value)}
      required
    />
 
    <button type="submit">Create Incident</button>
  </form>
</section>
<section className="panel severity-chart-panel">
  <div className="panel-heading">

  <div>
  <h2>Incidents by Severity</h2>
  <p>Distribution of reported incidents</p>
  </div>
</div>
{[
  { label: "Critical", count: criticalCount},
  {label: "High", count: highCount},
  {label: "Medium", count: mediumCount},
  {label: "Low", count: lowCount},].map((item) => (
    <div className="severity-chart-row" key={item.label}>
      <span>{item.label}</span>
      <div className="severity-bar">
        <div
        className={`severity-fill ${item.label.toLowerCase()}`}
        style={{
          width: `${maxSeverityCount === 0 ? 0 : (item.count / maxSeverityCount) * 100}%`,
        }}
        />
      </div>
      <strong>{item.count}</strong>
    </div>
  ))}
</section>
<section className="panel">
  <div className="panel-heading">
  <div>
    <h2>Recent incidents</h2>
    <p>View and track all reported incidents.</p>
    </div>
    <span className="incident-count">
    {incidents.length} incidents
    </span>
    </div>

    <div className="incident-list">

      <div className="incident-filters">
        <input
        type="text"
        placeholder="Search by title or service..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All
          Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
          </select>
        </div>
      {visibleIncidents.map((incident) => (<article className="incident-row" key={incident.id}>
        <div>
          <span>{incident.id}</span>
          <h3>{incident.title}</h3>
          <p>{incident.service}</p>
          <p>{incident.message}</p>

          <button onClick={() =>
            setSelectedIncident(incident)}>
              View Details
            </button>
          
           

<div className="severity-line">
  <span>Severity:</span>
  <span
    className={`severity ${incident.severity.toLowerCase()}`}
  >
    {incident.severity}
  </span>
</div>
 
            <label>
  Status:
  <select
    value={incident.status}
    onChange={(event) =>
      updateStatus(incident.id, event.target.value)
    }
  >
    <option value="Open">Open</option>
    <option value="Investigating">Investigating</option>
    <option value="Resolved">Resolved</option>
  </select>
</label>
        </div>
        <button className="delete-btn"
        onClick={async () => {
          if(!window.confirm("Are you sure you want to delete this incident?")) {
            return;
          }
          try {
            const response = await fetch(`/api/incidents/${incident.id}`, {
              method:"DELETE",
            });

            if(!response.ok) {
              throw new Error("Delete failed");
            }

            setIncidents((currentIncidents) => currentIncidents.filter((item) => item.id !== incident.id));
          } catch(error) {
            alert("Unable to delete incident. Please try again.");
            console.error(error);
          }
        }}
        >
        Delete
        </button>
      </article>
      ))}
    </div>
</section>
        <p className="footer-note">
          TraceWise prototype — Powered by Spring Boot & MySQL
        </p>
      </main>
    {selectedIncident && (
      <div className="details-overlay">
        <div className="details-panel">
          <h2>Incident Details</h2>

          <p><strong>Incident ID: </strong>{selectedIncident.id}</p>
          <p><strong>Title: </strong>{selectedIncident.title}</p>
          <p><strong>Service: </strong>{selectedIncident.service}</p>
          <p><strong>Severity: </strong>{selectedIncident.severity}</p>
          <p><strong>Status: </strong>{selectedIncident.status}</p>
          <p><strong>Message: </strong>{selectedIncident.message}</p>
          <p><strong>Created At: </strong>{selectedIncident.createdAt}</p>

          <button onClick={() => setSelectedIncident(null)}>
            Close
          </button>
        </div>
        </div>

    )}
    </div>
  );
}

function MetricCard({ label, value, onClick }) {
  return (
    <article className="metric-card"
     onClick={onClick}
     style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="metric-top">
        <span>{label}</span>
      </div>

      <strong
    className="metric-value">{value}</strong>

         <p>Live data from incident database</p>
     </article>
  );
}
export default App;