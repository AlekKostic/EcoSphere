package com.example.Backend.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.engine.internal.Cascade;

import java.util.Date;
import java.util.List;

@Table(name = "User")
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Long Id;

    @Column(name = "ime", nullable = false)
    private String ime;

    @Column(name = "prezime", nullable = false)
    private String prezime;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @OneToMany(mappedBy = "user")
    private List<Like> lajkovaneObjave;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Postovi> posts;

    @Column(name = "brojPoena", nullable = true)
    private Integer brojPoena;

    @Column(name = "kviz_radjen")
    private Date poslednjiKviz;

    @OneToMany(mappedBy = "user")
    private List<Product> productList;

    @OneToMany(mappedBy = "user")
    private List<Sacuvane> sacuvane;

    @Column(name = "streak")
    private Integer streak;

    @Column(name = "poslednjiPoeni")
    private Integer poslednjiPoeni;

    @Column(name = "poslednjiStreak")
    private Integer poslednjiStreak;

    @Column(name = "uso")
    private Boolean uso;

    public Integer getPoslednjiPoeni() {
        return poslednjiPoeni;
    }

    public void setPoslednjiPoeni(Integer poslednjiPoeni) {
        this.poslednjiPoeni = poslednjiPoeni;
    }

    public Integer getPoslednjiStreak() {
        return poslednjiStreak;
    }

    public void setPoslednjiStreak(Integer poslednjiStreak) {
        this.poslednjiStreak = poslednjiStreak;
    }

    public Boolean getUso() {
        return uso;
    }

    public void setUso(Boolean uso) {
        this.uso = uso;
    }

    public Integer getStreak() {
        return streak;
    }

    public void setStreak(Integer streak) {
        this.streak = streak;
    }

    public List<Product> getProductList() {
        return productList;
    }

    public void setProductList(List<Product> productList) {
        this.productList = productList;
    }

    public List<Sacuvane> getSacuvane() {
        return sacuvane;
    }

    public void setSacuvane(List<Sacuvane> sacuvane) {
        this.sacuvane = sacuvane;
    }

    public List<Like> getLajkovaneObjave() {
        return lajkovaneObjave;
    }

    public void setLajkovaneObjave(List<Like> lajkovaneObjave) {
        this.lajkovaneObjave = lajkovaneObjave;
    }

    public List<Postovi> getPosts() {
        return posts;
    }

    public void setPosts(List<Postovi> posts) {
        this.posts = posts;
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getBrojPoena() {
        return brojPoena;
    }

    public void setBrojPoena(Integer brojPoena) {
        this.brojPoena = brojPoena;
    }

    public Date getPoslednjiKviz() {
        return poslednjiKviz;
    }

    public void setPoslednjiKviz(Date poslednjiKviz) {
        this.poslednjiKviz = poslednjiKviz;
    }
}
