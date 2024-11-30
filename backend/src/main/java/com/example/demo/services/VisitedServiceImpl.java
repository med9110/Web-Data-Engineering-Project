package com.example.demo.services;

import com.example.demo.Repository.VisitedRepository;
import com.example.demo.entities.Visited;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitedServiceImpl implements VisitedService {

    @Autowired
    private VisitedRepository visitedRepository;

    @Override
    public Visited saveVisited(Visited visited) {
        return visitedRepository.save(visited);
    }

    @Override
    public Visited updateVisited(Long id, Visited visited) {
        Visited existingVisited = visitedRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Visited record not found"));
        existingVisited.setUser(visited.getUser());
        existingVisited.setListing(visited.getListing());
        existingVisited.setVisitDate(visited.getVisitDate());
        return visitedRepository.save(existingVisited);
    }

    @Override
    public void deleteVisited(Long id) {
        visitedRepository.deleteById(id);
    }

    @Override
    public Visited getVisited(Long id) {
        return visitedRepository.findById(id).orElse(null);
    }

    @Override
    public List<Visited> getAllVisited() {
        return visitedRepository.findAll();
    }
} 