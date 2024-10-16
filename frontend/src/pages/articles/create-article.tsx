import { FormEvent, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import formStyles from "../../styles/Forms.module.scss";
import { useTheme } from "@/context/ThemeContext"; 

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ense701-g6.vercel.app/api'
  : 'http://localhost:8000/api';

const NewDiscussion = () => {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [pubYear, setPubYear] = useState<number | string>("");
  const [journal, setJournal] = useState("");
  const [sePractice, setSePractice] = useState("");
  const [claim, setClaim] = useState("");
  const [evidence, setEvidence] = useState("");
  const [showClaimField, setShowClaimField] = useState(false); // Toggle state for claim
  const [showEvidenceField, setShowEvidenceField] = useState(false); // Toggle state for evidence
  const [researchType, setResearchType] = useState("");
  const [doi, setDoi] = useState("");
  const [summary, setSummary] = useState("");
  const [volume, setVolume] = useState("");
  const [number, setNumber] = useState("");
  const [pages, setPages] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const { theme } = useTheme(); // Get the current theme from ThemeContext

  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const articleData = {
        title,
        authors,
        publication_year: pubYear,
        journal,
        se_practice: sePractice,
        claim,
        evidence,
        research_type: researchType,
        doi,
        summary,
        volume,
        number,
        pages,
        user_name: userName,
        user_email: userEmail
      };

      console.log("Submitting article with data:", articleData);
      const response = await axios.post(`${API_URL}/articles`, articleData);

      if (response.status === 201) {
        setSubmissionId(response.data.submissionId); // Store submission ID

        // Display success message with the submission ID
        toast.success(`Article submitted successfully! Your submission ID is: ${response.data.submissionId}`);

        // Clear the form after successful submission
        setTitle("");
        setAuthors([]);
        setPubYear("");
        setJournal("");
        setSePractice("");
        setClaim("");
        setEvidence("");
        setResearchType("");
        setDoi("");
        setSummary("");
        setVolume("");
        setNumber("");
        setPages("");
        setUserName("");
        setUserEmail("");
      }
    } catch (error: any) {
      console.error("Error submitting article:", error);
      toast.error("Failed to submit the article. Please try again.");
    }
  };

  const addAuthor = () => setAuthors([...authors, ""]);
  const removeAuthor = (index: number) => setAuthors(authors.filter((_, i) => i !== index));
  const updateAuthor = (index: number, value: string) => {
    setAuthors(authors.map((author, i) => (i === index ? value : author)));
  };

  // Toggle functions for claim and evidence fields
  const toggleClaimField = () => setShowClaimField(!showClaimField);
  const toggleEvidenceField = () => setShowEvidenceField(!showEvidenceField);

  return (
    <div className={theme === 'dark' ? `${formStyles.container} ${formStyles.darkModeContainer}` : formStyles.container}>
      <h1 className={formStyles.header}>Submit a New Article</h1>
      <form className={formStyles.form} onSubmit={submitNewArticle}>
        <p className={formStyles.sectionSeparator}>
          <span>Submitter Details</span>
        </p>

        <div className={formStyles.inlineGroup}>
          <div className={formStyles.inlineItem}>
            <label htmlFor="userName">Your Name*</label>
            <input
              type="text"
              id="userName"
              value={userName}
              className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark}` : formStyles.input} // Add dark mode class
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className={formStyles.inlineItem}>
            <label htmlFor="userEmail">Your Email*</label>
            <input
              type="email"
              id="userEmail"
              value={userEmail}
              className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark}` : formStyles.input} // Add dark mode class
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <p className={formStyles.sectionSeparator}>
          <span>Article Details</span>
        </p>

        <div className={formStyles.field}>
          <label htmlFor="title">Title*</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the article title"
            required
            className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark}` : formStyles.input} // Add dark mode class
          />
        </div>

        <div className={formStyles.field}>
          <label>Authors*</label>
          {authors.map((author, index) => (
            <div key={index} className={formStyles.authorField}>
              <input
                type="text"
                value={author}
                onChange={(e) => updateAuthor(index, e.target.value)}
                placeholder={`Author ${index + 1}`}
                required
                className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark}` : formStyles.input} // Add dark mode class
              />
              <button type="button" onClick={() => removeAuthor(index)} className={formStyles.removeButton}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addAuthor} className={formStyles.addButton}>
            Add Author
          </button>
        </div>

        <div className={formStyles.field}>
          <label htmlFor="pubYear">Year of Publication*</label>
          <input
            type="number"
            id="pubYear"
            value={pubYear}
            onChange={(e) => setPubYear(e.target.value)}
            placeholder="e.g., 2021"
            required
            className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark}` : formStyles.input} // Add dark mode class
          />
        </div>

        <div className={formStyles.field}>
          <label htmlFor="journal">Journal/Conference Name*</label>
          <input
            type="text"
            id="journal"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="Enter the journal or conference name"
            required
            className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark}` : formStyles.input} // Add dark mode class
          />
        </div>

        <div className={formStyles.inlineGroup}>
          <div className={formStyles.inlineItem}>
            <label htmlFor="volume">Volume</label>
            <input
              type="text"
              id="volume"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="e.g., 34"
              className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark} ${formStyles.shortTextField}` : `${formStyles.input} ${formStyles.shortTextField}`} // Add dark mode class
            />
          </div>
          <div className={formStyles.inlineItem}>
            <label htmlFor="number">Number</label>
            <input
              type="text"
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g., 2"
              className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark} ${formStyles.shortTextField}` : `${formStyles.input} ${formStyles.shortTextField}`} // Add dark mode class
            />
          </div>
          <div className={formStyles.inlineItem}>
            <label htmlFor="pages">Pages</label>
            <input
              type="text"
              id="pages"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="e.g., 123-145"
              className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark} ${formStyles.shortTextField}` : `${formStyles.input} ${formStyles.shortTextField}`} // Add dark mode class
            />
          </div>
        </div>

        <div className={formStyles.field}>
          <label htmlFor="doi">DOI*</label>
          <input
            type="text"
            id="doi"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            placeholder="Enter the DOI"
            className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark}` : formStyles.input} // Add dark mode class
          />
        </div>

        <div className={formStyles.field}>
          <label htmlFor="sePractice">SE Practice*</label>
          <input
            type="text"
            id="sePractice"
            value={sePractice}
            onChange={(e) => setSePractice(e.target.value)}
            placeholder="e.g., Test-Driven Development"
            required
            className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark}` : formStyles.input} // Add dark mode class
          />
        </div>

        <div className={formStyles.field}>
          <label htmlFor="researchType">Type of Research*</label>
          <select
            id="researchType"
            value={researchType}
            onChange={(e) => setResearchType(e.target.value)}
            required
            className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark}` : formStyles.input} // Add dark mode class
          >
            <option value="">Select a research type</option>
            <option value="case study">Case Study</option>
            <option value="experiment">Experiment</option>
            <option value="survey">Survey</option>
            <option value="literature review">Literature Review</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Conditionally render the Claim field */}
        {showClaimField && (
          <div className={formStyles.field}>
            <label htmlFor="claim">Claim</label>
            <textarea
              id="claim"
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              placeholder="State the claim made in the article"
              className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark} ${formStyles.longTextField}` : `${formStyles.input} ${formStyles.longTextField}`} // Add dark mode class
            />
          </div>
        )}

        {/* Button to toggle the claim field */}
        <button type="button" className={formStyles.addButton} onClick={toggleClaimField}
        > {showClaimField ? 'Hide Claim' : 'Add Claim'} </button>

        {/* Conditionally render the Evidence field */}
        {showEvidenceField && (
          <div className={formStyles.field}>
            <label htmlFor="evidence">Evidence</label>
            <textarea
              id="evidence"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Provide evidence for the claim"
              className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark} ${formStyles.longTextField}` : `${formStyles.input} ${formStyles.longTextField}`} // Add dark mode class
            />
          </div>
        )}

        {/* Button to toggle the Evidence field */}
        <button type="button" className={formStyles.addButton} onClick={toggleEvidenceField}
        > {showEvidenceField ? 'Hide Evidence' : 'Add Evidence'} </button>

        <div className={formStyles.field}>
          <label htmlFor="summary">Summary*</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Provide a brief summary of the article"
            required
            className={theme === 'dark' ? `${formStyles.input} ${formStyles.inputFieldDark} ${formStyles.longTextField}` : `${formStyles.input} ${formStyles.longTextField}`} // Add dark mode class
          />
        </div>

        <button type="submit" className={formStyles.submitButton}>
          Submit Article
        </button>
      </form>

      {/* Show the submission ID after successful submission */}
      {submissionId && (
        <div className={formStyles.submissionId}>
          <h3 style={{ textAlign: 'left' }}>Article Submitted Successfully</h3>
          <p>Thank you for submitting an article to the SPEED database! <br />
            Your submission will now be reviewed by our team and you will be advised when it is published <br />
            Your article submission ID is <strong>{submissionId}</strong></p>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default NewDiscussion;
