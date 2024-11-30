package com.example.demo.services;

import com.example.demo.Repository.ActivityRepository;
import com.example.demo.entities.Activity;
import com.example.demo.entities.Listing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityServiceImpl implements ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ListingService listingService;

    @Override
    public Activity saveActivity(Activity activity) {
        Activity savedActivity = activityRepository.save(activity);

        // Create and save a Listing
        Listing listing = new Listing();
        listing.setIdRef("A-" + savedActivity.getId());
        listing.setName(savedActivity.getName());
        listing.setType(savedActivity.getType());
        listing.setTypeService("Activités");
        listing.setLocation(savedActivity.getLocation());
        listing.setPrice(savedActivity.getPricePerPerson());

        listingService.saveListing(listing);

        return savedActivity;
    }

    @Override
    public Activity updateActivity(Long id, Activity activity) {
        Activity existingActivity = activityRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Activity not found"));
        existingActivity.setName(activity.getName());
        existingActivity.setType(activity.getType());
        existingActivity.setAddress(activity.getAddress());
        existingActivity.setLocation(activity.getLocation());
        existingActivity.setPhone(activity.getPhone());
        existingActivity.setEmail(activity.getEmail());
        existingActivity.setPricePerPerson(activity.getPricePerPerson());
        return activityRepository.save(existingActivity);
    }

    @Override
    public void deleteActivity(Long id) {
        activityRepository.deleteById(id);
    }

    @Override
    public Activity getActivity(Long id) {
        return activityRepository.findById(id).orElse(null);
    }

    @Override
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }
} 