package com.cffex.controller;


import com.cffex.entity.Comments;
import com.cffex.entity.Keywords;
import com.cffex.repository.CommentRepository;
import com.cffex.repository.KeywordsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;


@RestController
@RequestMapping("/comments")
public class CommentsController {
    @Autowired
    private CommentRepository repository;

    @Autowired
    private KeywordsRepository keywordsRepository;


    private static final Logger logger = LoggerFactory.getLogger(CommentsController.class);


    Integer maxPerPage=5000;


    @RequestMapping(value = "", method = RequestMethod.GET, produces="application/json;charset=UTF-8")
    public List<Comments> getComments() {

        List<Comments> totalRecords=repository.findTop(maxPerPage);
        SecureRandom rand = new SecureRandom();
        List<Comments> randomComments = new ArrayList<>();
        for (int i = 0; i < Math.min(10, totalRecords.size()); i++) {
            int index=rand.nextInt( totalRecords.size());
            randomComments.add( totalRecords.get(index));
        }

        return randomComments;
    }

    @RequestMapping(value = "", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE,produces="application/json;charset=UTF-8")
    public String submitReview(@RequestBody ReviewVo data, HttpServletRequest request) {

        logger.info("client ip is :{}",request.getRemoteHost());

        System.out.println("client ip is :"+request.getRemoteHost());

        List<Keywords> keywords=new ArrayList<>();
        if(data.getKeywords()!=null && !data.getKeywords().isEmpty()){
            String[] words=data.getKeywords().split("\n");
            for(String word: words){
                if(!word.isEmpty())
                    keywords.add(new Keywords(word));
            }
        }

        keywordsRepository.batchInsert(keywords);

        List<Comments> updateList=new ArrayList<>();
        for (Comments comment:data.getReview() ) {
            if("R".equals(comment.getFlag())){
                if(comment.getReviewResult()==null || comment.getReviewResult().isEmpty()){
                    continue;
                }
                comment.setReviewTime(new SimpleDateFormat("YYYY-MM-dd HH:mm:ss", Locale.CHINA).format(new Date()));
                comment.setReviewIp(request.getRemoteHost());
                //comment.setReviewResult(comment.getReviewResult());
                comment.setReviewed("1");
                updateList.add(comment);
            }else if("C".equals(comment.getFlag())){
                if(comment.getConfirmResult()==null || comment.getConfirmResult().isEmpty()){
                    continue;
                }
                comment.setConfirmTime(new SimpleDateFormat("YYYY-MM-dd HH:mm:ss", Locale.CHINA).format(new Date()));
                comment.setConfirmIp(request.getRemoteHost());
                //comment.setConfirmResult(comment.getConfirmResult());
                comment.setConfirmed("1");
                updateList.add(comment);
            }else if("M".equals(comment.getFlag())){
                if(comment.getMediateResult()==null || comment.getMediateResult().isEmpty()){
                    continue;
                }
                comment.setMediateTime(new SimpleDateFormat("YYYY-MM-dd HH:mm:ss", Locale.CHINA).format(new Date()));
                comment.setMediateIp(request.getRemoteHost());
                //comment.setConfirmResult(comment.getConfirmResult());
                comment.setMediated("1");
                updateList.add(comment);
            }
        }
        repository.batchUpdate(updateList);
        return "success";
    }



}