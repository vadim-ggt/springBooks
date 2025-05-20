import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Paper,
    Divider,
    CircularProgress,
    Alert,
    Card,
    CardContent
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HomeIcon from '@mui/icons-material/Home';

interface Library {
    id: number;
    name: string;
    address?: string;
}

interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
}

const HomePage: React.FC = () => {
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [selectedLibraryId, setSelectedLibraryId] = useState<number | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        axios.get<Library[]>('http://localhost:8080/api/v1/libraries')
            .then(response => setLibraries(response.data))
            .catch(err => {
                console.error(err);
                setError('Ошибка при загрузке библиотек');
            });
    }, []);

    const loadBooks = (libraryId: number) => {
        if (selectedLibraryId === libraryId) {
            setSelectedLibraryId(null);
            setBooks([]);
            setError(null);
            return;
        }

        setSelectedLibraryId(libraryId);
        setLoading(true);
        setBooks([]);
        setError(null);

        axios.get<Book[]>(`http://localhost:8080/api/v1/libraries/${libraryId}/books`)
            .then(response => {
                setBooks(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Ошибка при загрузке книг');
                setLoading(false);
            });
    };

    return (
        <Box sx={{ padding: '2rem', maxWidth: '1200px',  marginLeft: '-1rem' }}>
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <HomeIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Домашняя страница
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ width: '1200px' }}>
                <CardContent sx={{ px: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 2, mb: 2 }}>
                        <LibraryBooksIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h5" component="h2">
                            Список библиотек
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <List sx={{ px: 0 }}>
                        {libraries.map(library => (
                            <React.Fragment key={library.id}>
                                <ListItem
                                    component="div" // вместо <li>
                                    disableGutters
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        bgcolor: selectedLibraryId === library.id ? 'action.hover' : 'background.paper',
                                        px: 3,
                                        py: 2,
                                        mb: 2,
                                        boxShadow: 2,
                                        transition: 'box-shadow 0.3s',
                                        '&:hover': { boxShadow: 4 },
                                        width: '1155px', // теперь подействует

                                    }}
                                >

                                    <Button
                                        variant="text"
                                        onClick={() => loadBooks(library.id)}
                                        sx={{
                                            textAlign: 'left',
                                            textTransform: 'none',
                                            justifyContent: 'flex-start',
                                            width: '100%',
                                            p: 0,
                                        }}
                                    >
                                        <ListItemText
                                            primary={library.name}
                                            secondary={library.address || 'Адрес не указан'}
                                            primaryTypographyProps={{ variant: 'h6' }}
                                        />
                                    </Button>

                                    {selectedLibraryId === library.id && (
                                        <Box sx={{ width: '100%', pl: 0, pr: 2, pt: 2 }}>
                                            {loading ? (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                                    <CircularProgress />
                                                </Box>
                                            ) : books.length > 0 ? (
                                                <>
                                                    <Typography
                                                        variant="subtitle1"
                                                        gutterBottom
                                                        sx={{ fontWeight: 'bold', color: 'text.primary', ml : 0, }}
                                                    >
                                                        Книги в этой библиотеке:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2, pb: 1 }}>
                                                        {books.map(book => (
                                                            <Paper
                                                                key={book.id}
                                                                elevation={2}
                                                                sx={{
                                                                    p: 2,
                                                                    borderRadius: 2,
                                                                    backgroundColor: 'background.paper',
                                                                    transition: '0.3s',
                                                                    '&:hover': { boxShadow: 4 },
                                                                }}
                                                            >
                                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                                    {book.title}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {book.author} ({book.year})
                                                                </Typography>
                                                            </Paper>
                                                        ))}
                                                    </Box>
                                                </>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    В этой библиотеке пока нет книг.
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default HomePage;
