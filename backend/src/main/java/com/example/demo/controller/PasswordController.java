package com.example.demo.controller;

import com.example.demo.Repository.PasswordResetTokenRepository;
import com.example.demo.dto.PasswordDto;
import com.example.demo.entities.PasswordResetToken;
import com.example.demo.entities.User;
import com.example.demo.services.PasswordResetTokenService;
import com.example.demo.services.Userservice;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
public class PasswordController {

    private static final Logger log = LoggerFactory.getLogger(PasswordController.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MessageSource messages;

    @Autowired
    private Userservice userservice;

    @Autowired
    private Environment env;

    @Autowired
    private PasswordResetTokenService passwordResetTokenService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @PostMapping("/user/resetpassword")
    public ResponseEntity<?> resetPassword(HttpServletRequest request, @RequestParam("email") String userEmail) {
        log.info("Password reset request received for email: {}", userEmail);

        // Check if the user exists
        User user = userservice.findUserByEmail(userEmail);
        if (user == null) {
            log.warn("Password reset requested for non-existent email: {}", userEmail);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Generate a new token and save it
        String token = UUID.randomUUID().toString();
        userservice.createPasswordResetTokenForUser(user, token);

        // Send the reset password email
        try {
            mailSender.send(constructResetTokenEmail(request.getLocale(), token, user));
            log.info("Password reset email sent to: {}", userEmail);
        } catch (MailException e) {
            log.error("Error sending password reset email to {}: {}", userEmail, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send password reset email.");
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset link sent to " + userEmail);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/user/passwordupdate")
    public ResponseEntity<?> updatePassword(@RequestParam("token") String token, @Valid @RequestBody PasswordDto passwordDto) {
        log.info("Password update request received with token: {}", token);

        // Validate the token
        String result = passwordResetTokenService.validatePasswordResetToken(token);
        if (result != null) {
            log.warn("Invalid token provided for password update: {}", token);
            return ResponseEntity.badRequest().body("Invalid token");
        }

        // Retrieve the user associated with the token
        User user = userservice.getUserByPasswordResetToken(token);
        if (user == null) {
            log.error("No user associated with the provided token: {}", token);
            return ResponseEntity.badRequest().body("Invalid token");
        }

        // Update the user's password
        userservice.changeUserPassword(user, passwordDto.getNewPassword());
        log.info("Password successfully updated for user: {}", user.getMail());

        // Optionally, remove the token after successful password update
        passwordResetTokenService.deleteByToken(token);

        return ResponseEntity.ok("Password updated successfully");
    }

    private SimpleMailMessage constructResetTokenEmail(Locale locale, String token, User user) {
        String frontendUrl = "http://localhost:3000"; // Update this to your frontend URL and port
        String url = frontendUrl + "/updatePassword?token=" + token; // Updated URL
        String message = messages.getMessage("message.resetPassword", null, locale);
        return constructEmail("Reset Password", message + " \r\n" + url, user);
    }

    private SimpleMailMessage constructEmail(String subject, String body, User user) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setSubject(subject);
        email.setText(body);
        email.setTo(user.getMail());
        email.setFrom(env.getProperty("support.email"));
        return email;
    }
}
