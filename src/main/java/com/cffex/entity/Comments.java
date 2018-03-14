package com.cffex.entity;

import java.io.Serializable;

public class Comments implements Serializable {

    private String id;
    private String createTime;
    private String user;
    private String commentCont;
    private String uid;
    private String weiboId;
    private String weiboCont;
    private String weiboCreateTime;
    private String reviewIp;
    private String reviewResult;
    private String reviewed;
    private String reviewTime;
    private String confirmIp;
    private String confirmResult;
    private String confirmed;
    private String confirmTime;
    private String flag;

    private String mediated;
    private String mediateIp;
    private String mediateResult;
    private String mediateTime;

    public String getMediated() {
        return mediated;
    }

    public void setMediated(String mediated) {
        this.mediated = mediated;
    }

    public String getMediateIp() {
        return mediateIp;
    }

    public void setMediateIp(String mediateIp) {
        this.mediateIp = mediateIp;
    }

    public String getMediateResult() {
        return mediateResult;
    }

    public void setMediateResult(String mediateResult) {
        this.mediateResult = mediateResult;
    }

    public String getMediateTime() {
        return mediateTime;
    }

    public void setMediateTime(String mediateTime) {
        this.mediateTime = mediateTime;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    public String getReviewIp() {
        return reviewIp;
    }

    public void setReviewIp(String reviewIp) {
        this.reviewIp = reviewIp;
    }

    public String getReviewResult() {
        return reviewResult;
    }

    public void setReviewResult(String reviewResult) {
        this.reviewResult = reviewResult;
    }

    public String getReviewTime() {
        return reviewTime;
    }

    public void setReviewTime(String reviewTime) {
        this.reviewTime = reviewTime;
    }

    public String getConfirmIp() {
        return confirmIp;
    }

    public void setConfirmIp(String confirmIp) {
        this.confirmIp = confirmIp;
    }

    public String getConfirmResult() {
        return confirmResult;
    }

    public void setConfirmResult(String confirmResult) {
        this.confirmResult = confirmResult;
    }

    public String getConfirmed() {
        return confirmed;
    }

    public void setConfirmed(String confirmed) {
        this.confirmed = confirmed;
    }

    public String getConfirmTime() {
        return confirmTime;
    }

    public void setConfirmTime(String confirmTime) {
        this.confirmTime = confirmTime;
    }

    public String getReviewed() {
        return reviewed;
    }

    public void setReviewed(String reviewed) {
        this.reviewed = reviewed;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getCommentCont() {
        return commentCont;
    }

    public void setCommentCont(String commentCont) {
        this.commentCont = commentCont;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getWeiboId() {
        return weiboId;
    }

    public void setWeiboId(String weiboId) {
        this.weiboId = weiboId;
    }

    public String getWeiboCont() {
        return weiboCont;
    }

    public void setWeiboCont(String weiboCont) {
        this.weiboCont = weiboCont;
    }

    public String getWeiboCreateTime() {
        return weiboCreateTime;
    }

    public void setWeiboCreateTime(String weiboCreateTime) {
        this.weiboCreateTime = weiboCreateTime;
    }
}
