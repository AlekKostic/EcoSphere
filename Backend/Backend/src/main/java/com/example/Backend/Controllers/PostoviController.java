package com.example.Backend.Controllers;

import com.example.Backend.DTO.PostCreateDTO;
import com.example.Backend.DTO.PostDTO;
import com.example.Backend.Models.Postovi;
import com.example.Backend.Services.PostoviServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}

