<<<<<<< HEAD
package ru.store.springbooks.service;

import java.util.List;

import ru.store.springbooks.model.Book;
import ru.store.springbooks.model.Library;

public interface LibraryService {

    List<Library> findAllLibraries();

    Library saveLibrary(Library library);

    Library getLibraryById(Long id);

    boolean deleteLibrary(Long id);

    Library addUserToLibrary(Long libraryId, Long userId);

    Library updateLibrary(Long id, Library updatedLibrary);

    List<Book> getBooksByLibraryId(Long id);

=======
package ru.store.springbooks.service;

import java.util.List;
import ru.store.springbooks.model.Library;

public interface LibraryService {

    List<Library> findAllLibraries();

    Library saveLibrary(Library library);

    Library getLibraryById(Long id);

    boolean deleteLibrary(Long id);

    Library addUserToLibrary(Long libraryId, Long userId);

    Library updateLibrary(Long id, Library updatedLibrary);

>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
}