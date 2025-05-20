<<<<<<< HEAD
package ru.store.springbooks.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super(String.format("Пользователь с email '%s' уже существует", email));
    }
=======
package ru.store.springbooks.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super(String.format("Пользователь с email '%s' уже существует", email));
    }
>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
}