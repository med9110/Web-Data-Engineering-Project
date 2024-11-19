package com.example.demo.services;

import com.example.demo.Repository.PasswordResetTokenRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Repository.VerificationTokenRepository;
import com.example.demo.dto.UserDto;
import com.example.demo.entities.PasswordResetToken;
import com.example.demo.entities.User;
import com.example.demo.entities.VerificationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserserviceImpl implements Userservice {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    PasswordResetTokenRepository passwordResetTokenRepository;

    private PasswordEncoder passwordEncoder;

    public UserserviceImpl() {
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User savedUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User must not be null");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        VerificationToken verificationToken = new VerificationToken();

        verificationToken.setToken(UUID.randomUUID().toString());
        verificationToken.setUser(user);

        verificationTokenRepository.save(verificationToken);

        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, UserDto userDto) {
        User existingUser = userRepository.getById(id);
        if (userDto != null) {
            if (userDto.getFirstname() != null) {
                existingUser.setFirstname(userDto.getFirstname());
            }

            if (userDto.getLastname() != null) {
                existingUser.setLastname(userDto.getLastname());
            }

            if (userDto.getRole() != null) {
                existingUser.setRole(userDto.getRole());
            }
        }
        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        try {
            User user = userRepository.getById(id);
            userRepository.delete(user);
        } catch (Exception e) {
            throw new IllegalArgumentException("User not found");
        }
    }

    @Override
    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void createPasswordResetTokenForUser(User user, String token) {
        PasswordResetToken existingToken = passwordResetTokenRepository.findByUser(user);

        if (existingToken != null) {
            existingToken.setToken(token); // Update the existing token
            existingToken.setExpiryDate(PasswordResetToken.calculateExpiryDate(PasswordResetToken.EXPIRATION)); // Reset expiry date
            passwordResetTokenRepository.save(existingToken);
        } else {
            PasswordResetToken newToken = new PasswordResetToken(token, user);
            passwordResetTokenRepository.save(newToken);
        }
    }

    @Override
    public User findUserByEmail(final String email) {
        return userRepository.findByMail(email);
    }

    @Override
    public boolean checkIfValidOldPassword(final User user, final String oldPassword) {
        return passwordEncoder.matches(oldPassword, user.getPassword());
    }

    @Override
    public void changeUserPassword(final User user, final String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public User getUserByPasswordResetToken(String token) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token);

        if (passwordResetToken == null) {
            throw new IllegalArgumentException("The user is not found");
        }

        return passwordResetToken.getUser();
    }



}
