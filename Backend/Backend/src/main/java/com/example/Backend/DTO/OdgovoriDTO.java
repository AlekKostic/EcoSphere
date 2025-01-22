package com.example.Backend.DTO;


public class OdgovoriDTO {
    private String Odgovor;
    private Boolean Tacno;
    private Long id_Pitanja;

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

    public Long getId_Pitanja() {
        return id_Pitanja;
    }

    public void setId_Pitanja(Long id_Pitanja) {
        this.id_Pitanja = id_Pitanja;
    }
}
