package com.example.Backend.Controllers;

import com.example.Backend.DTO.OdgovoriDTO;
import com.example.Backend.Models.Odgovori;
import com.example.Backend.Services.OdgovoriServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v3/api")
public class OdgovoriController {
    @Autowired
    private OdgovoriServices odgovoriServices;

    @GetMapping(value = "/{id}")
    public List<Odgovori> getall(@PathVariable("id") Long  Id){
        return odgovoriServices.getAll(Id);
    }

    @PostMapping(value = "/create")
    public ResponseEntity<Odgovori> create(@RequestBody OdgovoriDTO odgovoriDTO){
        System.out.println(odgovoriDTO.getOdgovor());
        return odgovoriServices.create(odgovoriDTO);
    }
}
