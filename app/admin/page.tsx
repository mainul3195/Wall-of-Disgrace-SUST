"use client";
import { useState } from "react";
import styles from "./admin.module.css";
import Link from "next/link";
import { useTheme } from "../contexts/ThemeContext";

type Cheater = {
  id: number;
  date: string;
  codeforcesId: string;
  vjudgeId: string;
  name: string;
  contest: string;
  punishment: string;
  evidence: string;
};

type Evidence = {
  id: string;
  title: string;
  submissionUrl: string;
  details: string[];
};

export default function AdminPage() {
  const { theme } = useTheme();
  const [cheatersData, setCheatersData] = useState<Cheater[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nextAvailableId, setNextAvailableId] = useState<number>(1);
  
  // Form states
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedCheaterId, setSelectedCheaterId] = useState<number | null>(null);
  
  // Form fields for cheater
  const [formData, setFormData] = useState<{
    date: string;
    codeforcesId: string;
    vjudgeId: string;
    name: string;
    contest: string;
    punishment: string;
    evidence: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    codeforcesId: "",
    vjudgeId: "",
    name: "",
    contest: "",
    punishment: "Permanent Ban",
    evidence: ""
  });
  
  // Form fields for evidence
  const [evidenceForm, setEvidenceForm] = useState<{
    id: string;
    title: string;
    submissionUrl: string;
    details: string;
  }>({
    id: "",
    title: "",
    submissionUrl: "",
    details: ""
  });

  // Authentication and password change states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordChangeForm, setPasswordChangeForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  // Authentication state
  const verifyPassword = async () => {
    try {
      setAuthLoading(true);
      setError(null);
      
      // Use the authentication API endpoint
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username,
          password
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }
      
      // Authentication successful
      setIsAuthenticated(true);
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cheaters');
      if (!response.ok) {
        throw new Error('Failed to fetch cheaters data');
      }
      const data = await response.json();
      const cheaters = data.cheaters || [];
      setCheatersData(cheaters);
      
      // Calculate the next available ID
      if (cheaters.length > 0) {
        const maxId = Math.max(...cheaters.map((c: Cheater) => c.id));
        setNextAvailableId(maxId + 1);
      } else {
        setNextAvailableId(1);
      }
      
      setLoading(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEvidenceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvidenceForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      codeforcesId: "",
      vjudgeId: "",
      name: "",
      contest: "",
      punishment: "Permanent Ban",
      evidence: ""
    });
    
    setEvidenceForm({
      id: "",
      title: "",
      submissionUrl: "",
      details: ""
    });
    
    setMode("add");
    setSelectedCheaterId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Use the next available ID for new records, or the selected ID for existing ones
      const newId = mode === "add" ? nextAvailableId : selectedCheaterId;
        
      // Generate evidence ID
      const evidenceId = `evidence_${newId}`;
      
      // Prepare evidence data
      const evidenceData: Evidence = {
        id: evidenceId,
        title: evidenceForm.title,
        submissionUrl: evidenceForm.submissionUrl,
        details: evidenceForm.details.split('\n').filter(line => line.trim() !== '')
      };
      
      // Prepare cheater data
      const cheaterData = {
        ...formData,
        id: newId,
        evidence: evidenceId // Link to the evidence record
      };
      
      if (mode === "add") {
        // Add new cheater
        const response = await fetch('/api/cheaters', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            cheater: cheaterData,
            evidence: evidenceData
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add cheater');
        }
        
        setSuccessMessage("Cheater added successfully");
      } else {
        // Update existing cheater
        const response = await fetch(`/api/cheaters/${selectedCheaterId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            cheater: cheaterData,
            evidence: evidenceData
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update cheater');
        }
        
        setSuccessMessage("Cheater updated successfully");
      }
      
      // Refresh data
      fetchData();
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      setLoading(true);
      
      // Fetch cheater and evidence details
      const response = await fetch(`/api/cheaters/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch cheater details');
      }
      
      const data = await response.json();
      const { cheater, evidence } = data;
      
      if (!cheater || !evidence) {
        throw new Error('Invalid data received from server');
      }
      
      // Set form data with cheater details
      setFormData({
        date: cheater.date,
        codeforcesId: cheater.codeforcesId || "",
        vjudgeId: cheater.vjudgeId,
        name: cheater.name,
        contest: cheater.contest,
        punishment: cheater.punishment,
        evidence: cheater.evidence
      });
      
      // Set evidence form data
      setEvidenceForm({
        id: evidence.id,
        title: evidence.title,
        submissionUrl: evidence.submissionUrl,
        details: evidence.details.join('\n')
      });
      
      // Set mode to edit and store selected ID
      setMode("edit");
      setSelectedCheaterId(id);
      
      // Scroll to form
      document.getElementById('cheaterForm')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this cheater? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/cheaters/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete cheater');
      }
      
      setSuccessMessage("Cheater deleted successfully");
      
      // Refresh data
      fetchData();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordChangeForm.newPassword !== passwordChangeForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    
    if (passwordChangeForm.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }
    
    try {
      setPasswordChangeLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/credentials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          oldPassword: passwordChangeForm.oldPassword,
          newPassword: passwordChangeForm.newPassword
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }
      
      // Password updated successfully
      setSuccessMessage("Password updated successfully");
      setPasswordChangeForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setShowPasswordChange(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setPasswordChangeLoading(false);
    }
  };
  
  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordChangeForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Admin Authentication</h1>
          <p className={styles.authDescription}>Enter admin password to access the management panel.</p>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.authInput}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.authInput}
            />
          </div>
          
          <button 
            className={styles.authButton}
            onClick={verifyPassword}
            disabled={authLoading}
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
          
          <Link href="/" className={styles.backLink}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} data-theme={theme}>
      <div className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>Admin Management Panel</h1>
        <p className={styles.adminDescription}>
          Manage the Wall of Disgrace database - add, edit, or remove cheaters.
        </p>
        <div className={styles.actionLinks}>
          <Link href="/" className={styles.backToSiteLink}>
            ← Back to Wall of Disgrace
          </Link>
          <button 
            onClick={() => setShowPasswordChange(!showPasswordChange)} 
            className={styles.passwordChangeLink}
          >
            {showPasswordChange ? "Cancel" : "Change Password"}
          </button>
        </div>
        
        {showPasswordChange && (
          <div className={styles.passwordChangeForm}>
            <h3 className={styles.passwordChangeTitle}>Change Admin Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className={styles.inputGroup}>
                <label htmlFor="oldPassword">Current Password</label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={passwordChangeForm.oldPassword}
                  onChange={handlePasswordFormChange}
                  className={styles.input}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordChangeForm.newPassword}
                  onChange={handlePasswordFormChange}
                  className={styles.input}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordChangeForm.confirmPassword}
                  onChange={handlePasswordFormChange}
                  className={styles.input}
                  required
                />
              </div>
              
              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={passwordChangeLoading}
                >
                  {passwordChangeLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span> {error}
          <button 
            className={styles.dismissButton} 
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
      
      {successMessage && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span> {successMessage}
          <button 
            className={styles.dismissButton} 
            onClick={() => setSuccessMessage(null)}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}
      
      <div className={styles.adminContent}>
        <div className={styles.formSection} id="cheaterForm">
          <h2 className={styles.sectionTitle}>
            {mode === "add" ? "Add New Cheater" : "Edit Cheater"}
          </h2>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Full name of the cheater"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="codeforcesId">Codeforces ID</label>
                <input
                  type="text"
                  id="codeforcesId"
                  name="codeforcesId"
                  value={formData.codeforcesId}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="URL or username"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="vjudgeId">Vjudge ID</label>
                <input
                  type="text"
                  id="vjudgeId"
                  name="vjudgeId"
                  value={formData.vjudgeId}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="URL or username"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="contest">Contest URL</label>
                <input
                  type="text"
                  id="contest"
                  name="contest"
                  value={formData.contest}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Contest URL"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="punishment">Punishment</label>
                <select
                  id="punishment"
                  name="punishment"
                  value={formData.punishment}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="Permanent Ban">Permanent Ban</option>
                  <option value="6 Month Ban">6 Month Ban</option>
                  <option value="3 Month Ban">3 Month Ban</option>
                  <option value="1 Month Ban">1 Month Ban</option>
                  <option value="Warning">Warning</option>
                </select>
              </div>
            </div>
            
            <div className={styles.evidenceSection}>
              <h3 className={styles.evidenceTitle}>Evidence Details</h3>
              
              <div className={styles.inputGroup}>
                <label htmlFor="evidenceTitle">Evidence Title</label>
                <input
                  type="text"
                  id="evidenceTitle"
                  name="title"
                  value={evidenceForm.title}
                  onChange={handleEvidenceInputChange}
                  className={styles.input}
                  placeholder="Title summarizing the cheating incident"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="submissionUrl">Submission URL</label>
                <input
                  type="text"
                  id="submissionUrl"
                  name="submissionUrl"
                  value={evidenceForm.submissionUrl}
                  onChange={handleEvidenceInputChange}
                  className={styles.input}
                  placeholder="URL linking to the evidence"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="details">Evidence Details</label>
                <textarea
                  id="details"
                  name="details"
                  value={evidenceForm.details}
                  onChange={handleEvidenceInputChange}
                  className={styles.textarea}
                  placeholder="Explanation of the cheating evidence. Each line will be displayed as a separate paragraph."
                  rows={5}
                />
                <p className={styles.helperText}>Enter each detail on a new line. Each line will be displayed as a separate paragraph.</p>
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={resetForm}
              >
                {mode === "add" ? "Clear Form" : "Cancel Edit"}
              </button>
              
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Processing..." : mode === "add" ? "Add Cheater" : "Update Cheater"}
              </button>
            </div>
          </form>
        </div>
        
        <div className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Manage Existing Cheaters</h2>
          
          {loading && <div className={styles.loading}>Loading...</div>}
          
          {!loading && cheatersData.length === 0 && (
            <div className={styles.emptyState}>
              No cheaters in the database. Add your first record using the form.
            </div>
          )}
          
          {!loading && cheatersData.length > 0 && (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Punishment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cheatersData.map((cheater) => (
                    <tr key={cheater.id}>
                      <td>{cheater.id}</td>
                      <td>{cheater.name}</td>
                      <td>{cheater.date}</td>
                      <td>
                        <span className={`${styles.badge} ${cheater.punishment.includes("Permanent") ? styles.permanentBadge : ""}`}>
                          {cheater.punishment}
                        </span>
                      </td>
                      <td className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEdit(cheater.id)}
                          aria-label={`Edit ${cheater.name}`}
                        >
                          Edit
                        </button>
                        
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(cheater.id)}
                          aria-label={`Delete ${cheater.name}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 