package com.example.Backend.Services;

import com.example.Backend.DTO.User.UserResetDTO;
import com.example.Backend.DTO.User.UserDTO;
import com.example.Backend.DTO.User.UserLoginDTO;
import com.example.Backend.Models.Like;
import com.example.Backend.Models.Postovi;
import com.example.Backend.Models.User;
import com.example.Backend.Repository.LikeRepository;
import com.example.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class UserServices {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public UserDTO findUser(UserLoginDTO userLoginDTO) {
        Optional<User> user = userRepository.findByEmailAndPassword(userLoginDTO.getEmail(), userLoginDTO.getPassword());
        List<Long> likes = new ArrayList<>();
        for(Like like : user.get().getLajkovaneObjave()){
            likes.add(like.getUser().getId());
        }
        List<Long> posts =new ArrayList<>();
        for (Postovi postovi : user.get().getPosts()){
            posts.add(user.get().getId());
        }
        return new UserDTO(user.get().getIme(), user.get().getPrezime(), user.get().getEmail(), posts, likes);
    }

    public UserDTO find(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        List<Long> likes = new ArrayList<>();
        for(Like like : user.getLajkovaneObjave()){
            likes.add(like.getPost().getId());
        }
        List<Long> posts =new ArrayList<>();
        for (Postovi postovi : user.getPosts()){
            posts.add(postovi.getId());
        }
        return new UserDTO(user.getIme(), user.getPrezime(), user.getEmail(), posts, likes);
    }

    public ResponseEntity reset(UserResetDTO userResetDTO){
        User user = userRepository.findById(userResetDTO.getId_user()).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        user.setPassword(userResetDTO.getPassword());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity delete(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        likeRepository.setLikesToNullForUser(id);
        userRepository.delete(user);
        return ResponseEntity.ok().build();
    }
}