package com.example.demo.controller;

import com.example.demo.entities.Visited;
import com.example.demo.services.VisitedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/visited")
public class VisitedController {

    @Autowired
    private VisitedService visitedService;

    @PostMapping
    public ResponseEntity<Visited> saveVisited(@RequestBody Visited visited) {
        Visited savedVisited = visitedService.saveVisited(visited);
        return ResponseEntity.ok(savedVisited);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Visited> updateVisited(@PathVariable Long id, @RequestBody Visited visited) {
        Visited updatedVisited = visitedService.updateVisited(id, visited);
        return ResponseEntity.ok(updatedVisited);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Visited> getVisited(@PathVariable Long id) {
        Visited visited = visitedService.getVisited(id);
        return ResponseEntity.ok(visited);
    }

    @GetMapping
    public ResponseEntity<List<Visited>> getAllVisited() {
        List<Visited> visitedList = visitedService.getAllVisited();
        return ResponseEntity.ok(visitedList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisited(@PathVariable Long id) {
        visitedService.deleteVisited(id);
        return ResponseEntity.noContent().build();
    }
} 