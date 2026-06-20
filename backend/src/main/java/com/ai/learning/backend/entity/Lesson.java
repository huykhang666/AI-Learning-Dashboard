package com.ai.learning.backend.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lessonId;

    private String title;

    private String videoUrl;

    private String thumbnailUrl;

    private Integer orderIndex;

    @Column(nullable = false, columnDefinition = "integer default 600")
    @Builder.Default
    private Integer duration = 600;

    private String chapter;

    private String documentUrl;

    private String documentName;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
}
