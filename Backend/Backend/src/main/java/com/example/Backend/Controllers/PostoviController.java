package com.example.Backend.Controllers;

import com.example.Backend.DTO.LikesDTO;
import com.example.Backend.DTO.Post.PostCreateDTO;
import com.example.Backend.DTO.Post.PostDTO;
import com.example.Backend.DTO.Post.PostLikeDTO;
import com.example.Backend.Models.Like;
import com.example.Backend.Models.Postovi;
import com.example.Backend.Services.PostoviServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v4/api")
public class PostoviController {
    @Autowired
    private PostoviServices postoviServices;

    @GetMapping
    public List<PostDTO> getAll(){
        List<Postovi> postovis = postoviServices.getAll();
        return postovis.stream()
                .map(post -> {
                    List<Long> likedIds = post.getLajkovi().stream()
                            .map(lajk -> lajk.getUser().getId())
                            .collect(Collectors.toList());

                    return new PostDTO(post.getId(), post.getContent(), post.getAuthor().getId(), likedIds);
                })
                .collect(Collectors.toList());
    }

    @PostMapping("/create")
    public ResponseEntity<Postovi> create(@RequestBody PostCreateDTO postCreateDTO){
        return ResponseEntity.ok(postoviServices.create(postCreateDTO));
    }

    @GetMapping("/user/{id}") // koje postove je user lajkovao
    public List<LikesDTO> findLike(@PathVariable("id") Long id){
        List<Like> likes = postoviServices.findLike(id);
        return likes.stream().map(like -> {
            Postovi postovi = like.getPost();
            return new LikesDTO(like.getId_like(), like.getPost());
        }).collect(Collectors.toList());
    }

    @GetMapping("/{id}") // ko je lajkovao postove
    public PostDTO findLikesUser(@PathVariable("id") Long id){
        Postovi postovi = postoviServices.findLikesUser(id);
        List<Long> likes = new ArrayList<>();
        for(Like like : postovi.getLajkovi()){
            likes.add(like.getUser().getId());
        }
        return new PostDTO(postovi.getId(), postovi.getContent(), postovi.getAuthor().getId(), likes);
    }

    @GetMapping("/post/{id}")
    public List<PostDTO> findPosts(@PathVariable("id") Long id){
        List<Postovi> postovi = postoviServices.findPosts(id);
        return postovi.stream()
                .map(post -> {
                    List<Long> likedIds = post.getLajkovi().stream()
                            .map(lajk -> lajk.getUser().getId())
                            .collect(Collectors.toList());

                    return new PostDTO(post.getId(), post.getContent(), post.getAuthor().getId(), likedIds);
                })
                .collect(Collectors.toList());
    }

    @PostMapping("/like")
    public ResponseEntity like(@RequestBody PostLikeDTO postLikeDTO){
        return postoviServices.like(postLikeDTO);
    }

    @PutMapping("/unlike")
    public ResponseEntity unlike(@RequestBody PostLikeDTO postLikeDTO){
        return postoviServices.unlike(postLikeDTO);
    }
}

