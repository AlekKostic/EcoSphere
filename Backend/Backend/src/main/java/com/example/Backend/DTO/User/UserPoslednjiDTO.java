package com.example.Backend.DTO.User;

public class UserPoslednjiDTO {
    private Long user_id;
    private Integer delta;

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public Integer getDelta() {
        return delta;
    }

    public void setDelta(Integer delta) {
        this.delta = delta;
    }
}
