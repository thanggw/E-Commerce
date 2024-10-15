package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.dto.requests.UserRequestFilter;
import com.t3h.e_commerce.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findUserByUsername(String username);

    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);

    @Query(value = "select u from UserEntity u " +
            " where (:#{#filter.username} is null or u.username LIKE CONCAT('%', :#{#filter.username}, '%')) and" +
            " (:#{#filter.email} is null or u.email LIKE CONCAT('%', :#{#filter.email}, '%')) and" +
            " (:#{#filter.phone} is null or u.phone LIKE CONCAT('%', :#{#filter.phone}, '%')) and" +
            " (:#{#filter.address} is null or u.address LIKE CONCAT('%', :#{#filter.address}, '%')) and" +
            " (:#{#filter.fullName} is null or CONCAT(u.firstName, ' ', u.lastName) LIKE CONCAT('%', :#{#filter.fullName}, '%'))")
    Page<UserEntity> findAllUserByConditions(@Param("filter") UserRequestFilter filter, Pageable pageable);



}
