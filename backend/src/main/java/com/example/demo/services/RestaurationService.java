package com.example.demo.services;

import com.example.demo.entities.Restauration;

import java.util.List;

public interface RestaurationService {
    Restauration saveRestauration(Restauration restauration);
    Restauration updateRestauration(Long id, Restauration restauration);
    void deleteRestauration(Long id);
    Restauration getRestauration(Long id);
    List<Restauration> getAllRestaurations();
} 