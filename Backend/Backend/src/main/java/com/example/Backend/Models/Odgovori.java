package com.example.Backend.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "Odgovori")
public class Odgovori {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_Odgovora;

    @Column(name = "Odgovor", nullable = false)
    private String Odgovor;

    @Column(name = "Tacno", nullable = false)
    private Boolean Tacno;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_Pitanja")
    private Pitanja Pitanje;

    public Long getId_Odgovora() {
        return id_Odgovora;
    }

    public void setId_Odgovora(Long id_Odgovora) {
        this.id_Odgovora = id_Odgovora;
    }

    public String getOdgovor() {
        return Odgovor;
    }

    public void setOdgovor(String odgovor) {
        Odgovor = odgovor;
    }

    public Boolean getTacno() {
        return Tacno;
    }

    public void setTacno(Boolean tacno) {
        Tacno = tacno;
    }

    public Pitanja getPitanje() {
        return Pitanje;
    }

    public void setPitanje(Pitanja pitanje) {
        Pitanje = pitanje;
    }
}
