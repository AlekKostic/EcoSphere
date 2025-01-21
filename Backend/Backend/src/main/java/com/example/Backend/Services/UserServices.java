package com.example.Backend.Services;

import com.example.Backend.Models.User;
import com.example.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class UserServices {
    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findUser(String ime, String Passwod) {
        Optional<User> user = userRepository.findByImeAndPassword(ime, Passwod);
        return user;
    }

}