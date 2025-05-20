<<<<<<< HEAD
package ru.store.springbooks.exception;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String entityName, Long id) {
        super(String.format("%s with id %d not found", entityName, id));
    }

    public EntityNotFoundException(String message) {
        super(message);
    }

=======
package ru.store.springbooks.exception;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String entityName, Long id) {
        super(String.format("%s with id %d not found", entityName, id));
    }

    public EntityNotFoundException(String message) {
        super(message);
    }

>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
}