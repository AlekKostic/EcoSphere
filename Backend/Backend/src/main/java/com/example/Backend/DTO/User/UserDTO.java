package com.example.Backend.DTO.User;

import org.springframework.data.relational.core.sql.In;

import java.util.Date;
import java.util.List;

public class UserDTO {
    private String ime;
    private String prezime;
    private String email;
    private List<Long> postsids;
    private List<Long> likesids;
    private Long user_id;
    private Integer broj_bodova;
    private Date radjen;
    private List<Long> productids;
    private List<Long> sacuvaniProductids;
    private Integer streak;

    public UserDTO(String ime, String prezime, String email, List<Long> postsids, List<Long> likesids, Long user_id, Integer broj_bodova, Date radjen, List<Long> productids, List<Long> sacuvaniProductids, Integer streak) {
        this.ime = ime;
        this.prezime = prezime;
        this.email = email;
        this.postsids = postsids;
        this.likesids = likesids;
        this.user_id = user_id;
        this.broj_bodova = broj_bodova;
        this.radjen = radjen;
        this.productids = productids;
        this.sacuvaniProductids = sacuvaniProductids;
        this.streak = streak;
    }

    public UserDTO(String ime, String prezime, String email, List<Long> postsids, List<Long> likesids) {
        this.ime = ime;
        this.prezime = prezime;
        this.email = email;
        this.postsids = postsids;
        this.likesids = likesids;
    }

    public Integer getStreak() {
        return streak;
    }

    public void setStreak(Integer streak) {
        this.streak = streak;
    }

    public List<Long> getSacuvaniProductids() {
        return sacuvaniProductids;
    }

    public void setSacuvaniProductids(List<Long> sacuvaniProductids) {
        this.sacuvaniProductids = sacuvaniProductids;
    }

    public List<Long> getProductids() {
        return productids;
    }

    public void setProductids(List<Long> productids) {
        this.productids = productids;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
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

    public Integer getBroj_bodova() {
        return broj_bodova;
    }

    public void setBroj_bodova(Integer broj_bodova) {
        this.broj_bodova = broj_bodova;
    }

    public Date getRadjen() {
        return radjen;
    }

    public void setRadjen(Date radjen) {
        this.radjen = radjen;
    }
}
