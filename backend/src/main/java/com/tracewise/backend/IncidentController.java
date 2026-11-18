package com.tracewise.backend;


import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
public class IncidentController {
    private final IncidentRepository incidentRepository;

    public  IncidentController(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }
    @GetMapping
    public List<Incident> getIncidents() {
        return incidentRepository.findAll();
    }

    @PostMapping 
    public Incident createIncident(@RequestBody Incident incident) {
        incident.setIncidentCode("INC-" + System.currentTimeMillis());
        incident.setStatus("Open");

        return incidentRepository.save(incident);
    }
    @PutMapping("/{id}/status")
    public Incident updateStatus(
        @PathVariable Long id,
        @RequestBody Map<String,String> request) {
            Incident incident = incidentRepository.findById(id).orElseThrow(() -> new RuntimeException("Incident not found"));

            incident.setStatus(request.get("status"));

            return 
            incidentRepository.save(incident);
        }

        @DeleteMapping("/{id}")
        public void deleteIncident(@PathVariable Long id) {
            incidentRepository.deleteById(id);
        }
}