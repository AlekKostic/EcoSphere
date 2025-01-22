package com.example.Backend.Services;

import com.example.Backend.DTO.PostCreateDTO;
import com.example.Backend.Models.Postovi;
import com.example.Backend.Models.User;
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
}
