package com.ai.learning.backend.repository;

import com.ai.learning.backend.entity.User;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    // Find User by Email
    Optional<User> findByEmail(String email);

    // Check email exists
    Boolean existsByEmail(String email);

    //Check username exists
    Boolean existsByUsername(String username);

    // Find username
    Optional<User> findByUsername(String username);

    //Delete User
    void deleteByUserId(Integer userId);
}
