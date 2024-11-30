package com.example.demo.services;

import com.example.demo.entities.Booking;

import java.util.List;

public interface BookingService {
    Booking saveBooking(Booking booking);
    Booking updateBooking(Long id, Booking booking);
    void deleteBooking(Long id);
    Booking getBooking(Long id);
    List<Booking> getAllBookings();
} 