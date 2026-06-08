package com.ai.learning.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String thumbnailUrl;

    private Double price;

    @Column(unique = true)
    private String slug;

    @Builder.Default
    private boolean isPremiumRequired = false;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @OrderBy("orderIndex ASC")
    private List<Lesson> lessons;

    @PrePersist
    @PreUpdate
    protected void onCreateOrUpdate() {
        this.slug = com.ai.learning.backend.util.SlugUtils.makeSlug(this.title);
    }
}
