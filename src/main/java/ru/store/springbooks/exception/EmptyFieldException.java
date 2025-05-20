<<<<<<< HEAD
package ru.store.springbooks.exception;


public class EmptyFieldException extends RuntimeException {
    public EmptyFieldException(String fieldName) {
        super(String.format("Поле '%s' не может быть пустым или null", fieldName));
    }
}
=======
package ru.store.springbooks.exception;


public class EmptyFieldException extends RuntimeException {
    public EmptyFieldException(String fieldName) {
        super(String.format("Поле '%s' не может быть пустым или null", fieldName));
    }
}
>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
