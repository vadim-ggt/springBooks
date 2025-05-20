<<<<<<< HEAD
package ru.store.springbooks.service;

import java.util.List;
import ru.store.springbooks.model.Library;
import ru.store.springbooks.model.User;

public interface UserService {

    List<User> findAllUsers();

    User saveUser(User user);

    User getUserById(Long id);

    boolean deleteUser(Long id);

    List<Library> getUserLibraries(Long id);

    User updateUser(Long id, User updatedUser);

=======
package ru.store.springbooks.service;

import java.util.List;
import ru.store.springbooks.model.Library;
import ru.store.springbooks.model.User;

public interface UserService {

    List<User> findAllUsers();

    User saveUser(User user);

    User getUserById(Long id);

    boolean deleteUser(Long id);

    List<Library> getUserLibraries(Long id);

    User updateUser(Long id, User updatedUser);

>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
}