package com.example.demo.services;

import com.example.demo.Repository.RestaurationRepository;
import com.example.demo.entities.Restauration;
import com.example.demo.entities.Listing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurationServiceImpl implements RestaurationService {

    @Autowired
    private RestaurationRepository restaurationRepository;

    @Autowired
    private ListingService listingService;

    @Override
    public Restauration saveRestauration(Restauration restauration) {
        Restauration savedRestauration = restaurationRepository.save(restauration);

        // Create and save a Listing
        Listing listing = new Listing();
        listing.setIdRef("R-" + savedRestauration.getId());
        listing.setName(savedRestauration.getName());
        listing.setType(restauration.getType());
        listing.setTypeService("Restauration");
        listing.setLocation(savedRestauration.getLocation());
        listing.setPrice(savedRestauration.getAveragePricePerPerson());

        listingService.saveListing(listing);

        return savedRestauration;
    }

    @Override
    public Restauration updateRestauration(Long id, Restauration restauration) {
        Restauration existingRestauration = restaurationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Restauration not found"));
        existingRestauration.setName(restauration.getName());
        existingRestauration.setType(restauration.getType());
        existingRestauration.setAddress(restauration.getAddress());
        existingRestauration.setLocation(restauration.getLocation());
        existingRestauration.setPhone(restauration.getPhone());
        existingRestauration.setEmail(restauration.getEmail());
        existingRestauration.setAveragePricePerPerson(restauration.getAveragePricePerPerson());
        return restaurationRepository.save(existingRestauration);
    }

    @Override
    public void deleteRestauration(Long id) {
        restaurationRepository.deleteById(id);
    }

    @Override
    public Restauration getRestauration(Long id) {
        return restaurationRepository.findById(id).orElse(null);
    }

    @Override
    public List<Restauration> getAllRestaurations() {
        return restaurationRepository.findAll();
    }
} 