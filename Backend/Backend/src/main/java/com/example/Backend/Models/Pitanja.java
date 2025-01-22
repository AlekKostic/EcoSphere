package com.example.Backend.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(name = "Pitanja")
@Entity
@Getter
@Setter
public class Pitanja {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_pitanja;

    @Column(name =  "pitanje")
    private String pitanje;

    public Long getId_Pitanja() {
        return id_pitanja;
    }

    public void setId_Pitanja(Long id_Pitanja) {
        id_pitanja = id_Pitanja;
    }

    public String getPitanje() {
        return pitanje;
    }

    public void setPitanje(String pitanje) {
        this.pitanje = pitanje;
    }

}
