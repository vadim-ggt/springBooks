<<<<<<< HEAD
package ru.store.springbooks.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.store.springbooks.model.Book;
import ru.store.springbooks.model.Library;
import ru.store.springbooks.repository.LibraryRepository;
import ru.store.springbooks.service.BookService;

@Tag(name = "Book Controller", description = "API для управления книгами")
@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService  service;
    private final LibraryRepository libraryRepository;

    @GetMapping
    @Operation(summary = "Получить все книги", description = "Возвращает список всех книг")
    @ApiResponse(responseCode = "200", description = "Список книг успешно получен")
    public List<Book> findAllBooks() {
        return service.findAllBooks();
    }

    @PostMapping("/bulk")
    @Operation(summary = "Bulk-создание книг", description = "Создает список книг")
    @ApiResponse(responseCode = "200", description = "Книги успешно созданы")
    public ResponseEntity<List<Book>> saveBooksBulk(@RequestBody List<Book> books) {
        List<Book> savedBooks = service.saveBooksBulk(books);
        return ResponseEntity.ok(savedBooks);
    }




    @GetMapping("/{id}/library")
    @Operation(summary = "Получить библиотеку книги", description = "Возвращает библиотеку, в которой находится книга")
    @ApiResponse(responseCode = "200", description = "Библиотека успешно найдена")
    @ApiResponse(responseCode = "404", description = "Книга или библиотека не найдена")
    public ResponseEntity<Library> getBookLibrary(@PathVariable("id") Long id) {
        Book book = service.getBookById(id);
        Library library = book.getLibrary();

        if (library == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Убираем прокси-обертку
        if (library instanceof HibernateProxy) {
            library = (Library) Hibernate.unproxy(library);
        }

        return ResponseEntity.ok(library);
    }




    @PostMapping
    @Operation(summary = "Создать книгу", description = "Создает новую книгу в библиотеке")
    @ApiResponse(responseCode = "200", description = "Книга успешно создана")
    @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    public ResponseEntity<Book> saveBook(@RequestBody Book book) {
        System.out.println("Received Book: " + book);
        if (book.getLibrary() == null) {
            throw new RuntimeException("Library is null!");
        }
        if (book.getLibrary().getId() == null) {
            throw new RuntimeException("Library ID is required!");
        }
        System.out.println("Library ID: " + book.getLibrary().getId()); // Логирование ID

        Library library = libraryRepository.findById(book.getLibrary().getId())
                .orElseThrow(() -> new RuntimeException("Library not found"));

        book.setLibrary(library);

        Book savedBook = service.saveBook(book);
        return ResponseEntity.ok(savedBook);
    }


    @GetMapping("/{id}")
    @Transactional
    @Operation(summary = "Получить книгу по ID", description = "Возвращает книгу по идентификатору")
    @ApiResponse(responseCode = "200", description = "Книга успешно найдена")
    @ApiResponse(responseCode = "404", description = "Книга не найдена")
    public ResponseEntity<Book> findBookById(@PathVariable("id") Long id) {
        Book book = service.getBookById(id);
        return ResponseEntity.ok(book);
    }


    @DeleteMapping("/delete_book/{id}")
    @Operation(summary = "Удалить книгу", description = "Удаляет книгу по идентификатору")
    @ApiResponse(responseCode = "200", description = "Книга успешно удалена")
    @ApiResponse(responseCode = "404", description = "Книга не найдена")
    public ResponseEntity<String> deleteBook(@PathVariable("id") Long id) {
        boolean isDeleted = service.deleteBook(id);
        if (isDeleted) {
            return ResponseEntity.ok("Книга успешно удалена");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Книга с данным ID не найдена");
        }

    }


    @GetMapping("/search")
    @Operation(summary = "Поиск книги", description = "Ищет книги по заданным параметрам")
    @ApiResponse(responseCode = "200", description = "Книги успешно найдены")
    public List<Book> searchBook(@RequestParam Map<String, String> params) {
        return service.searchBook(params);
    }


    @PutMapping("/{id}")
    @Operation(summary = "Обновить книгу", description = "Обновляет информацию о книге")
    @ApiResponse(responseCode = "200", description = "Книга успешно обновлена")
    @ApiResponse(responseCode = "404", description = "Книга не найдена")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book updatedBook) {

        Book book = service.updateBook(id, updatedBook);
        return ResponseEntity.ok(book);

    }
