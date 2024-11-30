package com.example.demo.controller;

import com.example.demo.dto.UserDto;
import com.example.demo.entities.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.services.Userservice;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

@RestController
@AllArgsConstructor
public class UserController {

    @Autowired
    private Userservice userservice;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register/users")
    public ResponseEntity<User> savedUser(@RequestBody User user){
        User saveduser = userservice.savedUser(user);
        System.out.println(":::::::::::::::::::"+saveduser);
        return ResponseEntity.ok(saveduser);
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        try {
            User updatedUser = userservice.updateUser(id, userDto);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id){
        try{
            User user = userservice.getUser(id);
            return ResponseEntity.ok(user);

        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping()
    public ResponseEntity<List<User>> getAllUser(){
        List<User> users = userservice.getAllUser();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        try{
            userservice.deleteUser(id);
            return ResponseEntity.ok("user deleted successfly");
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }

    }

    @GetMapping("/users/{id}/age")
    public ResponseEntity<Integer> getUserAge(@PathVariable Long id) {
        try {
            Integer age = userservice.getUserAge(id);
            return ResponseEntity.ok(age);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/info")
    public ResponseEntity<User> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername());
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
