<<<<<<< HEAD
package ru.store.springbooks.controller;


import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.store.springbooks.service.VisitCounterService;

@RestController
@RequestMapping("/visits")
@RequiredArgsConstructor
public class VisitCounterController {

    private final VisitCounterService visitCounterService;

    @GetMapping("/count")
    public ResponseEntity<Integer> getVisitCount(@RequestParam String url) {
        return ResponseEntity.ok(visitCounterService.getVisitCount(url));
    }

    @GetMapping("/total")
    public ResponseEntity<Map<String, Integer>> getTotalVisitCount() {
        return ResponseEntity.ok(
                Map.of("total", visitCounterService.getTotalVisitCount())
        );
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Integer>> getAllVisitCounts() {
        return ResponseEntity.ok(visitCounterService.getAllVisitCounts());
    }
=======
package ru.store.springbooks.controller;


import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.store.springbooks.service.VisitCounterService;

@RestController
@RequestMapping("/visits")
@RequiredArgsConstructor
public class VisitCounterController {

    private final VisitCounterService visitCounterService;

    @GetMapping("/count")
    public ResponseEntity<Integer> getVisitCount(@RequestParam String url) {
        return ResponseEntity.ok(visitCounterService.getVisitCount(url));
    }

    @GetMapping("/total")
    public ResponseEntity<Map<String, Integer>> getTotalVisitCount() {
        return ResponseEntity.ok(
                Map.of("total", visitCounterService.getTotalVisitCount())
        );
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Integer>> getAllVisitCounts() {
        return ResponseEntity.ok(visitCounterService.getAllVisitCounts());
    }
>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
}