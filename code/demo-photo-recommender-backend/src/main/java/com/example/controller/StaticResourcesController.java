package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * @author Dmitry Divin
 */
@Controller
public class StaticResourcesController {
    @GetMapping(path = {"/", "/{name:^(?!api|static|api-docs).+}/**"})
    public String index() {
        return "forward:/static/index.html";
    }
}
