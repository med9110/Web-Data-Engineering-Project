package com.example.demo.services;

public interface PasswordResetTokenService {
    String validatePasswordResetToken(String token);

    void deleteByToken(String token);
}
