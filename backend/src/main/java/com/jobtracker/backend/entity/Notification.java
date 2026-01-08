package com.jobtracker.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type; // INTERVIEW_REMINDER, FOLLOW_UP, STATUS_UPDATE

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column
    private String channel; // IN_APP, EMAIL, or both (represented as comma separated?)
    // Actually user request says "channel -- IN_APP / EMAIL".
    // A single notification might be sent via both?
    // Usually we store the notification record as the "Event".
    // If we send via Email, we might log that separately or just rely on 'sentAt'.
    // Let's stick to simple "IN_APP" for the persisted notification shown in UI.
    // Email is ephemeral unless we want a log.
    // The user's schema has `channel`. Let's assume this record is primarily for
    // IN_APP history,
    // but maybe we mark if it was also emailed?
    // Let's default to "IN_APP" for database records designed to be shown in the
    // bell menu.

    @Builder.Default
    @JsonProperty("isRead")
    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Builder.Default
    @Column(name = "\"read\"", nullable = false)
    private boolean read = false;

    // Helper to keep both columns in sync
    public void setRead(boolean read) {
        this.isRead = read;
        this.read = read;
    }

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime sentAt;
}
