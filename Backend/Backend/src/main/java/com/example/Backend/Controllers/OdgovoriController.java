package com.example.Backend.Controllers;

import com.example.Backend.Models.Odgovori;
import com.example.Backend.Services.OdgovoriServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
