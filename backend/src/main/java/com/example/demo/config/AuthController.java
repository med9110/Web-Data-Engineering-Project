package com.example.demo.config;

import com.example.demo.Repository.UserRepository;
import com.example.demo.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
@CrossOrigin("*")
@RestController
@RequestMapping("/auth/login")
public class AuthController {


    @Autowired
    private UserRepository userRepository;

    private JwtEncoder jwtEncoder;

    private AuthenticationManager authenticationManagerUser;


    public AuthController( UserRepository userRepository, JwtEncoder jwtEncoder, AuthenticationManager authenticationManagerUser) {
        this.userRepository = userRepository;
        this.authenticationManagerUser =authenticationManagerUser;
        this.jwtEncoder = jwtEncoder;


    }


    @PostMapping("/users")
    public Map<String , String> loginUsers(@RequestBody Map<String, String>loginData){
        String username = loginData.get("username");
        String password = loginData.get("password");


        Authentication authentication = authenticationManagerUser.authenticate( new UsernamePasswordAuthenticationToken(username, password));

        Instant instant = Instant.now();
        System.out.println("instant::::::::::::::::::::::::::::::::"+instant);

        User user = userRepository.findByMail(username);

        String authorities = authentication.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.joining(" "));

        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);


        if(user != null){
            claims.put("id", user.getId());
            claims.put("name", user.getFirstname());
            claims.put("isFirstAuth" , user.getIsFirstAuth());
            claims.put("isConfirmed", user.isConfirmed());
        }

        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .issuedAt(instant)
                .claim("authorities", authorities)
                .expiresAt(instant.plus(10, ChronoUnit.MINUTES))
                .subject(username)
                .claim("claims", claims)
                .build();

        JwtEncoderParameters jwtEncoderParameters = JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS512).build(),
                jwtClaimsSet
        );

        String jwt = jwtEncoder.encode(jwtEncoderParameters).getTokenValue();

        return  Map.of("access token", jwt);

    }

}
