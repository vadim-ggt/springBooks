<<<<<<< HEAD
package ru.store.springbooks.exception;

public class InvalidAuthorNameException extends RuntimeException {
    public InvalidAuthorNameException(String message) {
        super("Invalid value in field: " + message + ". Author name should not contain numbers.");
    }
}
=======
package ru.store.springbooks.exception;

public class InvalidAuthorNameException extends RuntimeException {
    public InvalidAuthorNameException(String message) {
        super("Invalid value in field: " + message + ". Author name should not contain numbers.");
    }
}
>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
