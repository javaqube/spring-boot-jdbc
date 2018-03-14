package com.cffex.repository;



import com.cffex.entity.Keywords;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class KeywordsRepository  {
    @Autowired
    private JdbcTemplate jdbcTemplate;

//    public Keywords findKeywordsById(String id);
//
//    public Page<Keywords> findAll(Pageable pageable);

    public void batchInsert(List<Keywords> keywords){
        List<Object[]> argList=new ArrayList<>();
        for(Keywords key: keywords){
            argList.add(new String[]{key.getContent()});
        }
        jdbcTemplate.batchUpdate("INSERT INTO t_keywords(content) VALUES (?)",argList);
    }
}
