package com.example.demo.services;

import com.example.demo.Repository.HebergementRepository;
import com.example.demo.entities.Hebergement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HebergementServiceImpl implements HebergementService {

    @Autowired
    private HebergementRepository hebergementRepository;

    @Override
    public Hebergement saveHebergement(Hebergement hebergement) {
        return hebergementRepository.save(hebergement);
    }

    @Override
    public Hebergement updateHebergement(Long id, Hebergement hebergement) {
        Hebergement existingHebergement = hebergementRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Hebergement not found"));
        existingHebergement.setName(hebergement.getName());
        existingHebergement.setType(hebergement.getType());
        existingHebergement.setAddress(hebergement.getAddress());
        existingHebergement.setLocation(hebergement.getLocation());
        existingHebergement.setPhone(hebergement.getPhone());
        existingHebergement.setEmail(hebergement.getEmail());
        existingHebergement.setPricePerNight(hebergement.getPricePerNight());
        return hebergementRepository.save(existingHebergement);
    }

    @Override
    public void deleteHebergement(Long id) {
        hebergementRepository.deleteById(id);
    }

    @Override
    public Hebergement getHebergement(Long id) {
        return hebergementRepository.findById(id).orElse(null);
    }

    @Override
    public List<Hebergement> getAllHebergements() {
        return hebergementRepository.findAll();
    }
} 