=======
package ru.store.springbooks.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.store.springbooks.model.Book;
import ru.store.springbooks.model.Library;
import ru.store.springbooks.repository.LibraryRepository;
import ru.store.springbooks.service.BookService;

@Tag(name = "Book Controller", description = "API для управления книгами")
@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService  service;
    private final LibraryRepository libraryRepository;

    @GetMapping
    @Operation(summary = "Получить все книги", description = "Возвращает список всех книг")
    @ApiResponse(responseCode = "200", description = "Список книг успешно получен")
    public List<Book> findAllBooks() {
        return service.findAllBooks();
    }

    @PostMapping("/bulk")
    @Operation(summary = "Bulk-создание книг", description = "Создает список книг")
    @ApiResponse(responseCode = "200", description = "Книги успешно созданы")
    public ResponseEntity<List<Book>> saveBooksBulk(@RequestBody List<Book> books) {
        List<Book> savedBooks = service.saveBooksBulk(books);
        return ResponseEntity.ok(savedBooks);
    }


    @PostMapping
    @Operation(summary = "Создать книгу", description = "Создает новую книгу в библиотеке")
    @ApiResponse(responseCode = "200", description = "Книга успешно создана")
    @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    public ResponseEntity<Book> saveBook(@RequestBody Book book) {
        System.out.println("Received Book: " + book);
        if (book.getLibrary() == null) {
            throw new RuntimeException("Library is null!");
        }
        if (book.getLibrary().getId() == null) {
            throw new RuntimeException("Library ID is required!");
        }
        System.out.println("Library ID: " + book.getLibrary().getId()); // Логирование ID

        Library library = libraryRepository.findById(book.getLibrary().getId())
                .orElseThrow(() -> new RuntimeException("Library not found"));

        book.setLibrary(library);

        Book savedBook = service.saveBook(book);
        return ResponseEntity.ok(savedBook);
    }


    @GetMapping("/{id}")
    @Transactional
    @Operation(summary = "Получить книгу по ID", description = "Возвращает книгу по идентификатору")
    @ApiResponse(responseCode = "200", description = "Книга успешно найдена")
    @ApiResponse(responseCode = "404", description = "Книга не найдена")
    public ResponseEntity<Book> findBookById(@PathVariable("id") Long id) {
        Book book = service.getBookById(id);
        return ResponseEntity.ok(book);
    }


    @DeleteMapping("/delete_book/{id}")
    @Operation(summary = "Удалить книгу", description = "Удаляет книгу по идентификатору")
    @ApiResponse(responseCode = "200", description = "Книга успешно удалена")
    @ApiResponse(responseCode = "404", description = "Книга не найдена")
    public ResponseEntity<String> deleteBook(@PathVariable("id") Long id) {
        boolean isDeleted = service.deleteBook(id);
        if (isDeleted) {
            return ResponseEntity.ok("Книга успешно удалена");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Книга с данным ID не найдена");
        }

    }


    @GetMapping("/search")
    @Operation(summary = "Поиск книги", description = "Ищет книги по заданным параметрам")
    @ApiResponse(responseCode = "200", description = "Книги успешно найдены")
    public List<Book> searchBook(@RequestParam Map<String, String> params) {
        return service.searchBook(params);
    }


    @PutMapping("/{id}")
    @Operation(summary = "Обновить книгу", description = "Обновляет информацию о книге")
    @ApiResponse(responseCode = "200", description = "Книга успешно обновлена")
    @ApiResponse(responseCode = "404", description = "Книга не найдена")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book updatedBook) {

        Book book = service.updateBook(id, updatedBook);
        return ResponseEntity.ok(book);

    }
>>>>>>> 46648704c560c036c8f0a81a3a35fd38378661cf
}