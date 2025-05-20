<<<<<<< HEAD
package ru.store.springbooks.service.impl;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.store.springbooks.exception.EmptyFieldException;
import ru.store.springbooks.exception.EntityNotFoundException;
import ru.store.springbooks.model.Book;
import ru.store.springbooks.model.Library;
import ru.store.springbooks.model.User;
import ru.store.springbooks.repository.LibraryRepository;
import ru.store.springbooks.repository.UserRepository;
import ru.store.springbooks.service.LibraryService;
import ru.store.springbooks.utils.CustomCache;

@Slf4j
@Service
@RequiredArgsConstructor
public class LibraryServiceImpl implements LibraryService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final CustomCache<Long, Library> libraryCache;


    @Override
    public List<Library> findAllLibraries() {
        return libraryRepository.findAll();
    }

    @Override
    public Library saveLibrary(Library library) {
        if (library.getName() == null) {
            throw new EmptyFieldException("library.name");
        }

        if (library.getAddress() == null || library.getAddress().isBlank()) {
            throw new EmptyFieldException("library.address");
        }

        Library savedLibrary = libraryRepository.save(library);
        libraryCache.put(savedLibrary.getId(), savedLibrary);
        log.info("Library saved and added to cache: {}", savedLibrary);
        return savedLibrary;
    }


    @Override
    public Library getLibraryById(Long id) {
        Library cachedLibrary = libraryCache.get(id);
        if (cachedLibrary != null) {
            log.info("Library fetched from cache: {}", cachedLibrary);
            return cachedLibrary;
        }

        Library library = libraryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Library", id));

        libraryCache.put(id, library);
        log.info("Library fetched from DB and added to cache: {}", library);
        return library;
    }


    @Override
    public boolean deleteLibrary(Long id) {
        if (!libraryRepository.existsById(id)) {
            log.error("Library with ID {} not found, deletion failed", id);
            throw new EntityNotFoundException("Library", id);
        }

        libraryRepository.deleteById(id);
        libraryCache.remove(id);
        log.info("Library deleted from DB and cache: {}", id);
        return true;
    }


    @Override
    public Library addUserToLibrary(Long libraryId, Long userId) {
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new EntityNotFoundException("Library", libraryId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User", userId));


        if (library.getUsers().contains(user)) {
            throw new RuntimeException("Пользователь уже добавлен в библиотеку");
        }

        library.getUsers().add(user);
        user.getLibraries().add(library);



        Library updatedLibrary = libraryRepository.save(library);
        userRepository.save(user);


        libraryCache.put(updatedLibrary.getId(), updatedLibrary);
        log.info("User {} added to Library {} and updated in cache", userId, libraryId);
        return updatedLibrary;
    }

    @Override
    public Library updateLibrary(Long id, Library updatedLibrary) {
        Library library = libraryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Library", id));

        // Проверка полей updatedLibrary на null и пустоту
        if (updatedLibrary.getName() == null || updatedLibrary.getName().isBlank()) {
            throw new EmptyFieldException("library.name");
        }

        if (updatedLibrary.getAddress() == null || updatedLibrary.getAddress().isBlank()) {
            throw new EmptyFieldException("library.address");
        }

        // Если все проверки пройдены, обновляем существующую библиотеку
        library.setName(updatedLibrary.getName());
        library.setAddress(updatedLibrary.getAddress());

        // Сохраняем библиотеку и обновляем кэш
        Library savedLibrary = libraryRepository.save(library);
        if (savedLibrary == null) {
            throw new IllegalStateException("Failed to save library.");
        }

        libraryCache.put(savedLibrary.getId(), savedLibrary);

        log.info("Library updated and cache refreshed: {}", savedLibrary);
        return savedLibrary;
    }

    @Override
    public List<Book> getBooksByLibraryId(Long libraryId) {
        // Получаем библиотеку по ID
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new EntityNotFoundException("Library", libraryId));

        // Возвращаем список книг, относящихся к этой библиотеке
        return library.getBooks();
    }

}
=======
package ru.store.springbooks.service.impl;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.store.springbooks.exception.EmptyFieldException;
import ru.store.springbooks.exception.EntityNotFoundException;
import ru.store.springbooks.model.Book;
import ru.store.springbooks.model.Library;
import ru.store.springbooks.model.User;
import ru.store.springbooks.repository.LibraryRepository;
import ru.store.springbooks.repository.UserRepository;
import ru.store.springbooks.service.LibraryService;
import ru.store.springbooks.utils.CustomCache;

@Slf4j
@Service
@RequiredArgsConstructor
public class LibraryServiceImpl implements LibraryService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final CustomCache<Long, Library> libraryCache;


    @Override
    public List<Library> findAllLibraries() {
        return libraryRepository.findAll();
    }

    @Override
    public Library saveLibrary(Library library) {
        if (library.getName() == null || library.getName().isBlank()) {
            throw new EmptyFieldException("library.name");
        }

        if (library.getAddress() == null || library.getAddress().isBlank()) {
            throw new EmptyFieldException("library.address");
        }

        Library savedLibrary = libraryRepository.save(library);
        libraryCache.put(savedLibrary.getId(), savedLibrary);
        log.info("Library saved and added to cache: {}", savedLibrary);
        return savedLibrary;
    }


    @Override
    public Library getLibraryById(Long id) {
        Library cachedLibrary = libraryCache.get(id);
        if (cachedLibrary != null) {
            log.info("Library fetched from cache: {}", cachedLibrary);
            return cachedLibrary;
        }

        Library library = libraryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Library", id));

        libraryCache.put(id, library);
        log.info("Library fetched from DB and added to cache: {}", library);
        return library;
    }


    @Override
    public boolean deleteLibrary(Long id) {
        if (!libraryRepository.existsById(id)) {
            log.error("Library with ID {} not found, deletion failed", id);
            throw new EntityNotFoundException("Library", id);
        }

        libraryRepository.deleteById(id);
        libraryCache.remove(id);
        log.info("Library deleted from DB and cache: {}", id);
        return true;
    }


    @Override
    public Library addUserToLibrary(Long libraryId, Long userId) {
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new EntityNotFoundException("Library", libraryId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User", userId));

        library.getUsers().add(user);
        user.getLibraries().add(library);

        Library updatedLibrary = libraryRepository.save(library);
        userRepository.save(user);

        libraryCache.put(updatedLibrary.getId(), updatedLibrary);
        log.info("User {} added to Library {} and updated in cache", userId, libraryId);
        return updatedLibrary;
    }

    @Override
    public Library updateLibrary(Long id, Library updatedLibrary) {
        Library library = libraryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Library", id));

        // Проверка полей updatedLibrary на null и пустоту
        if (updatedLibrary.getName() == null || updatedLibrary.getName().isBlank()) {
            throw new EmptyFieldException("library.name");
        }

        if (updatedLibrary.getAddress() == null || updatedLibrary.getAddress().isBlank()) {
            throw new EmptyFieldException("library.address");
        }

        // Если все проверки пройдены, обновляем существующую библиотеку
        library.setName(updatedLibrary.getName());
        library.setAddress(updatedLibrary.getAddress());

        // Сохраняем библиотеку и обновляем кэш
        Library savedLibrary = libraryRepository.save(library);
        if (savedLibrary == null) {
            throw new IllegalStateException("Failed to save library.");
        }

        libraryCache.put(savedLibrary.getId(), savedLibrary);

        log.info("Library updated and cache refreshed: {}", savedLibrary);
        return savedLibrary;
    }
}
>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
