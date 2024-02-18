import { isValidObjectId } from "mongoose";
import BookModel, { joiBookSchema } from "../model/book.Model.mjs";
import Order from "../model/orderbooksModel.mjs";
import moment from "moment";

export const createBook = async (req, res) => {
  try {
    const { error, value } = joiBookSchema.validate(req.body);
    value.memberId = req.userId;
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    if (!isValidObjectId(value.memberId)) {
      return res.status(400).json({ message: "Invalid Member ID" });
    }
    value.Isdeleted = false;

    const checkbook = await BookModel.findOne({
      $or: [{ title: value.title }, { author: value.author }],
    });
    if (checkbook) {
      return res.status(200).json({ message: "book already exists" });
    }

    const book = await BookModel.create(value);
    return res.status(200).json({ message: "book created successfully", book });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getBook = async (req, res) => {
  try {
    const { userId, category, subcategory } = req.query;
    const query = {};
    if (userId) {
      query.memberId = userId;
    }
    if (category) {
      query.category = category;
    }
    if (subcategory) {
      query.subcategory = subcategory;
    }

    const data = await BookModel.find(query)
      .where({ availablebooks: { $ne: 0 } })
      .lean();
    return res.status(200).json({ message: "book fetched successfully", data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const checkoutBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const memberId = req.userId;

    if (!isValidObjectId(bookId)) {
      return res.status(400).json({ message: "Invalid Book ID" });
    }

    const book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }
    if (book.availablebooks === 0) {
      return res.status(404).json({ message: "Book not available" });
    }

    const updatedbook = await BookModel.findByIdAndUpdate(
      bookId,
      { $inc: { availablebooks: -1 } },
      { new: true }
    );
    const today = moment(new Date(), "DD/MM/YYYY");
    const booking = await Order.create({
      bookId: bookId,
      memberId: memberId,
      bookingStatus: "checkout",
      bookedAt: today,
    });
    return res
      .status(200)
      .json({ message: "booked successfully", updatedbook, booking });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const returnbook = async (req, res) => {
  try {
    const {  bookingId } = req.body;
    const memberId = req.userId;
    const { bookId } = req.params;
    if (!isValidObjectId(bookId) || !isValidObjectId(memberId)) {
      return res.status(404).json({ message: "invalid id" });
    }

    const today = moment(new Date(), "DD/MM/YYYY");
    const booking = await Order.findById(bookingId);
    let returndays = today.diff(booking.bookedAt, "days");
    if (returndays > 7) {
      let overdueDate = returndays - 7;
      let overdue = overdueDate * 50;
      const returnbooking = await Order.findByIdAndUpdate(
        bookingId,
        { bookingStatus: "return", overdue: overdue },
        { new: true }
      );
      const updatedbook = await BookModel.findByIdAndUpdate(
        bookId,
        { $inc: { availablebooks: +1 } },
        { new: true }
      );
      return res.status(200).json({
        message: "book returned successfully",
        returnbooking,
        message: `you have to pay ${overdue} cause of late reuturn`,
      });
    } else {
      const returnbooking = await Order.findByIdAndUpdate(
        bookingId,
        { bookingStatus: "return" },
        { new: true }
      );
      const updatedbook = await BookModel.findByIdAndUpdate(
        bookId,
        { $inc: { availablebooks: +1 } },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "book returned successfully", returnbooking });
    }
  } catch (er) {
    return res.status(500).json({ message: err.message });
  }
};
