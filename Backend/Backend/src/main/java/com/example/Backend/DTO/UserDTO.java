package com.example.Backend.DTO;

import com.example.Backend.Models.User;

import java.util.List;

public class UserDTO {
    private String ime;
    private String prezime;
    private String email;
    private List<Long> postsids;
    private List<Long> likesids;

    public UserDTO(String ime, String prezime, String email, List<Long> postsids, List<Long> likesids) {
        this.ime = ime;
        this.prezime = prezime;
        this.email = email;
        this.postsids = postsids;
        this.likesids = likesids;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Long> getPostsids() {
        return postsids;
    }

    public void setPostsids(List<Long> postsids) {
        this.postsids = postsids;
    }

    public List<Long> getLikesids() {
        return likesids;
    }

    public void setLikesids(List<Long> likesids) {
        this.likesids = likesids;
    }
}
