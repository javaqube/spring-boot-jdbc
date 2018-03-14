package com.cffex.controller;

import com.cffex.entity.Comments;

import java.io.Serializable;
import java.util.List;

public class ReviewVo implements Serializable {
    private List<Comments> review;
    private String keywords;

    public List<Comments> getReview() {
        return review;
    }

    public void setReview(List<Comments> review) {
        this.review = review;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }
}
