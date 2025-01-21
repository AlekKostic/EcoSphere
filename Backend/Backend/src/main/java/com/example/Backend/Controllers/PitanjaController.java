package com.example.Backend.Controllers;

import com.example.Backend.Models.Pitanja;
import com.example.Backend.Services.PitanjaServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v2/api")
public class PitanjaController {

    @Autowired
    private PitanjaServices pitanjaServices;

    @GetMapping("/")
    public ResponseEntity<List<Pitanja>> getAll(){
        return ResponseEntity.ok(pitanjaServices.getAll());
    }
}
