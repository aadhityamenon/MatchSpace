const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TutorSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjects: [{
    type: String,
    required: true
  }],
  educationLevel: {
    type: String,
    enum: ['High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Other'],
    required: true
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  areas: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  certifications: [{
    name: {
      type: String
    },
    issuer: {
      type: String
    },
    year: {
      type: Number
    }
  }],
  education: [{
    institution: {
      type: String
    },
    degree: {
      type: String
    },
    fieldOfStudy: {
      type: String
    },
    from: {
      type: Date
    },
    to: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  verificationDocs: {
    type: String 
  }, // Array of file URLs or paths
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to update the average rating
TutorSchema.methods.updateRating = function(newRating) {
  const currentTotal = this.averageRating * this.totalRatings;
  this.totalRatings += 1;
  this.averageRating = (currentTotal + newRating) / this.totalRatings;
  return this.save();
};

// Method to get tutor profile
TutorSchema.methods.getProfile = function() {
  return {
    id: this._id,
    subjects: this.subjects,
    educationLevel: this.educationLevel,
    yearsOfExperience: this.yearsOfExperience,
    hourlyRate: this.hourlyRate,
    areas: this.areas,
    description: this.description,
    certifications: this.certifications,
    education: this.education,
    averageRating: this.averageRating,
    totalRatings: this.totalRatings,
    isApproved: this.isApproved,
    isActive: this.isActive,
    tags: this.tags,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Tutor', TutorSchema);