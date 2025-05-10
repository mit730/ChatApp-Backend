const express = require('express');

const { registerUser, getUsers, loginUser } = require('../controllers/userController'); // Adjust path if necessary
const verifyToken = require('../auth');
const User = require('../modals/users');

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users',verifyToken, getUsers);

router.get('/me', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId, 'username _id').select('-password').lean();
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });
  
  router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    // Validate id as a potential ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
  
    try {
      const user = await User.findById(id, 'username _id').select('-password').lean();
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });
  

module.exports = router;
