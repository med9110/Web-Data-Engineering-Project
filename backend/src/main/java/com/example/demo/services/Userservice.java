package com.example.demo.services;

import com.example.demo.dto.UserDto;
import com.example.demo.entities.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface Userservice {

    User savedUser(User user);

    User updateUser(Long id, UserDto userDto);

    void deleteUser(Long id);

    User getUser(Long id);

    List<User> getAllUser();


    @Transactional
    void createPasswordResetTokenForUser(User user, String token);

    User findUserByEmail(String email);

    boolean checkIfValidOldPassword(User user, String oldpassword);

    void changeUserPassword(User user, String newPassword);

    User getUserByPasswordResetToken(String token);
}
