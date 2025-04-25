import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 * Schema for storing admin user credentials
 * - username: Unique identifier for the admin
 * - salt: Random string for password hashing
 * - hashed_password: Encrypted password
 */
const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  salt: {
    type: String,
    required: true
  },
  hashed_password: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Virtual for password (setter only)
AdminSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  });

// Methods for the Admin schema
AdminSchema.methods = {
  /**
   * Authenticate - check if the passwords match
   * @param {String} plainText - Plain text password
   * @returns {Boolean} - True if passwords match, false otherwise
   */
  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Encrypt password
   * @param {String} password - Password to encrypt
   * @returns {String} - Encrypted password
   */
  encryptPassword(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha256', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  /**
   * Generate salt
   * @returns {String} - Random salt
   */
  makeSalt() {
    return crypto.randomBytes(16).toString('hex');
  }
};

// Only create the model if it doesn't exist already
export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

/**
 * Create the default admin if no admin exists yet
 * Call this function when initializing the application
 */
export const initializeDefaultAdmin = async () => {
  try {
    // Check if admin collection is empty
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      // Create default admin user
      const defaultAdmin = new Admin({
        username: 'admin',
        password: 'wall-of-disgrace-admin' // This will be encrypted via the virtual setter
      });
      
      await defaultAdmin.save();
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error initializing default admin:', error);
  }
}; 