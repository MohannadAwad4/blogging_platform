const express = require("express");
const { Post } = require("./models");
const { Comment } = require('./models');
const session = require('express-session');
const bcrypt = require("bcryptjs");
const { JobApplication, User } = require("./models");


const app = express();
const port = 5000;

app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Post API!");
});


const authenticateUser = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'You must be logged in to view this page.' });
  }
  next();
};


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000 // 1 hour
  },
}));

// Create a new job
app.post("/posts",authenticateUser, async (req, res) => {
  const postData = req.body;
  try {
    const newPost = await JobApplication.create(postData);
    res.status(201).json(newPost);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({ errors: err.errors.map(e => e.message) });
    }
    console.error(err);
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
});

// Get all jobs
app.get("/posts", authenticateUser,async (req, res) => {
  try {
    const newPost = await Post.findAll();

    res.status(200).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});


// Get a specific job
app.get("/posts/:id", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.id, 10);

  try {
    const post = await Post.findOne({ where: { id: postId } });

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).send({ message: "Post not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

// Update a specific job
app.patch("/posts/:id", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.id, 10);


  try {
    const [numberOfAffectedRows, affectedRows] = await Post.update(req.body, { where: { id: postId }, returning: true });

    if (numberOfAffectedRows > 0) {
      res.status(200).json(affectedRows[0]);
    } else {
      res.status(404).send({ message: "Post not found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.error(err);
  }
});


app.delete("/posts/:id", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.id, 10);

  try {
    const deleteOp = await Post.destroy({ where: { id: postId } });

    if (deleteOp > 0) {
      res.status(200).send({ message: "Post deleted successfully" });
    } else {
      res.status(404).send({ message: "Post not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});
//-------------------------------Comment Crud--------------------------------//
// Create a new job
app.post("/comments", authenticateUser, async (req, res) => {
  const commentData = req.body;
  try {
    const newComment = await Comment.create(commentData);
    res.status(201).json(newComment);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({ errors: err.errors.map(e => e.message) });
    }
    console.error(err);
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
});

// Get all jobs
app.get("/comments", authenticateUser, async (req, res) => {
  try {
    const newComment = await Comment.findAll();

    res.status(200).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});


// Get a specific job
app.get("/comments/:id", authenticateUser, async (req, res) => {
  const commentId = parseInt(req.params.id, 10);

  try {
    const comment = await Comment.findOne({ where: { id: commentId } });

    if (post) {
      res.status(200).json(comment);
    } else {
      res.status(404).send({ message: "Comment not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

// Update a specific job
app.patch("/comments/:id", authenticateUser, async (req, res) => {
  const commentId = parseInt(req.params.id, 10);

  try {
    const [numberOfAffectedRows, affectedRows] = await Post.update(req.body, { where: { id: commentId }, returning: true });

    if (numberOfAffectedRows > 0) {
      res.status(200).json(affectedRows[0]);
    } else {
      res.status(404).send({ message: "Comment not found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.error(err);
  }
});


app.delete("/comments/:id", authenticateUser, async (req, res) => {
  const commentId = parseInt(req.params.id, 10);

  try {
    const deleteOp = await Comment.destroy({ where: { id: commentId } });

    if (deleteOp > 0) {
      res.status(200).send({ message: "Comment deleted successfully" });
    } else {
      res.status(404).send({ message: "Comment not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});
//---------------------SIGN UP--------------------///



app.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    // Send a response to the client informing them that the user was successfully created
    res.status(201).json({
      message: "User created!",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(422).json({ errors: error.errors.map((e) => e.message) });
    }
    res.status(500).json({
      message: "Error occurred while creating user",
      error: error,
    });
  }
});

//post login
app.post('/login', async (req, res) => {
  try {
    // First, find the user by their email address
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user === null) {
      // If the user isn't found in the database, return an 'incorrect credentials' message
      return res.status(401).json({
        message: 'Incorrect credentials',
      });
    }


    // If the user is found, we then use bcrypt to check if the password in the request matches the hashed password in the database
    bcrypt.compare(req.body.password, user.password, (error, result) => {
      if (result) {
        // Passwords match
        
        req.session.userId = user.id;
        res.status(200).json({ message: "Logged in successfully" });


      } else {
        // Passwords don't match
        res.status(401).json({ message: 'Incorrect credentials' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during the login process' });
  }
});


app.delete('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.sendStatus(500);
    }

    res.clearCookie('connect.sid');
    return res.sendStatus(200);
  });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});