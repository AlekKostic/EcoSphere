package com.example.Backend.DTO.User;


public class UserPoeniDTO {
    private Integer broj_poena;
    private Long user_id;

    public Integer getBroj_poena() {
        return broj_poena;
    }

    public void setBroj_poena(Integer broj_poena) {
        this.broj_poena = broj_poena;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }
}
