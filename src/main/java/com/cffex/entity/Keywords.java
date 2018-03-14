package com.cffex.entity;

import java.io.Serializable;
import java.util.Random;

//@Entity
//@Table(name = "t_keywords")
public class Keywords implements Serializable {

    public Keywords(){

    }
    public Keywords(String content){
        this.content=content;
    }

//    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    @Column(name = "id")
    private long id= new Random().nextInt();

//    @Column(name = "content")
    private String content;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
