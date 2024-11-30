package com.example.demo.controller;

import com.example.demo.entities.Hebergement;
import com.example.demo.services.HebergementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hebergements")
public class HebergementController {

    @Autowired
    private HebergementService hebergementService;

    @PostMapping
    public ResponseEntity<Hebergement> saveHebergement(@RequestBody Hebergement hebergement) {
        Hebergement savedHebergement = hebergementService.saveHebergement(hebergement);
        return ResponseEntity.ok(savedHebergement);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Hebergement> updateHebergement(@PathVariable Long id, @RequestBody Hebergement hebergement) {
        Hebergement updatedHebergement = hebergementService.updateHebergement(id, hebergement);
        return ResponseEntity.ok(updatedHebergement);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hebergement> getHebergement(@PathVariable Long id) {
        Hebergement hebergement = hebergementService.getHebergement(id);
        return ResponseEntity.ok(hebergement);
    }

    @GetMapping
    public ResponseEntity<List<Hebergement>> getAllHebergements() {
        List<Hebergement> hebergements = hebergementService.getAllHebergements();
        return ResponseEntity.ok(hebergements);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHebergement(@PathVariable Long id) {
        hebergementService.deleteHebergement(id);
        return ResponseEntity.noContent().build();
    }
} 