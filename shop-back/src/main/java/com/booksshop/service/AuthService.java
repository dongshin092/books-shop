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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> {
                    log.info("로그인 실패 - userId={}, 사유=존재하지 않는 사용자", request.userId());
                    return new BusinessException(ErrorCode.AUTH_FAILED);
                });

        if (!passwordEncoder.matches(request.passwd(), user.getPasswd())) {
            log.info("로그인 실패 - userId={}, 사유=비밀번호 불일치", request.userId());
            throw new BusinessException(ErrorCode.AUTH_FAILED);
        }

        String token = jwtProvider.generateToken(user.getUserId(), user.getNames(), user.getRoles());
        UserInfo userInfo = UserInfo.from(user);
        log.info("로그인 성공 - userId={}", user.getUserId());
        return LoginResponse.of(token, jwtProvider.getExpirationSeconds(), userInfo);
    }

    public UserInfo me(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TOKEN_INVALID));
        return UserInfo.from(user);
    }
}
