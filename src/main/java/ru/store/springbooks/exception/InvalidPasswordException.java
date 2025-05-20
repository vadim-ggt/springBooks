<<<<<<< HEAD
package ru.store.springbooks.exception;

public class InvalidPasswordException extends RuntimeException {
    public InvalidPasswordException() {
        super("Пароль должен содержать как минимум 8 символов и включать "
                + "хотя бы одну цифру и одну заглавную букву.");
    }
=======
package ru.store.springbooks.exception;

public class InvalidPasswordException extends RuntimeException {
    public InvalidPasswordException() {
        super("Пароль должен содержать как минимум 8 символов и включать "
                + "хотя бы одну цифру и одну заглавную букву.");
    }
>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
}