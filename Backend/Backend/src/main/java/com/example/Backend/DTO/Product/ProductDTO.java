package com.example.Backend.DTO.Product;

public class ProductDTO {
    private String path;
    private String description;
    private String name;
    private String phone_number;
    private Float price;
    private Integer broj_pregleda;
    private Long user_id;


    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Integer getBroj_pregleda() {
        return broj_pregleda;
    }

    public void setBroj_pregleda(Integer broj_pregleda) {
        this.broj_pregleda = broj_pregleda;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }
}
