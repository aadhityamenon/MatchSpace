import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const TutorApplication = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    subjects: [],
    hourlyRate: '',
    bio: '',
    education: [{ institution: '', degree: '', field: '', year: '' }],
    experience: [{ organization: '', position: '', from: '', to: '', description: '' }],
    teachingStyle: '',
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    },
    timePreference: {
      morning: false,
      afternoon: false,
      evening: false
    },
    profileImage: null,
    documents: []
  });
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [subjectInput, setSubjectInput] = useState('');
  
  // Available subject options
  const subjectOptions = [
    'Mathematics', 'Algebra', 'Geometry', 'Calculus', 'Statistics',
    'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'Literature', 'Writing', 'Spanish', 'French', 'German',
    'History', 'Geography', 'Economics', 'Psychology', 'Music', 'Art'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (category, field) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };
  
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    
    setFormData(prev => ({
      ...prev,
      education: updatedEducation
    }));
  };
  
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', field: '', year: '' }]
    }));
  };
  
  const removeEducation = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      education: updatedEducation
    }));
  };
  
  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index][field] = value;
    
    setFormData(prev => ({
      ...prev,
      experience: updatedExperience
    }));
  };
  
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { organization: '', position: '', from: '', to: '', description: '' }]
    }));
  };
  
  const removeExperience = (index) => {
    const updatedExperience = [...formData.experience];
    updatedExperience.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      experience: updatedExperience
    }));
  };
  
  const handleAddSubject = () => {
    if (subjectInput && !formData.subjects.includes(subjectInput)) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subjectInput]
      }));
      setSubjectInput('');
    }
  };
  
  const handleRemoveSubject = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (name === 'profileImage') {
      setFormData(prev => ({
        ...prev,
        profileImage: files[0]
      }));
    } else if (name === 'documents') {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...files]
      }));
    }
  };
  
  const removeDocument = (index) => {
    const updatedDocuments = [...formData.documents];
    updatedDocuments.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      documents: updatedDocuments
    }));
  };
  
  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (formData.subjects.length === 0) {
        newErrors.subjects = 'Please select at least one subject';
      }
      
      if (!formData.hourlyRate || formData.hourlyRate <= 0) {
        newErrors.hourlyRate = 'Please enter a valid hourly rate';
      }
      
      if (!formData.bio || formData.bio.trim().length < 50) {
        newErrors.bio = 'Bio should be at least 50 characters';
      }
    }
    
    if (step === 2) {
      if (formData.education.length === 0) {
        newErrors.education = 'Please add at least one education entry';
      } else {
        formData.education.forEach((edu, index) => {
          if (!edu.institution || !edu.degree || !edu.field || !edu.year) {
            newErrors[`education_${index}`] = 'Please complete all education fields';
          }
        });
      }
      
      if (!formData.teachingStyle || formData.teachingStyle.trim().length < 30) {
        newErrors.teachingStyle = 'Please describe your teaching style (at least 30 characters)';
      }
    }
    
    if (step === 3) {
      const hasAvailability = Object.values(formData.availability).some(day => day === true);
      const hasTimePreference = Object.values(formData.timePreference).some(time => time === true);
      
      if (!hasAvailability) {
        newErrors.availability = 'Please select at least one day of availability';
      }
      
      if (!hasTimePreference) {
        newErrors.timePreference = 'Please select at least one time preference';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep()) {
      try {
        setLoading(true);
        
        const formDataToSend = new FormData();
        
        // Append basic fields
        formDataToSend.append('hourlyRate', formData.hourlyRate);
        formDataToSend.append('bio', formData.bio);
        formDataToSend.append('teachingStyle', formData.teachingStyle);
        
        // Append complex objects as JSON strings
        formDataToSend.append('subjects', JSON.stringify(formData.subjects));
        formDataToSend.append('education', JSON.stringify(formData.education));
        formDataToSend.append('experience', JSON.stringify(formData.experience));
        formDataToSend.append('availability', JSON.stringify(formData.availability));
        formDataToSend.append('timePreference', JSON.stringify(formData.timePreference));
        
        // Append files
        if (formData.profileImage) {
          formDataToSend.append('profileImage', formData.profileImage);
        }
        
        if (formData.documents.length > 0) {
          formData.documents.forEach(doc => {
            formDataToSend.append('documents', doc);
          });
        }
        
        await api.post('/tutors/apply', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        alert('Application submitted successfully! We will review your application and get back to you soon.');
        navigate('/dashboard');
      } catch (err) {
        console.error('Error submitting application:', err);
        alert('Failed to submit application. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Subjects You Can Teach*
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.subjects.map((subject, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                    {subject}
                    <button 
                      type="button"
                      onClick={() => handleRemoveSubject(subject)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <select
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-l"
                >
                  <option value="">Select a subject</option>
                  {subjectOptions.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r"
                >
                  Add
                </button>
              </div>
              {errors.subjects && <p className="text-red-500 text-sm mt-1">{errors.subjects}</p>}
              <p className="text-gray-500 text-sm mt-1">You can add multiple subjects that you're qualified to teach.</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Hourly Rate ($)*
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                min="1"
              />
              {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
              <p className="text-gray-500 text-sm mt-1">Set your hourly rate in USD. You can adjust this later.</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Bio*
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded min-h-40"
                placeholder="Write a brief introduction about yourself, your teaching experience, and what students can expect from your sessions."
              ></textarea>
              {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              <p className="text-gray-500 text-sm mt-1">Minimum 50 characters. This will be shown on your profile.</p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Education*
              </label>
              {formData.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Education #{index + 1}</h4>
                    {formData.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Institution*</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="University/College Name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Degree*</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g., Bachelor's, Master's"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Field of Study*</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g., Computer Science, Mathematics"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Year of Completion*</label>
                      <input
                        type="number"
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g., 2020"
                        min="1950"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>
                  
                  {errors[`education_${index}`] && (
                    <p className="text-red-500 text-sm mt-2">{errors[`education_${index}`]}</p>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addEducation}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <span className="mr-1">+</span> Add Another Education
              </button>
              
              {errors.education && (
                <p className="text-red-500 text-sm mt-2">{errors.education}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Work Experience (Optional)
              </label>
              {formData.experience.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Experience #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Organization</label>
                      <input
                        type="text"
                        value={exp.organization}
                        onChange={(e) => handleExperienceChange(index, 'organization', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Company/School Name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g., Teacher, Tutor"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">From</label>
                      <input
                        type="month"
                        value={exp.from}
                        onChange={(e) => handleExperienceChange(index, 'from', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">To</label>
                      <input
                        type="month"
                        value={exp.to}
                        onChange={(e) => handleExperienceChange(index, 'to', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Describe your responsibilities and achievements"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addExperience}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <span className="mr-1">+</span> Add Work Experience
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Teaching Style*
              </label>
              <textarea
                name="teachingStyle"
                value={formData.teachingStyle}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Describe your approach to teaching and how you handle different learning styles."
                rows="4"
              ></textarea>
              {errors.teachingStyle && <p className="text-red-500 text-sm mt-1">{errors.teachingStyle}</p>}
              <p className="text-gray-500 text-sm mt-1">Minimum 30 characters.</p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Days Available*
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {Object.keys(formData.availability).map((day) => (
                  <div key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      checked={formData.availability[day]}
                      onChange={() => handleCheckboxChange('availability', day)}
                      className="mr-2"
                    />
                    <label htmlFor={`day-${day}`} className="capitalize">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
              {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Preferred Teaching Times*
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.keys(formData.timePreference).map((time) => (
                  <div key={time} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`time-${time}`}
                      checked={formData.timePreference[time]}
                      onChange={() => handleCheckboxChange('timePreference', time)}
                      className="mr-2"
                    />
                    <label htmlFor={`time-${time}`} className="capitalize">
                      {time} (
                      {time === 'morning' ? '6 AM - 12 PM' :
                       time === 'afternoon' ? '12 PM - 5 PM' :
                       '5 PM - 10 PM'}
                      )
                    </label>
                  </div>
                ))}
              </div>
              {errors.timePreference && <p className="text-red-500 text-sm mt-1">{errors.timePreference}</p>}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Profile Image (Optional)
              </label>
              <input
                type="file"
                name="profileImage"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <p className="text-gray-500 text-sm mt-1">Upload a professional photo of yourself.</p>
              
              {formData.profileImage && (
                <div className="mt-2 flex items-center">
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Profile Preview"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span className="ml-2">{formData.profileImage.name}</span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Supporting Documents (Optional)
              </label>
              <input
                type="file"
                name="documents"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                multiple
                className="w-full p-2 border border-gray-300 rounded"
              />
              <p className="text-gray-500 text-sm mt-1">Upload certificates, diplomas, or other relevant documents.</p>
              
              {formData.documents.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Uploaded Documents:</p>
                  <ul className="list-disc pl-5">
                    {formData.documents.map((doc, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{doc.name}</span>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Tutor Application</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {step === 1 ? 'Basic Information' :
               step === 2 ? 'Education & Experience' :
               'Availability & Documents'}
            </h2>
            <div className="text-sm text-gray-600">
              Step {step} of 3
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {renderFormStep()}
          
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
                disabled={loading}
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ml-auto"
                disabled={loading}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 ml-auto flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorApplication;