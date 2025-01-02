package com.javaweb.repository.custom.impl;

import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.entity.User;
import com.javaweb.repository.custom.UserRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.lang.reflect.Field;
import java.util.List;

@Repository
public class UserRepositoryCustomImpl implements UserRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    private void queryJoin(StringBuilder sql, UserSearchRequest userSearchRequest) {
        String role = userSearchRequest.getRole();

        if (StringUtils.hasText(role)) {
            sql.append(" JOIN user_role ur ON u.id = ur.userid \n" +
                    " JOIN role r ON r.id = ur.roleid ");
        }
    }

    private void queryWhere(StringBuilder queryWhere, UserSearchRequest userSearchRequest) {
        try {
            // Java Reflection
            Field[] fields = userSearchRequest.getClass().getDeclaredFields();
            for (Field field : fields) {
                field.setAccessible(true);
                String fieldName = field.getName();
                String value = field.get(userSearchRequest) != null ? field.get(userSearchRequest).toString() : null;
                if (StringUtils.hasText(value)) {
                    if (fieldName.equals("role")) {
                        queryWhere.append(" AND r.code LIKE '%").append(value).append("%' ");
                    } else {
                        queryWhere.append(" AND ").append(fieldName).append(" LIKE '%").append(value).append("%' ");
                    }
                }
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    @Override
    public List<User> findAll(UserSearchRequest userSearchRequest) {
        String sql = queryBuildFilter(userSearchRequest);
        Query query = em.createNativeQuery(sql, User.class);
        return query.getResultList();
    }

    private String queryBuildFilter(UserSearchRequest userSearchRequest) {
        StringBuilder sql = new StringBuilder("SELECT u.* FROM `user` u ");
        queryJoin(sql, userSearchRequest);
        StringBuilder where = new StringBuilder(" WHERE 1 = 1 ");
        queryWhere(where, userSearchRequest);
        where.append(" AND u.status = 1 ");

        return sql.append(where).toString();
    }
}
