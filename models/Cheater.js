import mongoose from 'mongoose';

/**
 * Schema for storing evidence details
 * - id: Unique identifier for referencing evidence
 * - title: Descriptive title explaining the nature of the evidence
 * - submissionUrl: URL link to the actual submission showing cheating
 * - details: Array of specific points describing the evidence
 */
const EvidenceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  submissionUrl: {
    type: String,
    required: true,
    trim: true
  },
  details: [{
    type: String,
    required: true
  }],
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

/**
 * Schema for storing cheater information
 * - id: Numeric identifier (for reference and display purposes)
 * - date: When the cheating was detected
 * - codeforcesId: Codeforces profile identifier
 * - vjudgeId: VJudge profile identifier
 * - name: Cheater's name
 * - contest: Which contest the cheating occurred in
 * - evidence: Reference to the evidence document
 * - punishment: Description of the applied punishment
 */
const CheaterSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  codeforcesId: {
    type: String,
    default: '-',
    trim: true
  },
  vjudgeId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  contest: {
    type: String,
    required: true,
    trim: true
  },
  evidence: {
    type: String,
    required: true,
    ref: 'Evidence' // Reference to Evidence model
  },
  punishment: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Define helper methods for the Cheater schema
CheaterSchema.methods = {
  // Add any custom methods here
};

// Adding some static methods
CheaterSchema.statics = {
  /**
   * Get cheater by ID
   * @param {Number} id - The ID to search for
   * @returns {Promise<Cheater>}
   */
  getById(id) {
    return this.findOne({ id }).exec();
  },
  
  /**
   * List cheaters with pagination
   * @param {Object} options - List options
   * @returns {Promise<Cheaters[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ id: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

// Only create models if they don't exist (prevents errors in Next.js hot reload)
export const Cheater = mongoose.models.Cheater || mongoose.model('Cheater', CheaterSchema);
export const Evidence = mongoose.models.Evidence || mongoose.model('Evidence', EvidenceSchema);
