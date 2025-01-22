package com.example.Backend.Services;

import com.example.Backend.DTO.OdgovoriDTO;
import com.example.Backend.Models.Odgovori;
import com.example.Backend.Models.Pitanja;
import com.example.Backend.Repository.OdgovoriRepository;
import com.example.Backend.Repository.PitanjaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OdgovoriServices {
    @Autowired
    private OdgovoriRepository odgovoriRepository;

    @Autowired
    private PitanjaRepository pitanjaRepository;

    public List<Odgovori> getAll(Long id) {
        return odgovoriRepository.findByPitanjeId(id);
    }

    public ResponseEntity<Odgovori> create(OdgovoriDTO odgovordto){
        Pitanja pitanja = pitanjaRepository.findById(odgovordto.getId_Pitanja()).orElseThrow(() -> new RuntimeException("user nije pronadjen"));
        Odgovori odgovori = new Odgovori();
        System.out.println(odgovordto.getOdgovor());
        odgovori.setOdgovor(odgovordto.getOdgovor());
        odgovori.setTacno(odgovordto.getTacno());
        odgovori.setPitanje(pitanja);
        return ResponseEntity.ok(odgovoriRepository.save(odgovori));
    }
}
