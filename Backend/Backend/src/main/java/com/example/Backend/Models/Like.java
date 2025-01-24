package com.example.Backend.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Table(name = "likes")
@Entity
@Getter
@Setter
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_like;

    @ManyToOne
    @JoinColumn(name = "post_id", referencedColumnName = "id_posta", nullable = true)
    private Postovi post;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = true)
    private User user;

    public Long getId_like() {
        return id_like;
    }

    public void setId_like(Long id_like) {
        this.id_like = id_like;
    }

    public Postovi getPost() {
        return post;
    }

    public void setPost(Postovi post) {
        this.post = post;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Like() {
    }
}
