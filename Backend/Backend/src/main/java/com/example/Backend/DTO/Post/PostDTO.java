package com.example.Backend.DTO.Post;

import java.util.List;

public class PostDTO {
    private Long id;
    private String content;
    private Long authorId;
    private List<Long> likedIds;

    public PostDTO(Long id, String content, Long authorid, List<Long> likedIds) {
        this.id = id;
        this.content = content;
        this.authorId = authorid;
        this.likedIds = likedIds;
    }

    public PostDTO(Long id, String content) {
        this.id = id;
        this.content = content;
    }

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

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public List<Long> getLikedIds() {
        return likedIds;
    }

    public void setLikedIds(List<Long> likedIds) {
        this.likedIds = likedIds;
    }
}
