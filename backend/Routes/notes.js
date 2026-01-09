const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { Note, Notification, User } = require('../models/model')
router.post('/upload', verifyToken, async (req, res) => {
  try {
    const adminsAndCR = await User.find({ role: { $in: ["admin", "cr"] } });
    const isAdminOrCR = adminsAndCR.some(
      u => u.studentId === req.user.studentId
    );
    const newNote = new Note({
      ...req.body,
      user: req.user.userId,
      approved: isAdminOrCR ? true : false
    });
    await newNote.save();
   
    if (!isAdminOrCR) {
      const uploader = await User.findOne({ studentId: req.user.studentId })
      await Promise.all(adminsAndCR.map(user =>
        Notification.create({
          message: `⏳${uploader.userName} has uploaded a material. Please Check`,
          type: "approval",
          receiverStudentId: user.studentId,
        })
      ));
    }
    res.status(200).json({
      success: true,
      message: 'Note added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search, page = 1, limit = 6 } = req.query;

    let query = { approved: true };
    console.log(search)
    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const totalCount = await Note.countDocuments(query);

    const result = await Note.find(query)
      .populate("user", "userName photoUrl studentId -_id")
      .populate('comments.user', 'userName studentId photoUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      data: result,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/pending', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // total pending notes count
    const total = await Note.countDocuments({ approved: false });

    // paginated notes
    const notes = await Note.find({ approved: false })
      .populate("user", "userName photoUrl studentId -_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: notes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// for reacts 
router.patch("/:id/react", verifyToken, async (req, res) => {
  try {
    const id = req.params.id
    const note = await Note.findById({ _id: id });
    const { studentId } = req.user;
    const exist = note.reacts.includes(studentId)
    if (exist) {
      await Note.updateOne({ _id: id }, {
        $pull: { reacts: studentId }
      })
    }
    else {
      await Note.updateOne({ _id: id }, {
        $addToSet: { reacts: studentId }
      })
    }
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
});

// for comments
router.post('/:id/comment', verifyToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    const { text } = req.body
    const note = await Note.findById({ _id: noteId }).populate("user", "studentId")
    const newComment = {
      text,
      user: req.user.userId
    }
    note.comments.push(newComment)
    await note.save()
    const commenter = await User.findOne({ studentId: req.user.studentId })
    if (req.user.studentId != note.user.studentId) {
      await Notification.create({
        message: `💬 ${commenter.userName} commented on your note: ${note.title}`,
        type: "comment",
        receiverStudentId: note.user.studentId
      })
    }
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
})
router.delete('/:noteId/comment/:commentId', verifyToken, async (req, res) => {
  try {
    const { noteId, commentId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const comment = note.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });

    // Safe remove
    note.comments = note.comments.filter(c => c._id.toString() !== commentId);

    await note.save();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
// for update status 
router.patch('/:id/approve', verifyToken, async (req, res) => {
  try {
    const noteId = req.params.id;

    // 🔹 Find & approve note
    const note = await Note.findByIdAndUpdate(
      noteId,
      { approved: true },
      { new: true }
    ).populate('user', 'studentId userName');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // 🔔 1️⃣ Notification for everyone
    await Notification.create({
      message: ` "${note.title}" . A new note/metarial Uploaded`,
      type: 'announcement',
      receiverStudentId: null, // everyone
    });

    // 🔔 2️⃣ Notification for note owner
    await Notification.create({
      message: `Your note "${note.title}" has been approved.`,
      type: 'approval',
      receiverStudentId: note.user.studentId,
    });

    res.status(200).json({
      success: true,
      message: 'Note approved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    const { reason } = req.body;

    // 🔹 Find note first
    const note = await Note.findById(noteId).populate(
      'user',
      'studentId userName'
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // 🔔 1️⃣ Notification for note owner (IMPORTANT)
    await Notification.create({
      message: `Your note "${note.title}" was rejected. Reason: ${reason}`,
      type: 'approval',
      receiverStudentId: note.user.studentId,
    });

    await Note.findByIdAndDelete(noteId);

    res.status(200).json({
      success: true,
      message: 'Note rejected and deleted successfully',
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.get('/overview', verifyToken, async (req, res) => {
  try {
    const { role, userId, section } = req.user;

    let data = {};

    // ==========================
    // 🔹 ADMIN / CR DASHBOARD
    // ==========================
    if (role === 'admin' || role === 'cr') {
      const filter = section ? { section } : {};

      data.totalNotes = await Note.countDocuments(filter);
      data.approvedNotes = await Note.countDocuments({
        ...filter,
        approved: true,
      });
      data.pendingNotes = await Note.countDocuments({
        ...filter,
        approved: false,
      });
      data.totalStudents = await User.countDocuments(
        section ? { section } : {}
      );

      data.subjectStats = await Note.aggregate([
        { $match: filter },
        { $group: { _id: '$subject', count: { $sum: 1 } } },
      ]);

      data.recentNotes = await Note.find(filter)
        .populate('user', 'studentId')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title approved createdAt user');
    }

    // ==========================
    // 🔹 STUDENT DASHBOARD
    // ==========================
    else {
      const myFilter = { user: userId };

      data.totalNotes = await Note.countDocuments(myFilter);
      data.approvedNotes = await Note.countDocuments({
        ...myFilter,
        approved: true,
      });
      data.pendingNotes = await Note.countDocuments({
        ...myFilter,
        approved: false,
      });

      // total reacts
      const reacts = await Note.aggregate([
        { $match: myFilter },
        {
          $project: { reactCount: { $size: '$reacts' } },
        },
        {
          $group: { _id: null, total: { $sum: '$reactCount' } },
        },
      ]);

      data.totalReacts = reacts[0]?.total || 0;

      data.subjectStats = await Note.aggregate([
        { $match: myFilter },
        { $group: { _id: '$subject', count: { $sum: 1 } } },
      ]);

      data.recentNotes = await Note.find(myFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title approved createdAt subject');
    }

    res.status(200).json({
      success: true,
      role,
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// my notes 
router.get('/my', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.patch('/my/:id', verifyToken, async (req, res) => {
  try {
    const { title, subject, link } = req.body;
    console.log(title)

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        title,
        subject,
        link,
        approved: false, // 🔴 important
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }
    const adminsAndCR = await User.find({ role: { $in: ["admin", "cr"] } });
    /* 🔔 Notify Admin / CR */
    
    await Promise.all(adminsAndCR.map(user =>
      Notification.create({
        message: `⏳${uploader.userName} has updated a material. Please Check`,
        type: "approval",
        receiverStudentId: user.studentId,
      })
    ));

    res.json({
      success: true,
      message: 'Note updated & sent for review',
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/my/:id', verifyToken, async (req, res) => {
  try {
    await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

;
