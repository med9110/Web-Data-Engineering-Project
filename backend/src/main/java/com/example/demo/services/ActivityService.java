package com.example.demo.services;

import com.example.demo.entities.Activity;

import java.util.List;

public interface ActivityService {
    Activity saveActivity(Activity activity);
    Activity updateActivity(Long id, Activity activity);
    void deleteActivity(Long id);
    Activity getActivity(Long id);
    List<Activity> getAllActivities();
} 