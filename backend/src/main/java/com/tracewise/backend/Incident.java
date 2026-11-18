package com.tracewise.backend;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity @Table(name = "incidents")
public class Incident {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @Column(name = "incident_code", unique = true, length = 30)
    private String incidentCode;
    
    @JsonProperty("title")
    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 100)
    private String service;

    @Column(nullable = false, length = 20)
    private String severity;

    @Column(nullable = false, length = 30)
    private String status = "Open";

    @Column(columnDefinition = "Text")
    private String message;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Incident() {
    }

    public Long getId() {
        return id;
    }

    public String getIncidentCode() {
        return incidentCode;
    }

    public void setIncidentCode(String incidentCode) {
        this.incidentCode = incidentCode;
    }

    public String getTitle() {
        return title;
    }
    
    
    public void setTitle(String title){
        System.out.println("TITLE RECEIVED: " + title);
        this.title = title;
    }
    
    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getSeverity() {
        return severity;
    }

    public void setServerity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

public LocalDateTime getCreatedAt() {
    return createdAt;
}
}