package com.example.Backend.Controllers;

import com.example.Backend.DTO.PostDTO;
import com.example.Backend.DTO.UserDTO;
import com.example.Backend.DTO.UserLoginDTO;
import com.example.Backend.Models.Like;
import com.example.Backend.Models.Postovi;
import com.example.Backend.Models.User;
import com.example.Backend.Services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/api")
public class UserController {
    @Autowired
    private UserServices userServices;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user){
        User savedUser = userServices.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping(value = "/login")
    public ResponseEntity<Optional<User>> findUser(@RequestBody UserLoginDTO userLoginDTO){

        Optional<User> user = userServices.findUser(userLoginDTO);
        if(user.isPresent()){
            return ResponseEntity.ok(user);
        }else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public UserDTO find(@PathVariable("id") Long id){
        return userServices.find(id);
    }

}
