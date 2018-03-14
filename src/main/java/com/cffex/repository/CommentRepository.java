package com.cffex.repository;


import com.cffex.entity.Comments;
import com.cffex.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class CommentRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Comments> findTop(int n) {
        List<Comments> result = jdbcTemplate.query(
                " SELECT * FROM t_weibo_and_comment\n" +
                        "  where reviewed is null or confirmed is null\n" +
                        "  or (review_result=1 and confirm_result=0 and mediated is NULL)\n" +
                        "  or (review_result=0 and confirm_result=1 and mediated is NULL)\n"+
                        "  order by comment_id desc, confirmed desc LIMIT " + n,
                (rs, rowNum) -> {
                    Comments comment = new Comments();
                    comment.setId(rs.getString("comment_id"));
                    comment.setUser(rs.getString("comment_user"));
                    comment.setCommentCont(rs.getString("comment_cont"));
                    comment.setCreateTime(rs.getString("comment_create_time"));
                    comment.setReviewed(rs.getString("reviewed"));
                    comment.setReviewIp(rs.getString("review_ip"));
                    comment.setReviewTime(rs.getString("review_time"));
                    comment.setReviewResult(rs.getString("review_result"));
                    comment.setConfirmed(rs.getString("confirmed"));
                    comment.setConfirmIp(rs.getString("confirm_ip"));
                    comment.setConfirmTime(rs.getString("confirm_time"));
                    comment.setConfirmResult(rs.getString("confirm_result"));

                    return comment;
                }
        );
        return result;
    }

    public void batchUpdate(List<Comments> list) {

        List<Object[]> argList = new ArrayList<>();
        for (Comments c : list) {
            argList.add(new Object[]{
                    c.getReviewed(), c.getReviewIp(), c.getReviewTime(), c.getReviewResult(),
                    c.getConfirmed(), c.getConfirmIp(),c.getConfirmTime(), c.getConfirmResult(),
                    c.getMediated(), c.getMediateIp(),c.getMediateTime(), c.getMediateResult(),
                    c.getId()
            });
        }

        String sql="update t_weibo_and_comment \n" +
                "set reviewed=?,review_ip=?,review_time=?, review_result=?,\n" +
                "confirmed=?,confirm_ip=?,confirm_time=?,confirm_result=?,\n" +
                "mediated=?,mediate_ip=?,mediate_time=?,mediate_result=? \n" +
                "where comment_id=?";

        jdbcTemplate.batchUpdate(sql, argList);

    }


}
