'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Form for adding a new cheater and associated evidence
 */
export default function AddCheaterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    cheater: {
      id: '',
      date: '',
      codeforcesId: '',
      vjudgeId: '',
      name: '',
      contest: '',
      evidence: '',
      punishment: 'Permanent Ban'
    },
    evidence: {
      id: '',
      title: '',
      submissionUrl: '',
      details: ['']
    }
  });

  // Fetch the latest cheater ID when component mounts
  useEffect(() => {
    const fetchLatestId = async () => {
      try {
        const response = await fetch('/api/cheaters?limit=1');
        const data = await response.json();
        
        if (data.cheaters && data.cheaters.length > 0) {
          // Set the next available ID (latest ID + 1)
          const nextId = data.cheaters[0].id + 1;
          setFormData(prev => ({
            ...prev,
            cheater: {
              ...prev.cheater,
              id: nextId.toString()
            }
          }));
        } else {
          // If no cheaters exist, start with ID 1
          setFormData(prev => ({
            ...prev,
            cheater: {
              ...prev.cheater,
              id: '1'
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching latest ID:', error);
      }
    };

    fetchLatestId();
  }, []);

  // Handle dialog close
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (isOpen || showSuccessDialog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, showSuccessDialog]);

  /**
   * Handle form input changes
   */
  const handleChange = (e, section, field, index = null) => {
    if (field !== 'details' || index === null) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: e.target.value
        }
      });
      
      // Link the evidence ID automatically
      if (section === 'evidence' && field === 'id') {
        setFormData(prev => ({
          ...prev,
          cheater: {
            ...prev.cheater,
            evidence: e.target.value
          }
        }));
      }
      return;
    }
    
    // For details array
    const newDetails = [...formData.evidence.details];
    newDetails[index] = e.target.value;
    
    setFormData({
      ...formData,
      evidence: {
        ...formData.evidence,
        details: newDetails
      }
    });
  };

  /**
   * Add a new detail field
   */
  const addDetailField = () => {
    setFormData({
      ...formData,
      evidence: {
        ...formData.evidence,
        details: [...formData.evidence.details, '']
      }
    });
  };

  /**
   * Remove a detail field
   */
  const removeDetailField = (index) => {
    if (formData.evidence.details.length <= 1) return;
    
    const newDetails = [...formData.evidence.details];
    newDetails.splice(index, 1);
    
    setFormData({
      ...formData,
      evidence: {
        ...formData.evidence,
        details: newDetails
      }
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Generate a unique evidence ID based on name and date
      const evidenceId = `evidence_${formData.cheater.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
      
      // Prepare data with converted cheater ID and generated evidence ID
      const dataToSubmit = {
        ...formData,
        cheater: {
          ...formData.cheater,
          id: parseInt(formData.cheater.id, 10)
        },
        evidence: {
          ...formData.evidence,
          id: evidenceId
        }
      };
      
      const response = await fetch('/api/cheaters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to add cheater');
      }
      
      // Close the main dialog and show success dialog
      setIsOpen(false);
      setTimeout(() => {
        setShowSuccessDialog(true);
      }, 100);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle success dialog close
  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    router.push('/');
    router.refresh();
  };

  if (!isOpen && !showSuccessDialog) {
    return null;
  }

  // Success Dialog
  if (showSuccessDialog) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleSuccessDialogClose}></div>
        <div className="p-8 rounded-md max-w-md w-full mx-4 relative z-10 animate-fade-in text-white">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-600/20 border border-green-500">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-medium text-white">Success!</h3>
            <p className="mt-2 text-white/80">Cheater added successfully!</p>
            <div className="mt-6">
              <button
                onClick={handleSuccessDialogClose}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Form Dialog
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose}></div>
      <div className="w-full mx-4 relative z-10 animate-fade-in text-white overflow-y-auto max-h-[90vh]" style={{ maxWidth: '800px' }}>
        {/* Dialog Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Add New Cheater</h2>
          <p className="text-white/70 mt-1">Fill out the form to add a new cheater to the wall of disgrace</p>
        </div>
        
        {/* Dialog Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-600/20 border border-red-500 text-red-100 p-4 rounded-md flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Evidence Section */}
              <div className="space-y-5">
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Evidence Information</h3>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-white">Evidence ID</label>
                  <input
                    type="text"
                    value={formData.evidence.id}
                    onChange={(e) => handleChange(e, 'evidence', 'id')}
                    placeholder="e.g., evidence_username"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-white/50 transition"
                  />
                  <p className="text-xs text-white/60 mt-1">This ID will be linked to the cheater record</p>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-white">Evidence Title</label>
                  <input
                    type="text"
                    value={formData.evidence.title}
                    onChange={(e) => handleChange(e, 'evidence', 'title')}
                    placeholder="e.g., Evidence of AI usage in Contest"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-white/50 transition"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-white">Submission URL</label>
                  <input
                    type="url"
                    value={formData.evidence.submissionUrl}
                    onChange={(e) => handleChange(e, 'evidence', 'submissionUrl')}
                    placeholder="https://example.com/submission-link"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-white/50 transition"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-white">Evidence Details</label>
                    <button
                      type="button"
                      onClick={addDetailField}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-300 bg-indigo-900/30 border border-indigo-800/30 rounded hover:bg-indigo-800/40 transition"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.evidence.details.map((detail, index) => (
                      <div key={index} className="flex items-start">
                        <textarea
                          value={detail}
                          onChange={(e) => handleChange(e, 'evidence', 'details', index)}
                          placeholder="Describe the evidence point"
                          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-white/50 transition"
                          rows="2"
                        />
                        {formData.evidence.details.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDetailField(index)}
                            className="ml-2 p-1 text-white/60 hover:text-red-300 transition"
                            title="Remove detail"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Cheater Section */}
              <div className="space-y-5">
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Cheater Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-white">Cheater ID</label>
                    <input
                      type="number"
                      value={formData.cheater.id}
                      onChange={(e) => handleChange(e, 'cheater', 'id')}
                      placeholder="1"
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-white placeholder-white/50 transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-white">Date</label>
                    <input
                      type="date"
                      value={formData.cheater.date}
                      onChange={(e) => handleChange(e, 'cheater', 'date')}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-white placeholder-white/50 transition [color-scheme:dark]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-white">Name</label>
                  <input
                    type="text"
                    value={formData.cheater.name}
                    onChange={(e) => handleChange(e, 'cheater', 'name')}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-white placeholder-white/50 transition"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-white">Codeforces ID</label>
                    <input
                      type="text"
                      value={formData.cheater.codeforcesId}
                      onChange={(e) => handleChange(e, 'cheater', 'codeforcesId')}
                      placeholder="CF handle"
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-white placeholder-white/50 transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-white">VJudge ID</label>
                    <input
                      type="text"
                      value={formData.cheater.vjudgeId}
                      onChange={(e) => handleChange(e, 'cheater', 'vjudgeId')}
                      placeholder="VJudge username"
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-white placeholder-white/50 transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-white">Contest</label>
                  <input
                    type="text"
                    value={formData.cheater.contest}
                    onChange={(e) => handleChange(e, 'cheater', 'contest')}
                    placeholder="https://vjudge.net/contest/12345 (Contest Name)"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-white placeholder-white/50 transition"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-white">Punishment</label>
                  <select
                    value={formData.cheater.punishment}
                    onChange={(e) => handleChange(e, 'cheater', 'punishment')}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-white transition"
                  >
                    <option value="1 Year Ban">1 Year Ban</option>
                    <option value="6 Month Ban">6 Month Ban</option>
                    <option value="3 Month Ban">3 Month Ban</option>
                    <option value="Permanent Ban">Permanent Ban</option>
                    <option value="Warning">Warning</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Dialog Footer */}
            <div className="pt-5 border-t border-white/10 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-md hover:bg-white/10 transition text-white"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-emerald-600/90 hover:bg-emerald-700 text-white font-medium rounded-md transition flex items-center disabled:opacity-70"
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
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 