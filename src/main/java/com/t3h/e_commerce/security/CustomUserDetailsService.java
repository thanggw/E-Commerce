package com.t3h.e_commerce.security;

import com.t3h.e_commerce.entity.RoleEntity;
import com.t3h.e_commerce.entity.UserEntity;
import com.t3h.e_commerce.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.thymeleaf.util.StringUtils;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        UserEntity user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
//        return new User(user.getUsername(), user.getPassword(),
//                user.getRoles().stream()
//                        .map(role -> new SimpleGrantedAuthority("ROLE_" +role.getCode()))
//                        .collect(Collectors.toSet()));
//    }
        if (StringUtils.isEmpty(username)){
            throw new UsernameNotFoundException("Username is empty");
        }
        UserEntity userEntity = userRepository.findByUsernameAndDeletedIsFalse(username);
        if (userEntity == null){
            throw new UsernameNotFoundException("User not found");
        }
        //Tạo ra danh sách quyền của spring security
        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        //Lấy ra danh sách quyền của user
        Set<RoleEntity> roleEntities = userEntity.getRoles();
        //duyệt danh sách quyền của user để lấy ra và đưa vào trong spring security để spring xác định được các quyền của user đó
        for (RoleEntity roleEntity : roleEntities){
            //thêm từng phần tử quyền cho security
            grantedAuthorities.add(new SimpleGrantedAuthority(SecurityUtils.PREFIX_ROLE+roleEntity.getCode()));
        }
        //trả về đối tượng user với các thông tin user name , password, role để spring security xác thực
        return new User(userEntity.getUsername(), userEntity.getPassword(), grantedAuthorities);
    }


}