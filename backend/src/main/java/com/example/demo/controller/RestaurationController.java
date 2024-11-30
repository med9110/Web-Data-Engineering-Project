package com.example.demo.controller;

import com.example.demo.entities.Restauration;
import com.example.demo.services.RestaurationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurations")
public class RestaurationController {

    @Autowired
    private RestaurationService restaurationService;

    @PostMapping
    public ResponseEntity<Restauration> saveRestauration(@RequestBody Restauration restauration) {
        Restauration savedRestauration = restaurationService.saveRestauration(restauration);
        return ResponseEntity.ok(savedRestauration);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Restauration> updateRestauration(@PathVariable Long id, @RequestBody Restauration restauration) {
        Restauration updatedRestauration = restaurationService.updateRestauration(id, restauration);
        return ResponseEntity.ok(updatedRestauration);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restauration> getRestauration(@PathVariable Long id) {
        Restauration restauration = restaurationService.getRestauration(id);
        return ResponseEntity.ok(restauration);
    }

    @GetMapping
    public ResponseEntity<List<Restauration>> getAllRestaurations() {
        List<Restauration> restaurations = restaurationService.getAllRestaurations();
        return ResponseEntity.ok(restaurations);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestauration(@PathVariable Long id) {
        restaurationService.deleteRestauration(id);
        return ResponseEntity.noContent().build();
    }
} 