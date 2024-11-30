package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private String Firstname;
    private String Lastname;

    private String mail;
    private String password;
    private String Role;

    private Integer age; // New field for user age

    private List<String> preferences; // New field for user preferences
}

