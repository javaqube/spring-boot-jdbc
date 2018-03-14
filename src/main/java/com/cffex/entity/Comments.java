package com.cffex.entity;

import java.io.Serializable;

//@Entity
//@Table(name = "t_weibo_and_comment")
public class Comments implements Serializable {

    //    @Id
//    @Column(name = "comment_id")
    private String id;

//    @Column(name = "comment_create_time")

    private String createTime;

    //    @Column(name = "comment_user")
    private String user;


    //    @Column(name = "comment_cont")
    private String commentCont;

    //    @Column(name = "comment_uid")
    private String uid;

    //    @Column(name = "weibo_id")
    private String weiboId;


    //    @Column(name = "weibo_cont")
    private String weiboCont;

    //    @Column(name = "weibo_create_time")
    private String weiboCreateTime;

    //    @Column(name = "review_ip")
    private String reviewIp;

    //    @Column(name = "review_result")
    private String reviewResult;

    //    @Column(name = "reviewed")
    private String reviewed;

    //    @Column(name = "review_time")
    private String reviewTime;

    //    @Column(name = "confirm_ip")
    private String confirmIp;

    //    @Column(name = "confirm_result")
    private String confirmResult;

    //    @Column(name = "confirmed")
    private String confirmed;

    //    @Column(name = "confirm_time")
    private String confirmTime;

    //    @Column(name = "flag")
    private String flag;

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
