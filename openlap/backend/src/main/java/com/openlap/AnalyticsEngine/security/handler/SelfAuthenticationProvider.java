package com.openlap.AnalyticsEngine.security.handler;

import com.openlap.AnalyticsEngine.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SelfAuthenticationProvider implements AuthenticationProvider{
    @Autowired
    UserService userService;

    private final BCryptPasswordEncoder passwordEncoder;
    public SelfAuthenticationProvider(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String account= authentication.getName();
        String password= (String) authentication.getCredentials();
        UserDetails userDetails= userService.loadUserByUsername(account);
        boolean checkPassword= passwordEncoder.matches(password,userDetails.getPassword());
        if(!checkPassword){
            throw new BadCredentialsException("The username or password is incorrect, please log in again!");
        }
        return new UsernamePasswordAuthenticationToken(account,password,userDetails.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }
}
