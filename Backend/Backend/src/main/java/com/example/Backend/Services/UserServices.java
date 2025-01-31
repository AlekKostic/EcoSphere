package com.example.Backend.Services;

import com.example.Backend.DTO.User.UserPoeniDTO;
import com.example.Backend.DTO.User.UserResetDTO;
import com.example.Backend.DTO.User.UserDTO;
import com.example.Backend.DTO.User.UserLoginDTO;
import com.example.Backend.Models.*;
import com.example.Backend.Repository.LikeRepository;
import com.example.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
public class UserServices {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;


    public User saveUser(User user) {
        if(userRepository.existsUserByEmail(user.getEmail())){
            return null;
        }else {
            return userRepository.save(user);
        }
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

        List<Long> product = new ArrayList<>();
        for (Product product1 : user.get().getProductList()){
            product.add(product1.getProduct_id());
        }
        List<Long> sacuvane = new ArrayList<>();
        for (Sacuvane sacuvane1 : user.get().getSacuvane()){
            sacuvane.add(sacuvane1.getProduct().getProduct_id());
        }
        return new UserDTO(user.get().getIme(), user.get().getPrezime(), user.get().getEmail(), posts, likes, user.get().getId(),user.get().getBrojPoena(), user.get().getPoslednjiKviz(), product, sacuvane);
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

        List<Long> product = new ArrayList<>();
        for (Product product1 : user.getProductList()){
            product.add(product1.getProduct_id());
        }

        List<Long> sacuvane = new ArrayList<>();
        for (Sacuvane sacuvane1 : user.getSacuvane()){
            sacuvane.add(sacuvane1.getProduct().getProduct_id());
        }
        return new UserDTO(user.getIme(), user.getPrezime(), user.getEmail(), posts, likes, user.getId(), user.getBrojPoena(), user.getPoslednjiKviz(), product, sacuvane);
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

    public ResponseEntity plus(UserPoeniDTO userPoeniDTO){
        User user = userRepository.findById(userPoeniDTO.getUser_id()).orElseThrow(()->new RuntimeException("User nije pronadjen"));
        user.setBrojPoena(user.getBrojPoena() + userPoeniDTO.getBroj_poena());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    public Boolean radjen(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        Date date = new Date();
        if(user.getPoslednjiKviz() == date){
            return true;
        }else {
            return false;
        }
    }

    public ResponseEntity uradjen(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        Date date = new Date();
        user.setPoslednjiKviz(date);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
}