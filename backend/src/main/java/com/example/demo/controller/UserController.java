package com.example.demo.controller;

import com.example.demo.dto.UserDto;
import com.example.demo.entities.User;
import com.example.demo.services.Userservice;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
 @AllArgsConstructor
public class UserController {


    @Autowired
    private Userservice userservice;

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
}
