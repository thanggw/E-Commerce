package com.t3h.e_commerce.repository;

import com.t3h.e_commerce.entity.VoucherEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface VoucherRepository extends JpaRepository<VoucherEntity, Long> {
    Optional<VoucherEntity> findByCodeAndActiveIsTrue(String code);

    @Query("SELECT v FROM VoucherEntity v WHERE LOWER(v.code) = LOWER(:code) AND v.active = true")
    Optional<VoucherEntity> findByCodeIgnoreCaseAndActiveIsTrue(@Param("code") String code);


    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END FROM OrderEntity o WHERE o.user.id = :userId AND o.voucher = :voucher")
    boolean existsByUserIdAndVoucher(@Param("userId") Integer userId, @Param("voucher") VoucherEntity voucher);

}

