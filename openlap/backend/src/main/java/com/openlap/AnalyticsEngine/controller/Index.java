package com.openlap.AnalyticsEngine.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 Created By Ao on 2023/4/16
 */

@RestController
public class Index {
    @GetMapping("index")
    public String index(){
        return "index";
    }

}
