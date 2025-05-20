<<<<<<< HEAD
package ru.store.springbooks.service;

import java.util.List;
import java.util.Map;
import ru.store.springbooks.model.Book;


public interface BookService {

    List<Book> findAllBooks();

    List<Book> saveBooksBulk(List<Book> books);

    Book saveBook(Book book);

    Book getBookById(Long id);

    boolean deleteBook(Long id);

    List<Book> searchBook(Map<String, String> params);

    Book updateBook(Long id, Book updatedBook);
}
=======
package ru.store.springbooks.service;

import java.util.List;
import java.util.Map;
import ru.store.springbooks.model.Book;


public interface BookService {

    List<Book> findAllBooks();

    List<Book> saveBooksBulk(List<Book> books);

    Book saveBook(Book book);

    Book getBookById(Long id);

    boolean deleteBook(Long id);

    List<Book> searchBook(Map<String, String> params);

    Book updateBook(Long id, Book updatedBook);
}
>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
