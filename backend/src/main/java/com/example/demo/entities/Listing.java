package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String theme; // e.g., culture, food, history

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "listing")
    private List<Booking> bookings;

    @OneToMany(mappedBy = "listing")
    private List<Rating> ratings;

    private String idRef;
    private String type;
    private String typeService;
    private String location;
    private double price;
} 