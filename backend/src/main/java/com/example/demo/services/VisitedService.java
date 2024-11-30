package com.example.demo.services;

import com.example.demo.entities.Visited;

import java.util.List;

public interface VisitedService {
    Visited saveVisited(Visited visited);
    Visited updateVisited(Long id, Visited visited);
    void deleteVisited(Long id);
    Visited getVisited(Long id);
    List<Visited> getAllVisited();
} 