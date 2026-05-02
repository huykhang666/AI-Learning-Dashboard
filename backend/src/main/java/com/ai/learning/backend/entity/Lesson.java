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

    private String videoId;

    private Integer orderIndex;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
}
