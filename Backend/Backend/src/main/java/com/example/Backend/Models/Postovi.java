package com.example.Backend.Models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Table(name = "post")
@Entity
@Getter
@Setter
public class Postovi {
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public List<Like> getLajkovi() {
        return lajkovi;
    }

    public void setLajkovi(List<Like> lajkovi) {
        this.lajkovi = lajkovi;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_posta")
    private Long id;

    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonBackReference
    private User author;

    @OneToMany(mappedBy = "post")
    @JsonIgnore
    private List<Like> lajkovi;

    public Postovi() {
    }
}
