const { nanoid } = require('nanoid');
const books = require('./books');

const createBookHandler = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });

        response.code(400);

        return response;
    }

    if(pageCount < readPage){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (pageCount === readPage);
    const newBook = {
        id, name, year,author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId : id,
            },
        });

        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};


const allBooksHandler = (request, h) => {
    const { name, reading, finished} = request.query;

    let filterBook = books;

    if(name !== undefined){
        filterBook = filterBook.filter((book) = book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if(reading !== undefined){
        filterBook = filterBook.filter((book) => book.reading === !!Number(reading));
    }

    if(reading !== undefined){
        filterBook = filterBook.fillter((book) => book.finished === !!Number(finished));
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filterBook.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });

    response.code(200);
    return response;
};

const bookByIdHandler = (request, h) => {
    const{ id } = request.params;
    const book = books.filter((b) => b.id === id)[0];

    if(book !== undefined){
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    return response.code(404);

};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if(index !== -1){
        if(name === undefined){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            return response.code(400);
        }

        if(pageCount < readPage){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });

            return response.code(400);
        }

        const finished = (pageCount === readPage);

        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });

        return response.code(200);
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    return response.code(404);
}

const deleteBookbByIdHandler = (request, h) => {
    const{id} = request.params;

    const index = books.findIndex((book)=> book.id ===id);

    if(index !== -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });

        return response.code(200);

    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    return response.code(404);
};

module.exports = {
    createBookHandler,
    allBooksHandler,
    bookByIdHandler,
    editBookByIdHandler,
    deleteBookbByIdHandler
};