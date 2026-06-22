package com.booksshop.controller;

import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 검증용 엔드포인트.
 * GET /api/health -> {"status":"ok"}
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping(value = "/health", produces = MediaType.APPLICATION_JSON_VALUE)
    public String health() {
        // org.json 으로 객체 -> JSON 문서 변환
        return new JSONObject().put("status", "ok").toString();
    }
}
