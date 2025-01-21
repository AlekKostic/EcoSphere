package com.example.Backend.Controllers;

import com.example.Backend.Models.User;
import com.example.Backend.Services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    @GetMapping(value = "/login/{username}/{password}")
    public ResponseEntity<Optional<User>> findUser(@PathVariable("username") String  username, @PathVariable("password") String password){

        Optional<User> user = userServices.findUser(username,password);
        if(user.isPresent()){
            return ResponseEntity.ok(user);
        }else {
            return ResponseEntity.notFound().build();
        }
    }

}
