package com.booksshop.service;

import com.booksshop.common.ErrorCode;
import com.booksshop.dto.LoginRequest;
import com.booksshop.dto.LoginResponse;
import com.booksshop.dto.UserInfo;
import com.booksshop.entity.User;
import com.booksshop.exception.BusinessException;
import com.booksshop.repository.UserRepository;
import com.booksshop.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_FAILED));

        if (!passwordEncoder.matches(request.passwd(), user.getPasswd())) {
            throw new BusinessException(ErrorCode.AUTH_FAILED);
        }

        String token = jwtProvider.generateToken(user.getUserId(), user.getNames(), user.getRoles());
        UserInfo userInfo = UserInfo.from(user);
        return LoginResponse.of(token, jwtProvider.getExpirationSeconds(), userInfo);
    }

    public UserInfo me(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TOKEN_INVALID));
        return UserInfo.from(user);
    }
}
