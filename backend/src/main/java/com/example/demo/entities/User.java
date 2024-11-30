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

    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String role; // "OWNER" or "USER"

    private boolean confirmed = false;
    private Boolean isFirstAuth = true;

    private Integer age;

    @ElementCollection
    @CollectionTable(
            name = "user_preferences",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "preference")
    private List<String> preferences;
}
