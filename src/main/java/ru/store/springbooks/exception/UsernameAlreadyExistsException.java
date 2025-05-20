<<<<<<< HEAD
package ru.store.springbooks.exception;

public class UsernameAlreadyExistsException extends RuntimeException {
    public UsernameAlreadyExistsException(String username) {
        super(String.format("Пользователь с именем '%s' уже существует", username));
    }
=======
package ru.store.springbooks.exception;

public class UsernameAlreadyExistsException extends RuntimeException {
    public UsernameAlreadyExistsException(String username) {
        super(String.format("Пользователь с именем '%s' уже существует", username));
    }
>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
}