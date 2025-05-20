<<<<<<< HEAD
package ru.store.springbooks.service;

import org.springframework.core.io.Resource;

import java.util.concurrent.CompletableFuture;


public interface LogService {

    Resource generateAndReturnLogFile(String date);

    CompletableFuture<String> generateLogFileForDateAsync(String date);

    String getTaskStatus(String taskId);

    String getLogFilePath(String taskId);

=======
package ru.store.springbooks.service;

import org.springframework.core.io.Resource;

import java.util.concurrent.CompletableFuture;


public interface LogService {

    Resource generateAndReturnLogFile(String date);

    CompletableFuture<String> generateLogFileForDateAsync(String date);

    String getTaskStatus(String taskId);

    String getLogFilePath(String taskId);

>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
}