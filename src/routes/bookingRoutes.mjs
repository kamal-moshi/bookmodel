import express from 'express'
import { checkoutBook, createBook, getBook, returnbook } from '../controller/bookContoller.mjs';
import { auth } from '../middleware/auth.mjs';

const bookingRouter= express.Router();

bookingRouter.get('/allbooks', getBook)
bookingRouter.post('/createbooks',auth, createBook);
bookingRouter.post('/checkout/:bookId',auth, checkoutBook);
bookingRouter.post('/return/:bookId', auth,returnbook );


export default bookingRouter;