const {
    createBookHandler,
    allBooksHandler,
    bookByIdHandler,
    editBookByIdHandler,
    deleteBookbByIdHandler,
} = require('./handler');


const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: createBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: allBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: bookByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: editBookByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBookbByIdHandler,
    },
];

module.exports = routes;