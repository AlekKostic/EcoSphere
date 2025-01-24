package com.example.Backend.Controllers;

import com.example.Backend.DTO.User.UserDTO;
import com.example.Backend.DTO.User.UserLoginDTO;
import com.example.Backend.DTO.User.UserResetDTO;
import com.example.Backend.Models.User;
import com.example.Backend.Services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping(value = "/login")
    public UserDTO findUser(@RequestBody UserLoginDTO userLoginDTO){
       return userServices.findUser(userLoginDTO);
    }

    @GetMapping("/{id}")
    public UserDTO find(@PathVariable("id") Long id){
        return userServices.find(id);
    }

    @PostMapping("/reset")
    public ResponseEntity reset(@RequestBody UserResetDTO userResetDTO){
        return userServices.reset(userResetDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity delete(@PathVariable("id") Long id){
        return userServices.delete(id);
    }
}
