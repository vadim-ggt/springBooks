<<<<<<< HEAD
package ru.store.springbooks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.store.springbooks.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Modifying
    @Query(value = "DELETE FROM library_users WHERE user_id = :userId", nativeQuery = true)
    void deleteUserLibraryLinks(@Param("userId") Long userId);

=======
package ru.store.springbooks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.store.springbooks.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Modifying
    @Query(value = "DELETE FROM library_users WHERE user_id = :userId", nativeQuery = true)
    void deleteUserLibraryLinks(@Param("userId") Long userId);

>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
}