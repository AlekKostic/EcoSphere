package com.example.Backend.Services;

import com.example.Backend.DTO.UserDTO;
import com.example.Backend.DTO.UserLoginDTO;
import com.example.Backend.Models.Like;
import com.example.Backend.Models.Postovi;
import com.example.Backend.Models.User;
import com.example.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class UserServices {
    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findUser(UserLoginDTO userLoginDTO) {
        Optional<User> user = userRepository.findByImeAndPassword(userLoginDTO.getEmail(), userLoginDTO.getPassword());
        return user;
    }

    public UserDTO find(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        List<Long> likes = new ArrayList<>();
        for(Like like : user.getLajkovaneObjave()){
            likes.add(like.getUser().getId());
        }
        List<Long> posts =new ArrayList<>();
        for (Postovi postovi : user.getPosts()){
            posts.add(user.getId());
        }
        return new UserDTO(user.getIme(), user.getPrezime(), user.getEmail(), posts, likes);
    }
}