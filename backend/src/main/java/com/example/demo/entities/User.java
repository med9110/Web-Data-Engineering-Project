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
@Table(name = "\"user\"")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String Firstname;
    private String Lastname;

    private String Mail;
    private String Password;
    private String Role;

    private boolean confirmed = false;
    private Boolean isFirstAuth = true;

    private Integer age; // New field for user age

    @ElementCollection
    @CollectionTable(
            name = "user_preferences",
            joinColumns = @JoinColumn(name = "user_id") // Foreign key to the "user" table
    )
    @Column(name = "preference") // Column to store preference strings
    private List<String> preferences; // List to store multiple preferences
}
