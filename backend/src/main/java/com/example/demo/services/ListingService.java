package com.example.demo.services;

import com.example.demo.entities.Listing;

import java.util.List;

public interface ListingService {
    Listing saveListing(Listing listing);
    Listing updateListing(Long id, Listing listing);
    void deleteListing(Long id);
    Listing getListing(Long id);
    List<Listing> getAllListings();
} 