package com.example.Backend.Services;

import com.example.Backend.Models.Pitanja;
import com.example.Backend.Repository.PitanjaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PitanjaServices {
    @Autowired
    private PitanjaRepository pitanjaRepository;

    public List<Pitanja> getAll(){
       return pitanjaRepository.findAllNative();
    }
}
