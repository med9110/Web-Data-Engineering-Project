package com.example.demo.services;

import com.example.demo.Repository.ListingRepository;
import com.example.demo.entities.Listing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListingServiceImpl implements ListingService {

    @Autowired
    private ListingRepository listingRepository;

    @Override
    public Listing saveListing(Listing listing) {
        return listingRepository.save(listing);
    }

    @Override
    public Listing updateListing(Long id, Listing listing) {
        Listing existingListing = listingRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Listing not found"));
        existingListing.setName(listing.getName());
        existingListing.setDescription(listing.getDescription());
        existingListing.setTheme(listing.getTheme());
        return listingRepository.save(existingListing);
    }

    @Override
    public void deleteListing(Long id) {
        listingRepository.deleteById(id);
    }

    @Override
    public Listing getListing(Long id) {
        return listingRepository.findById(id).orElse(null);
    }

    @Override
    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }
} 