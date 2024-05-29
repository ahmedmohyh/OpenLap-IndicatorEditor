package com.openlap.AnalyticsEngine.controller;

import com.openlap.AnalyticsEngine.security.config.TokenProvider;
import com.openlap.AnalyticsEngine.dto.LoginUser;
import com.openlap.AnalyticsEngine.service.AnalyticsEngineService;
import com.openlap.AnalyticsEngine.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 Created By Ao on 2023/4/16
 */

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenProvider jwtTokenUtil;

    @Autowired
    private UserService userService;

    @Autowired
    AnalyticsEngineService analyticsEngineService;

    @PostMapping("/UserLogin")
    @ResponseBody
    public ResponseEntity<?> login(@RequestBody LoginUser loginUser) throws AuthenticationException {
        return analyticsEngineService.UserLogin(loginUser);
    }
}
