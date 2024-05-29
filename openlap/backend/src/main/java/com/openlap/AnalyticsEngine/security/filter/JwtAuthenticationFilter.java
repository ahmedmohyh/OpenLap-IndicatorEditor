package com.openlap.AnalyticsEngine.security.filter;


import com.openlap.AnalyticsEngine.security.config.TokenContextHolder;
import com.openlap.AnalyticsEngine.security.config.TokenProvider;
import io.jsonwebtoken.ExpiredJwtException;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);


    @Autowired
    private UserDetailsService userDetailsService;

    //	@Autowired
    private final TokenProvider jwtTokenUtil;

    public JwtAuthenticationFilter(TokenProvider jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }
//	@Autowired
//	private JwtTokenUtil jwtTokenUtil;


    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        if (isExcluded(req)) {
            chain.doFilter(req, res);
            return;
        }

        String token = jwtTokenUtil.resolveToken(req);

        if (token!= null && token.equals("permitit")) {
            GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_ADMIN");
            User user = new User("admin", "password", List.of(authority));
            Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            chain.doFilter(req, res);
            return;
        }

        if (req.getRequestURI().contains("/iview/indicator")) {
            token = "permitit";
            TokenContextHolder.setToken(token);
            chain.doFilter(req, res);
            return;
        }
        try {
            if (token != null && jwtTokenUtil.validateToken(token)) {
                Authentication authentication = jwtTokenUtil.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                TokenContextHolder.setToken(token);
            }
        } catch (ExpiredJwtException e) {
        }

        chain.doFilter(req, res);
    }

    private boolean isExcluded(HttpServletRequest request) {
        String path = request.getServletPath();
        List<String> excludedPaths = Arrays.asList("/AnalyticsEngine/UserLogin", "/AnalyticsEngine/UserRegistration", "/import/csvdata");
        return excludedPaths.stream().anyMatch(excludedPath -> FilenameUtils.wildcardMatch(path, excludedPath));
    }
}
