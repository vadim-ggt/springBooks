// src/pages/Libraries.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar
} from '@mui/material';
import {
    LibraryBooks as LibraryBooksIcon,
    Info as InfoIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon
} from '@mui/icons-material';


interface Library {
    id?: number;
    name: string;
    address: string;
    books?: Book[];
    users?: User[];
}

interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
}

interface User {
    id: number;
    username: string;
    email: string;
}




type Order = 'asc' | 'desc';

const LibrariesPage: React.FC = () => {
    const [detailsDialogLibrary, setDetailsDialogLibrary] = useState<Library | null>(null);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Library>('name');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentLibrary, setCurrentLibrary] = useState<Library | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchLibraries();
    }, []);

    const fetchLibraries = async () => {
        try {
            const response = await axios.get<Library[]>('http://localhost:8080/api/v1/libraries');
            setLibraries(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Ошибка при загрузке библиотек');
            setLoading(false);
        }
    };

    const handleRequestSort = (property: keyof Library) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleOpenDialog = (library: Library | null) => {
        setCurrentLibrary(library);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentLibrary(null);
    };

    const handleSaveLibrary = async () => {
        try {
            if (currentLibrary) {
                // Удаляем id, если он 0 (для новой библиотеки)
                const libraryToSend = currentLibrary.id
                    ? currentLibrary
                    : { name: currentLibrary.name, address: currentLibrary.address };

                if (currentLibrary.id) {
                    // Редактирование
                    await axios.put(`http://localhost:8080/api/v1/libraries/${currentLibrary.id}`, libraryToSend);
                    setSnackbarMessage('Библиотека успешно обновлена');
                } else {
                    // Добавление (без id)
                    await axios.post('http://localhost:8080/api/v1/libraries', libraryToSend);
                    setSnackbarMessage('Библиотека успешно добавлена');
                }
                setSnackbarOpen(true);
                fetchLibraries();
                handleCloseDialog();
            }
        } catch (err) {
            console.error(err);
            setError('Ошибка при сохранении библиотеки');
        }
    };

    const handleDeleteLibrary = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/libraries/${id}`);
            setSnackbarMessage('Библиотека успешно удалена');
            setSnackbarOpen(true);
            fetchLibraries();
        } catch (err) {
            console.error(err);
            setError('Ошибка при удалении библиотеки');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentLibrary(prev => ({
            ...prev!,
            [name]: value
        }));
    };

    const sortedLibraries = [...libraries].sort((a, b) => {

        const aValue = a[orderBy] ?? '';
        const bValue = b[orderBy] ?? '';

        if (aValue < bValue) {
            return order === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });



    const handleShowDetails = (library: Library) => {
        setDetailsDialogLibrary(library);
    };


    return (
        <Box sx={{ padding: '2rem', maxWidth: '1200px',  marginLeft: '-1rem'}}>
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LibraryBooksIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Библиотеки
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        Полный список библиотек сети
                    </Typography>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog({ name: '', address: '' })} // Убрали id
                        >
                            Добавить библиотеку
                        </Button>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="libraries table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'name'}
                                                direction={orderBy === 'name' ? order : 'asc'}
                                                onClick={() => handleRequestSort('name')}
                                            >
                                                <Typography variant="subtitle1" color="common.white">
                                                    Название
                                                </Typography>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'address'}
                                                direction={orderBy === 'address' ? order : 'asc'}
                                                onClick={() => handleRequestSort('address')}
                                            >
                                                <Typography variant="subtitle1" color="common.white">
                                                    Адрес
                                                </Typography>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="right" width="200px">
                                            <Typography variant="subtitle1" color="common.white">
                                                Действия
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedLibraries.map((library) => (
                                        <TableRow
                                            key={library.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Typography variant="body1">
                                                    {library.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {library.address}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Подробнее">
                                                    <IconButton
                                                        onClick={() => handleShowDetails(library)}
                                                        color="primary"
                                                    >
                                                        <InfoIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Редактировать">
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => handleOpenDialog(library)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Удалить">
                                                    <IconButton
                                                        onClick={() => {
                                                            if (library.id) handleDeleteLibrary(library.id);
                                                        }}
                                                        color="error"
                                                        disabled={!library.id} // Дополнительно деактивируем если нет id
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* Диалог добавления/редактирования */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {currentLibrary?.id ? 'Редактировать библиотеку' : 'Добавить новую библиотеку'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            name="name"
                            label="Название библиотеки"
                            value={currentLibrary?.name || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            name="address"
                            label="Адрес"
                            value={currentLibrary?.address || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={handleSaveLibrary} color="primary" variant="contained">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Уведомление об успешном действии */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />


            {/* 3️⃣ ✅ НОВЫЙ ДИАЛОГ ДЛЯ ДЕТАЛЕЙ БИБЛИОТЕКИ (добавляем сюда) */}
            <Dialog
                open={!!detailsDialogLibrary}
                onClose={() => setDetailsDialogLibrary(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Детали библиотеки: {detailsDialogLibrary?.name}
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="h6" gutterBottom>
                        Адрес: {detailsDialogLibrary?.address}
                    </Typography>

                    {/* Книги */}
                    <Typography variant="h6" gutterBottom mt={4}>
                        Книги в библиотеке
                    </Typography>
                    {detailsDialogLibrary?.books?.length ? (
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Название</TableCell>
                                        <TableCell>Автор</TableCell>
                                        <TableCell align="right">Год</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {detailsDialogLibrary.books.map((book) => (
                                        <TableRow key={book.id}>
                                            <TableCell>{book.title}</TableCell>
                                            <TableCell>{book.author}</TableCell>
                                            <TableCell align="right">{book.year}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            В этой библиотеке пока нет книг.
                        </Typography>
                    )}

                    {/* Пользователи */}
                    <Typography variant="h6" gutterBottom mt={4}>
                        Пользователи библиотеки
                    </Typography>
                    {detailsDialogLibrary?.users?.length ? (
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Имя</TableCell>
                                        <TableCell>Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {detailsDialogLibrary.users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            В этой библиотеке пока нет пользователей.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsDialogLibrary(null)}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LibrariesPage;