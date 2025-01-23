package com.example.Backend.DTO;

import com.example.Backend.Models.Postovi;

import java.util.List;

public class LikesDTO {
    private Long id_likes;
    private Postovi postovis;

    public LikesDTO(Long id_likes, Postovi postovis) {
        this.id_likes = id_likes;
        this.postovis = postovis;
    }

    public Long getId_likes() {
        return id_likes;
    }

    public void setId_likes(Long id_likes) {
        this.id_likes = id_likes;
    }

    public Postovi getPostovis() {
        return postovis;
    }

    public void setPostovis(Postovi postovis) {
        this.postovis = postovis;
    }
}
