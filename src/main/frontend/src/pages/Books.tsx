import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Snackbar, MenuItem, Select, CircularProgress, Alert
} from '@mui/material';
import {
    Edit as EditIcon, Delete as DeleteIcon, LibraryBooks as LibraryBooksIcon, Add as AddIcon,
    Lock as LockIcon
} from '@mui/icons-material';

interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
}

interface Library {
    id: number;
    name: string;
    address: string;
    books: Book[];
}

interface BookWithLibrary extends Book {
    libraryId: number;
}

const BooksPage: React.FC = () => {
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentBook, setCurrentBook] = useState<Book & {libraryId?: number} | null>(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchLibraries();
    }, []);

    const fetchLibraries = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Library[]>('http://localhost:8080/api/v1/libraries');
            setLibraries(response.data);
        } catch (err) {
            console.error(err);
            setError('Ошибка при загрузке библиотек');
        } finally {
            setLoading(false);
        }
    };

    const getAllBooks = (): BookWithLibrary[] => {
        return libraries.flatMap(library =>
            library.books.map(book => ({
                ...book,
                libraryId: library.id
            }))
        );
    };

    const handleOpenDialog = (book: BookWithLibrary | null) => {
        setIsEditing(!!book?.id);
        setCurrentBook(book ?? {
            id: 0,
            title: '',
            author: '',
            year: new Date().getFullYear(),
            libraryId: undefined
        });
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setCurrentBook(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentBook(prev => ({
            ...prev!,
            [name]: name === 'year' ? Number(value) : value
        }));
    };

    const handleSaveBook = async () => {
        if (!currentBook || !currentBook.libraryId) return;

        try {
            const selectedLibrary = libraries.find(lib => lib.id === currentBook.libraryId);
            if (!selectedLibrary) {
                throw new Error('Библиотека не найдена');
            }

            const bookData = {
                title: currentBook.title,
                author: currentBook.author,
                year: currentBook.year,
                library: selectedLibrary
            };

            if (isEditing && currentBook.id) {
                await axios.put(`http://localhost:8080/api/v1/books/${currentBook.id}`, bookData);
                setSnackbarMessage('Книга обновлена');
            } else {
                await axios.post('http://localhost:8080/api/v1/books', bookData);
                setSnackbarMessage('Книга добавлена');
            }

            fetchLibraries();
            setSnackbarOpen(true);
            handleCloseDialog();
        } catch (e) {
            console.error(e);
            setError('Ошибка при сохранении книги. Проверьте данные.');
        }
    };

    const handleDeleteBook = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/books/delete_book/${id}`);
            fetchLibraries();
            setSnackbarMessage('Книга удалена');
            setSnackbarOpen(true);
        } catch (e) {
            console.error(e);
            setError('Ошибка при удалении книги. Возможно, книга уже удалена или сервер не отвечает.');
        }
    };

    const books = getAllBooks();


    return (
        <Box sx={{ padding: '2rem', maxWidth: '1200px' }}>
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LibraryBooksIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h4">Книги</Typography>
                    </Box>
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog(null)}
                >
                    Добавить книгу
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                <TableCell><Typography color="common.white">Название</Typography></TableCell>
                                <TableCell><Typography color="common.white">Автор</Typography></TableCell>
                                <TableCell><Typography color="common.white">Год</Typography></TableCell>
                                <TableCell><Typography color="common.white">Библиотека</Typography></TableCell>
                                <TableCell align="right"><Typography color="common.white">Действия</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books.map((book) => {
                                const library = libraries.find(lib => lib.id === book.libraryId);
                                return (
                                    <TableRow key={book.id}>
                                        <TableCell>{book.title}</TableCell>
                                        <TableCell>{book.author}</TableCell>
                                        <TableCell>{book.year}</TableCell>
                                        <TableCell>{library?.name || 'Неизвестно'}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Редактировать">
                                                <IconButton color="secondary" onClick={() => handleOpenDialog(book)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Удалить">
                                                <IconButton color="error" onClick={() => handleDeleteBook(book.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isEditing ? 'Редактировать книгу' : 'Добавить книгу'}
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="Название"
                            name="title"
                            value={currentBook?.title || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Автор"
                            name="author"
                            value={currentBook?.author || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Год"
                            name="year"
                            type="number"
                            value={currentBook?.year || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        {isEditing ? (
                            <TextField
                                label="Библиотека"
                                value={currentBook?.libraryId
                                    ? libraries.find(lib => lib.id === currentBook.libraryId)?.name
                                    : 'Не указана'}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />
                                }}
                                fullWidth
                            />
                        ) : (
                            <Select
                                name="libraryId"
                                value={currentBook?.libraryId || ''}
                                onChange={(e) => {
                                    const libraryId = e.target.value as number;
                                    setCurrentBook(prev => ({
                                        ...prev!,
                                        libraryId
                                    }));
                                }}
                                fullWidth
                                required
                            >
                                <MenuItem value="" disabled>Выберите библиотеку</MenuItem>
                                {libraries.map(lib => (
                                    <MenuItem key={lib.id} value={lib.id}>{lib.name}</MenuItem>
                                ))}
                            </Select>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button
                        onClick={handleSaveBook}
                        variant="contained"
                        color="primary"
                        disabled={!currentBook?.title || !currentBook?.author || !currentBook?.year || !currentBook?.libraryId}
                    >
                        {isEditing ? 'Сохранить' : 'Добавить'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Box>
    );
};

export default BooksPage;