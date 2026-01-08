package com.jobtracker.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "interviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private JobApplication application;

    private Integer round;

    private LocalDateTime interviewDate;

    private String interviewerName;

    private String interviewerTitle;

    @Enumerated(EnumType.STRING)
    private InterviewType type;

    @ElementCollection
    @CollectionTable(name = "interview_questions", joinColumns = @JoinColumn(name = "interview_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> questions;

    @ElementCollection
    @CollectionTable(name = "interview_self_answers", joinColumns = @JoinColumn(name = "interview_id"))
    @Column(name = "answer", columnDefinition = "TEXT")
    private List<String> selfAnswers;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Integer confidenceScore; // 1-5

    private Integer fitScore; // 1-5

    private Boolean wantContinue;

    @Builder.Default
    private boolean reminderSent = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
