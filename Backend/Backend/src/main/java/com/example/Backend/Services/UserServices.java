package com.example.Backend.Services;

import com.example.Backend.DTO.User.*;
import com.example.Backend.Models.*;
import com.example.Backend.Repository.*;
import com.example.Backend.Utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


@Service
public class UserServices {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private SacuvaneRepository sacuvaneRepository;

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private PostoviRepository postoviRepository;


    public User saveUser(User user) {
        if(userRepository.existsUserByEmail(user.getEmail())){
            return null;
        }else {
            return userRepository.save(user);
        }
    }

    public List<UserDTO> findAll(){
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            List<Long> likes = new ArrayList<>();
            for(Like like : user.getLajkovaneObjave()){
                likes.add(like.getUser().getId());
            }
            List<Long> posts = new ArrayList<>();
            for (Postovi postovi : user.getPosts()){
                posts.add(user.getId());
            }

            List<Long> product = new ArrayList<>();
            for (Product product1 : user.getProductList()){
                product.add(product1.getProduct_id());
            }
            List<Long> sacuvane = new ArrayList<>();
            for (Sacuvane sacuvane1 : user.getSacuvane()){
                sacuvane.add(sacuvane1.getProduct().getProduct_id());
            }
            return new UserDTO(user.getIme(), user.getPrezime(), user.getEmail(), posts, likes, user.getId(),user.getBrojPoena(), user.getPoslednjiKviz(), product, sacuvane, user.getStreak(), user.getPoslednjiPoeni(), user.getPoslednjiStreak(), user.getUso());
        }).collect(Collectors.toList());
    }

    public UserDTO findUser(UserLoginDTO userLoginDTO) {
        Optional<User> user = userRepository.findByEmailAndPassword(userLoginDTO.getEmail(), userLoginDTO.getPassword());
        List<Long> likes = new ArrayList<>();
        for(Like like : user.get().getLajkovaneObjave()){
            likes.add(like.getUser().getId());
        }
        List<Long> posts =new ArrayList<>();
        for (Postovi postovi : user.get().getPosts()){
            posts.add(user.get().getId());
        }

        List<Long> product = new ArrayList<>();
        for (Product product1 : user.get().getProductList()){
            product.add(product1.getProduct_id());
        }
        List<Long> sacuvane = new ArrayList<>();
        for (Sacuvane sacuvane1 : user.get().getSacuvane()){
            sacuvane.add(sacuvane1.getProduct().getProduct_id());
        }
        return new UserDTO(user.get().getIme(), user.get().getPrezime(), user.get().getEmail(), posts, likes, user.get().getId(),user.get().getBrojPoena(), user.get().getPoslednjiKviz(), product, sacuvane, user.get().getStreak(), user.get().getPoslednjiPoeni(), user.get().getPoslednjiStreak(), user.get().getUso());
    }

    public UserDTO find(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        List<Long> likes = new ArrayList<>();
        for(Like like : user.getLajkovaneObjave()){
            likes.add(like.getPost().getId());
        }
        List<Long> posts =new ArrayList<>();
        for (Postovi postovi : user.getPosts()){
            posts.add(postovi.getId());
        }

        List<Long> product = new ArrayList<>();
        for (Product product1 : user.getProductList()){
            product.add(product1.getProduct_id());
        }

        List<Long> sacuvane = new ArrayList<>();
        for (Sacuvane sacuvane1 : user.getSacuvane()){
            sacuvane.add(sacuvane1.getProduct().getProduct_id());
        }
        return new UserDTO(user.getIme(), user.getPrezime(), user.getEmail(), posts, likes, user.getId(), user.getBrojPoena(), user.getPoslednjiKviz(), product, sacuvane, user.getStreak(), user.getPoslednjiPoeni(), user.getPoslednjiStreak(), user.getUso());
    }

    public ResponseEntity reset(UserResetDTO userResetDTO){
        User user = userRepository.findById(userResetDTO.getId_user()).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        user.setPassword(userResetDTO.getPassword());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity delete(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        List<Sacuvane> sacuvanes = sacuvaneRepository.findByUser(user);
        List<Product> productList = productRepository.findByUser(user);
        List<Postovi> postoviList = postoviRepository.findAllByAuthor(user);
        for (Sacuvane sacuvane : sacuvanes){
            sacuvane.setUser(null);
            sacuvane.setProduct(null);
            sacuvaneRepository.save(sacuvane);
            sacuvaneRepository.delete(sacuvane);
        }
        for (Product product : productList){
            product.setUser(null);
            productRepository.save(product);
            productRepository.delete(product);
        }
        for (Postovi postovi : postoviList){
            postovi.setAuthor(null);
            postovi.setLajkovi(null);
            postoviRepository.save(postovi);
            postoviRepository.delete(postovi);
        }
        likeRepository.setLikesToNullForUser(id);
        userRepository.delete(user);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity plus(UserPoeniDTO userPoeniDTO){
        User user = userRepository.findById(userPoeniDTO.getUser_id()).orElseThrow(()->new RuntimeException("User nije pronadjen"));
        user.setBrojPoena(user.getBrojPoena() + userPoeniDTO.getBroj_poena());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    public Boolean radjen(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        Date date = new Date();
        if(DateUtils.istiDatum(user.getPoslednjiKviz(), date)){
            return true;
        }else {
            return false;
        }
    }

    public ResponseEntity uradjen(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        Date date = new Date();
        user.setPoslednjiKviz(date);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity streak(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        user.setStreak(user.getStreak() + 1);
        user.setUso(false);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    public Boolean unstreak(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        Date date = new Date();
        long razlika = Math.abs(user.getPoslednjiKviz().getTime() - date.getTime());
        long daniRazlika = TimeUnit.DAYS.convert(razlika, TimeUnit.MILLISECONDS);
        if (daniRazlika >= 2){
            user.setStreak(0);
            userRepository.save(user);
            return true;
        }else {
            return false;
        }
    }

    public ResponseEntity promenaPoeni(UserPoslednjiDTO userPoslednjiDTO){
        User user = userRepository.findById(userPoslednjiDTO.getUser_id()).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        user.setPoslednjiPoeni(user.getPoslednjiPoeni() + userPoslednjiDTO.getDelta());
        userRepository.save(user);
        return ResponseEntity.ok("Bodovi promenjeni za: " + userPoslednjiDTO.getDelta());
    }

    public ResponseEntity promenaStreak(UserPoslednjiDTO userPoslednjiDTO){
        User user = userRepository.findById(userPoslednjiDTO.getUser_id()).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        user.setPoslednjiStreak(user.getPoslednjiStreak() + userPoslednjiDTO.getDelta());
        userRepository.save(user);
        return ResponseEntity.ok("Streak promenjeni za: " + userPoslednjiDTO.getDelta());
    }

    public Boolean uso(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        return user.getUso();
    }

    public ResponseEntity drvo(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        user.setUso(true);
        userRepository.save(user);
        return ResponseEntity.ok("User je uso u drvo");
    }
}