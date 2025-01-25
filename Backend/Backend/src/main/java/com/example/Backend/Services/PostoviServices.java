package com.example.Backend.Services;

import com.example.Backend.DTO.Post.PostCreateDTO;
import com.example.Backend.DTO.Post.PostLikeDTO;
import com.example.Backend.Models.Like;
import com.example.Backend.Models.Postovi;
import com.example.Backend.Models.User;
import com.example.Backend.Repository.LikeRepository;
import com.example.Backend.Repository.PostoviRepository;
import com.example.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostoviServices {
    @Autowired
    private PostoviRepository postoviRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    public List<Postovi> getAll(){
        return postoviRepository.findAll();
    }

    public Postovi create(PostCreateDTO postCreateDTO){
        User user = userRepository.findById(postCreateDTO.getUser_id()).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        Postovi postovi = new Postovi();
        postovi.setAuthor(user);
        postovi.setContent(postCreateDTO.getContext());
        postovi.setLajkovi(null);
        return postoviRepository.save(postovi);
    }

    public List<Like> findLike(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        List<Like> likes = likeRepository.findAllByUser(user);
        return likes;
    }

    public Postovi findLikesUser(Long id){
        return postoviRepository.findById(id).orElseThrow(() -> new RuntimeException("Post nije pronadjen"));
    }

    public List<Postovi> findPosts(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        return postoviRepository.findAllByAuthor(user);
    }

    public ResponseEntity like(PostLikeDTO postLikeDTO){
        User user = userRepository.findById(postLikeDTO.getUser_id()).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        Postovi postovi = postoviRepository.findById(postLikeDTO.getPost_id()).orElseThrow(()-> new RuntimeException("Post nije pronadjen"));
        Like like = new Like();
        like.setPost(postovi);
        like.setUser(user);
        likeRepository.save(like);
        user.getLajkovaneObjave().add(like);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity unlike(PostLikeDTO postLikeDTO){
        Like like = likeRepository.findByPost_IdAndUser_Id(postLikeDTO.getPost_id(), postLikeDTO.getUser_id());
        like.setUser(null);
        like.setPost(null);
        likeRepository.save(like);
        Postovi postovi = postoviRepository.findById(postLikeDTO.getPost_id()).orElseThrow(()->new RuntimeException("Post ne postoji"));
        Integer index = postovi.getLajkovi().indexOf(like);
        postovi.getLajkovi().remove(index);
        postoviRepository.save(postovi);
        return ResponseEntity.ok().build();
    }
}
