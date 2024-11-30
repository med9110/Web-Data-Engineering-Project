package com.example.demo.services;

import com.example.demo.entities.Hebergement;

import java.util.List;

public interface HebergementService {
    Hebergement saveHebergement(Hebergement hebergement);
    Hebergement updateHebergement(Long id, Hebergement hebergement);
    void deleteHebergement(Long id);
    Hebergement getHebergement(Long id);
    List<Hebergement> getAllHebergements();
} 