package com.example.demo.services;

import com.example.demo.Repository.RatingRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Repository.ListingRepository;
import com.example.demo.entities.Rating;
import com.example.demo.entities.User;
import com.example.demo.entities.Listing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingServiceImpl implements RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ListingRepository listingRepository;

    @Override
    public Rating saveRating(Rating rating) {
        User user = userRepository.findById(rating.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Listing listing = listingRepository.findById(rating.getListing().getId())
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));

        rating.setUser(user);
        rating.setListing(listing);

        return ratingRepository.save(rating);
    }

    @Override
    public Rating updateRating(Long id, Rating rating) {
        Rating existingRating = ratingRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Rating not found"));
        existingRating.setScore(rating.getScore());
        existingRating.setComment(rating.getComment());
        existingRating.setListing(rating.getListing());
        existingRating.setUser(rating.getUser());
        return ratingRepository.save(existingRating);
    }

    @Override
    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }

    @Override
    public Rating getRating(Long id) {
        return ratingRepository.findById(id).orElse(null);
    }

    @Override
    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }
} 