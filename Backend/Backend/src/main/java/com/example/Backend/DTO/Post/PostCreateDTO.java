package com.example.Backend.DTO.Post;


public class PostCreateDTO {
    private Long user_id;
    private String context;


    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }
}
