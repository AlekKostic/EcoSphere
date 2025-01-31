package com.example.Backend.Models;

import jakarta.persistence.*;

@Table(name = "sacuvane")
@Entity
public class Sacuvane {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sacuvano_id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private  User user;

    public Sacuvane() {
    }

    public Long getSacuvano_id() {
        return sacuvano_id;
    }

    public void setSacuvano_id(Long sacuvano_id) {
        this.sacuvano_id = sacuvano_id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
