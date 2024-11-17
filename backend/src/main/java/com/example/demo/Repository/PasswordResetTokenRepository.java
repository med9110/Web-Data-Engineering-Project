package com.example.demo.Repository;

import com.example.demo.entities.PasswordResetToken;
import com.example.demo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    PasswordResetToken findByUser(User user);

    PasswordResetToken findByToken(String token);

    void deleteByToken(String token);
}
