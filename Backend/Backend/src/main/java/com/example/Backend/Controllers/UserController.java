package com.example.Backend.Controllers;

import com.example.Backend.DTO.User.*;
import com.example.Backend.Models.User;
import com.example.Backend.Services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/getAll")
    public List<UserDTO> findAll(){
        return userServices.findAll();
    }

    @PutMapping("/streak/{id}")
    public ResponseEntity streak(@PathVariable("id") Long id){
        return userServices.streak(id);
    }

    @PutMapping("/unstreak/{id}")
    public Boolean unstreak(@PathVariable("id") Long id){
        return userServices.unstreak(id);
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

    @PutMapping("/bodovi")
    public ResponseEntity bodovi(@RequestBody UserPoeniDTO userPoeniDTO){
        return userServices.plus(userPoeniDTO);
    }

    @GetMapping("/radjen/{id}")
    public Boolean radjen(@PathVariable("id") Long id){
        return  userServices.radjen(id);
    }

    @PutMapping("/uradjen/{id}")
    public ResponseEntity uradjen(@PathVariable("id") Long id){
        return userServices.uradjen(id);
    }

    @PutMapping("/poeni")
    public ResponseEntity promenaPoeni(@RequestBody UserPoslednjiDTO userPoslednjiDTO){
        return userServices.promenaPoeni(userPoslednjiDTO);
    }

    @PutMapping("/promena")
    public ResponseEntity promenaStreak(@RequestBody UserPoslednjiDTO userPoslednjiDTO){
        return userServices.promenaStreak(userPoslednjiDTO);
    }

    @GetMapping("/uso/{id}")
    public Boolean uso(@PathVariable("id") Long id){
        return userServices.uso(id);
    }
    @PutMapping("/drvo/{id}")
    public ResponseEntity drvo(@PathVariable("id") Long id){
        return userServices.drvo(id);
    }
}
