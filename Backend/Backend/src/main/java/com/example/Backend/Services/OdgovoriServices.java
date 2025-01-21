package com.example.Backend.Services;

import com.example.Backend.Models.Odgovori;
import com.example.Backend.Repository.OdgovoriRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OdgovoriServices {
    @Autowired
    private OdgovoriRepository odgovoriRepository;

    public List<Odgovori> getAll(Long id) {
        return odgovoriRepository.findByPitanjeId(id);
    }
}
