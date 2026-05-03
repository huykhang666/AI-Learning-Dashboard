package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.User;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    // Find User by Email
    Optional<User> findByEmail(String email);

    // Check email exists
    Boolean existsByEmail(String email);

    //Check username exists
    Boolean existsByUsername(String username);

    // Find username
    Optional<User> findByUsername(String username);

    //Delete User
    void deleteByUserId(Long userId);

    @Query("SELECT u FROM User u WHERE u.isPremium = true AND u.premiumExpiredAt > CURRENT_TIMESTAMP")
    List<User> findAllActivePremiumUsers();
}
