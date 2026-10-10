import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Printer, 
  Sparkles, 
  RotateCcw, 
  CheckCircle, 
  HelpCircle, 
  HeartPulse, 
  AlertCircle, 
  FileText,
  User,
  Download,
  Stethoscope,
  ClipboardList,
  Search,
  Plus,
  Trash2,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Save,
  Bookmark,
  History,
  MapPin
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { PrescriptionResponse, MedicationItem } from './types';
import VisitorCounter from './components/VisitorCounter';

// Blank initial prescription state so app starts completely blank on load
const BLANK_PRESCRIPTION_STATE = {
  location: '',
  patientName: '',
  patientId: '',
  age: '' as string | number,
  department: '',
  designation: '',
  doctorName: '',
  appointmentNo: '',
  appointmentTime: '',
  pulse: '',
  bloodPressure: '',
  temperature: '',
  heart: '',
  lung: '',
  chiefComplaints: '',
  pastMedicalHistory: '',
  otherFindings: '',
  diagnosis: '',
  doctorNote: '',
  requiredTests: [] as string[],
  medications: [] as MedicationItem[],
  prescriptionNo: '',
  summaryMessage: ''
};

const DEFAULT_PRESCRIPTION_STATE = BLANK_PRESCRIPTION_STATE;

interface MedicineDetails {
  generic: string;
  class: string;
  indication: string;
  tips: string;
}

export const getMedicineDetails = (name: string): MedicineDetails => {
  const norm = name.toLowerCase();
  
  if (norm.includes('itra')) {
    return {
      generic: 'Itraconazole',
      class: 'Systemic Antifungal Agent',
      indication: 'Oral therapy to eradicate various superficial & systemic fungal infections (such as ringworm, jock itch, or tinea in folds) by inhibiting fungal cell wall synthesis.',
      tips: 'MUST be taken immediately after a full main meal for optimal absorption in the stomach.'
    };
  }
  if (norm.includes('rhino') || norm.includes('xylometazoline') || norm.includes('nasal')) {
    return {
      generic: 'Xylometazoline Hydrochloride (0.1%)',
      class: 'Topical Nasal Decongestant',
      indication: 'Provides prompt relief from nasal congestion, sinus pressure, and mucosal swelling associated with acute colds, sinusitis, and allergies.',
      tips: 'Instill 1-2 drops into each nostril up to 3 times daily. Do not use continuously for more than 5 days to prevent rebound mucosal swelling (rhinitis medicamentosa).'
    };
  }
  if (norm.includes('combicid')) {
    return {
      generic: 'Miconazole Nitrate + Hydrocortisone',
      class: 'Topical Antifungal & Mild Anti-inflammatory Duo',
      indication: 'Provides rapid symptomatic itch relief while eliminating localized fungal and yeast skin infections.',
      tips: 'Apply a very thin film over clean, fully-dried lesions. Avoid heavy rubbing or occlusive dressing.'
    };
  }
  if (norm.includes('xyril') || norm.includes('levocetirizine')) {
    return {
      generic: 'Levocetirizine Dihydrochloride',
      class: 'Second-generation Antihistamine (Anti-allergic)',
      indication: 'Relieves allergic skin rashes, pruritus (itching), chronic hives, runny nose, and sneezing without causing heavy drowsiness.',
      tips: 'Best taken once daily at bedtime with or without food.'
    };
  }
  if (norm.includes('elocon') || norm.includes('mometasone')) {
    return {
      generic: 'Mometasone Furoate (0.1%)',
      class: 'Medium-potency Topical Corticosteroid',
      indication: 'Reduces severe swelling, inflammatory redness, raw itching, and allergic flare-ups of eczema or contact dermatitis.',
      tips: 'Apply once daily at night. Do not use on broken skin or apply continuously for over 14 days without specialist review.'
    };
  }
  if (norm.includes('bilastin')) {
    return {
      generic: 'Bilastine',
      class: 'Non-sedating Antihistamine (H1 receptor antagonist)',
      indication: 'Treats systemic insect allergy, urticaria, persistent itchy skin, allergic rhinitis and watery eyes.',
      tips: 'MUST be taken on an empty stomach (1 hour before or 2 hours after a meal or fruit juice) to maintain peak efficacy.'
    };
  }
  if (norm.includes('napaextend') || norm.includes('napa extend') || norm.includes('paracetamol') || norm.includes('napa')) {
    return {
      generic: 'Paracetamol (Acetaminophen)',
      class: 'Analgesic & Antipyretic (Pain reliever & Fever reducer)',
      indication: 'Relieves headache, body aches, stiffness, joint discomfort, and stabilizes core body temperature during viral fevers.',
      tips: 'Keep a gap of at least 6 to 8 hours between consecutive tablets. Never exceed 4 grams a day to safeguard your liver.'
    };
  }
  if (norm.includes('fexo')) {
    return {
      generic: 'Fexofenadine Hydrochloride',
      class: 'Second-generation Non-sedating Antihistamine',
      indication: 'Relieves symptoms associated with seasonal allergic rhinitis, watery eyes, sneezing, and chronic idiopathic skin rashes.',
      tips: 'Take with water. Avoid drinking fruit juices (apple, orange, or grapefruit) close to taking this medicine as they can reduce absorption.'
    };
  }
  if (norm.includes('adryst')) {
    return {
      generic: 'Diphenhydramine Compound Cough Syrup',
      class: 'Antitussive & Sedating Antihistamine Syrup',
      indication: 'Alleviates dry coughing spells, bronchial tickling, and throat hypersensitivity while promoting peaceful sleep.',
      tips: 'May cause drowsiness. Avoid driving or operating machinery after taking a dose.'
    };
  }
  if (norm.includes('osartil') || norm.includes('losartan')) {
    return {
      generic: 'Losartan Potassium',
      class: 'Angiotensin II Receptor Blocker (ARB) / Antihypertensive',
      indication: 'Maintains healthy blood volume and relaxes blood vessels to control clinical Hypertension and shield renal function.',
      tips: 'Take at a consistent time each day (preferably morning). Check your blood pressure weekly.'
    };
  }
  if (norm.includes('comet') || norm.includes('metformin')) {
    return {
      generic: 'Metformin Hydrochloride',
      class: 'Biguanide Oral Antidiabetic agent',
      indication: 'Enhances insulin sensitivity, controls output of hepatic glucose, and keeps HbA1c in standard range for Type-2 Diabetes.',
      tips: 'Take during or immediately after dinner or lunch to significantly reduce initial gastrointestinal bloating.'
    };
  }
  if (norm.includes('windel') || norm.includes('salbutamol')) {
    return {
      generic: 'Salbutamol (Albuterol)',
      class: 'Short-Acting Beta-2 Adrenergic Agonist (Bronchodilator)',
      indication: 'Quick-relief inhaler that instantly relaxes the bronchial smooth muscle to halt acute asthma attacks, coughing fits, and wheezing.',
      tips: 'Shake the canister well. Rinse your mouth with warm plain water after each use to keep local dryness away.'
    };
  }
  if (norm.includes('monas') || norm.includes('montelukast')) {
    return {
      generic: 'Montelukast Sodium',
      class: 'Leukotriene Receptor Antagonist (Anti-asthmatic / Anti-allergy)',
      indication: 'Prevents daytime wheezing, nocturnal coughing, cold air constriction, and symptoms of persistent allergic rhinitis.',
      tips: 'Best consumed in the evening before sleep, with or without meals.'
    };
  }
  if (norm.includes('alporad') || norm.includes('ciprofloxacin')) {
    return {
      generic: 'Ciprofloxacin Hydrochloride',
      class: 'Fluoroquinolone Antibiotic',
      indication: 'Eradicates susceptible urinary tract bacterial flora, preventing kidney spread or persistent pain.',
      tips: 'Complete the entire 7-day course even if symptoms disappear. Drink plenty of water to prevent crystalluria. Do not take with milk/calcium concurrently.'
    };
  }
  if (norm.includes('alkauri') || norm.includes('potassium citrate')) {
    return {
      generic: 'Potassium Citrate + Citric Acid',
      class: 'Systemic Alkalizer (Urinary Alkalizer)',
      indication: 'Soothes dysuria (severe burning during urination) by lowering acidity levels of urine inside the bladder.',
      tips: 'Always dilute the prescribed doses in half a glass of clean drinking water.'
    };
  }
  if (norm.includes('maxpro') || norm.includes('esomeprazole')) {
    return {
      generic: 'Esomeprazole Magnesium',
      class: 'Proton Pump Inhibitor (PPI) / Anti-ulcerant',
      indication: 'Blocks active gastric acid pumps to prevent hyperacidity, gastritis, stomach burning, chest discomfort, or reflux symptoms.',
      tips: 'Consume strictly on an empty stomach 30 to 45 minutes before breakfast or dinner.'
    };
  }
  if (norm.includes('entacyd')) {
    return {
      generic: 'Aluminium Hydroxide + Magnesium Hydroxide + Simethicone',
      class: 'Antacid & Antiflatulent Duo',
      indication: 'Instantly neutralizes excess stomach acid and dispels trapped stomach gas, relieving heartburn and sudden acute acidity.',
      tips: 'Chew the tablet fully before swallowing. Take about 60 minutes after a meal or when experiencing sudden discomfort.'
    };
  }
  
  // Generic fallback if unknown
  return {
    generic: name.replace(/^(tab\.|cap\.|syp\.|inj\.)\s*/i, '').split(' ')[0],
    class: 'Prescribed Therapeutic Compound',
    indication: 'Prescribed as targeted medication matching your clinical symptoms, diagnoses, or physical markers.',
    tips: 'Please take exactly as written on the distribution schedules. If you experience unexpected reactions, consult the clinic.'
  };
};

export default function App() {
  // Core administrative states - blank on load
  const [location, setLocation] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientId, setPatientId] = useState<string>('');
  const [age, setAge] = useState<string | number>('');
  const [department, setDepartment] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [doctorName, setDoctorName] = useState<string>('');
  const [appointmentNo, setAppointmentNo] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('');

  // Vitals states - blank on load
  const [pulse, setPulse] = useState<string>('');
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [heart, setHeart] = useState<string>('');
  const [lung, setLung] = useState<string>('');

  // Clinical symptom inputs, diagnosis, and findings - blank on load
  const [chiefComplaints, setChiefComplaints] = useState<string>('');
  const [pastMedicalHistory, setPastMedicalHistory] = useState<string>('');
  const [otherFindings, setOtherFindings] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [doctorNote, setDoctorNote] = useState<string>('');

  // Required Tests - blank on load
  const [requiredTests, setRequiredTests] = useState<string[]>([]);
  const [newTestText, setNewTestText] = useState('');

  // Medications Rx Table - blank on load
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  
  // Custom Medication Add states
  const [newMedName, setNewMedName] = useState('');
  const [newMedDist, setNewMedDist] = useState('');
  const [newMedDur, setNewMedDur] = useState('');

  // Generator Loading states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedState, setCopiedState] = useState<boolean>(false);
  const [prescriptionNo, setPrescriptionNo] = useState<string>('');

  // Interactive Clinical Enquiry parameters
  const [enquiryInput, setEnquiryInput] = useState('');
  const [isAnsweringEnquiry, setIsAnsweringEnquiry] = useState(false);
  const [enquiryAnswer, setEnquiryAnswer] = useState<string | null>(null);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);

  // Clear all inputs and outputs back to completely blank
  const handleClearAll = () => {
    setLocation('');
    setPatientName('');
    setPatientId('');
    setAge('');
    setDepartment('');
    setDesignation('');
    setDoctorName('');
    setAppointmentNo('');
    setAppointmentTime('');
    setPulse('');
    setBloodPressure('');
    setTemperature('');
    setHeart('');
    setLung('');
    setChiefComplaints('');
    setPastMedicalHistory('');
    setOtherFindings('');
    setDiagnosis('');
    setDoctorNote('');
    setRequiredTests([]);
    setNewTestText('');
    setMedications([]);
    setNewMedName('');
    setNewMedDist('');
    setNewMedDur('');
    setPrescriptionNo('');
    setEnquiryInput('');
    setEnquiryAnswer(null);
    setEnquiryError(null);
    setErrorMessage(null);
    try {
      localStorage.removeItem('buet_last_prescription_inputs');
    } catch (err) {}
  };

  // Generate a realistic random prescription number
  const handleGeneratePrescriptionNo = () => {
    const randNo = Math.floor(80000 + Math.random() * 5000).toString();
    setPrescriptionNo(randNo);
  };

  // Handle sending clinical prescription query
  const handleSendEnquiry = async (customQuery?: string) => {
    const query = (customQuery || enquiryInput).trim();
    if (!query) return;

    setIsAnsweringEnquiry(true);
    setEnquiryError(null);
    try {
      const response = await fetch('/api/prescription-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prescriptionNo,
          patientName,
          chiefComplaints,
          diagnosis,
          medications,
          requiredTests,
          doctorNote,
          userMessage: query
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setEnquiryAnswer(data.response);
    } catch (err: any) {
      console.error(err);
      setEnquiryError(err.message || 'An error occurred while transmitting your medical enquiry.');
    } finally {
      setIsAnsweringEnquiry(false);
    }
  };

  // Saved prescriptions list loaded from localStorage
  const [savedPrescriptions, setSavedPrescriptions] = useState<any[]>([]);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('buet_saved_prescriptions');
      if (stored) {
        setSavedPrescriptions(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load saved prescriptions:", err);
    }
  }, []);

  // Clear any previous persistent input caches on mount so app always starts blank
  useEffect(() => {
    try {
      localStorage.removeItem('buet_last_prescription_inputs');
    } catch (err) {}
  }, []);

  const handleSavePrescription = () => {
    try {
      const newSaved = {
        id: 'saved_' + Date.now(),
        prescriptionNo,
        location,
        patientName,
        patientId,
        age,
        department,
        designation,
        doctorName,
        appointmentNo,
        appointmentTime,
        pulse,
        bloodPressure,
        temperature,
        heart,
        lung,
        chiefComplaints,
        pastMedicalHistory,
        otherFindings,
        diagnosis,
        doctorNote,
        requiredTests,
        medications,
        savedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
      };

      let updatedList = [...savedPrescriptions];
      const existingIdx = updatedList.findIndex(p => p.prescriptionNo === prescriptionNo);
      if (existingIdx > -1) {
        updatedList[existingIdx] = newSaved;
      } else {
        updatedList.unshift(newSaved);
      }

      setSavedPrescriptions(updatedList);
      localStorage.setItem('buet_saved_prescriptions', JSON.stringify(updatedList));

      setSaveStatus("Saved to history!");
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err) {
      console.error("Error saving prescription:", err);
    }
  };

  const handleDeleteSaved = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updatedList = savedPrescriptions.filter(p => p.id !== idToDelete);
      setSavedPrescriptions(updatedList);
      localStorage.setItem('buet_saved_prescriptions', JSON.stringify(updatedList));
    } catch (err) {
      console.error("Error deleting saved prescription:", err);
    }
  };

  const handleLoadPrescription = (saved: any) => {
    setPrescriptionNo(saved.prescriptionNo || '');
    setLocation(saved.location || '');
    setPatientName(saved.patientName || '');
    setPatientId(saved.patientId || '');
    setAge(saved.age || '');
    setDepartment(saved.department || '');
    setDesignation(saved.designation || '');
    setDoctorName(saved.doctorName || '');
    setAppointmentNo(saved.appointmentNo || '');
    setAppointmentTime(saved.appointmentTime || '');
    setPulse(saved.pulse || '');
    setBloodPressure(saved.bloodPressure || '');
    setTemperature(saved.temperature || '');
    setHeart(saved.heart || '');
    setLung(saved.lung || '');
    setChiefComplaints(saved.chiefComplaints || '');
    setPastMedicalHistory(saved.pastMedicalHistory || '');
    setOtherFindings(saved.otherFindings || '');
    setDiagnosis(saved.diagnosis || '');
    setDoctorNote(saved.doctorNote || '');
    setRequiredTests(saved.requiredTests || []);
    setMedications(saved.medications || []);
  };

  // Update appointment time to current when requested
  const handleSetCurrentTime = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }) + 
      ' ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    setAppointmentTime(formatted);
  };

  // Call server-side API to generate prescription details from current symptoms using Gemini
  const handleGenerateFromSymptoms = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/generate-buet-prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          patientName,
          patientId,
          age,
          department,
          designation,
          doctorName,
          chiefComplaints,
          pastMedicalHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      // Set vitals if returned from API
      if (data.pulse) setPulse(data.pulse);
      if (data.bloodPressure) setBloodPressure(data.bloodPressure);
      if (data.temperature) setTemperature(data.temperature);
      if (data.heart) setHeart(data.heart);
      if (data.lung) setLung(data.lung);
      
      // Set clinical fields
      if (data.otherFindings) setOtherFindings(data.otherFindings);
      if (data.diagnosis) setDiagnosis(data.diagnosis);
      if (data.doctorNote) setDoctorNote(data.doctorNote);
      if (data.requiredTests) setRequiredTests(data.requiredTests);
      if (data.medications) setMedications(data.medications);

      // Increment/Set prescription number
      const randNo = Math.floor(80000 + Math.random() * 5000).toString();
      setPrescriptionNo(randNo);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred while communicating with the medical intelligence system.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Add customized tests to investigator list
  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestText.trim()) return;
    setRequiredTests([...requiredTests, newTestText.trim()]);
    setNewTestText('');
  };

  const handleRemoveTest = (indexToRemove: number) => {
    setRequiredTests(requiredTests.filter((_, idx) => idx !== indexToRemove));
  };

  // Add customized medication item
  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    const item: MedicationItem = {
      id: 'custom_' + Date.now(),
      name: newMedName.trim(),
      distribution: newMedDist.trim(),
      duration: newMedDur.trim()
    };
    setMedications([...medications, item]);
    setNewMedName('');
    setNewMedDist('1+0+1');
    setNewMedDur('7 days after meal');
  };

  const handleRemoveMedication = (idToRemove: string) => {
    setMedications(medications.filter(m => m.id !== idToRemove));
  };

  // Copy prescription details for fast messaging/sharing
  const handleCopyPrescriptionText = () => {
    const textBlock = `THE UNIVERSITY OF ALABAMA STUDENT HEALTH CENTER & PHARMACY
PRESCRIPTION REPORT (OFFICIAL DIGITIZED VERSION)
Prescription No: #${prescriptionNo}

---------------------------------------------------------
PATIENT DETAILS:
Patient: ${patientName}
Location / Site: ${location || '—'}
Age: ${age} Years | Department: ${department}
Appoint No: ${appointmentNo} | App Taken: ${appointmentTime}
---------------------------------------------------------
CLINICAL VITALS:
- Pulse: ${pulse}
- BP: ${bloodPressure}
- Temperature: ${temperature}
- Heart: ${heart}
- Lung: ${lung}
---------------------------------------------------------
CLINICAL REASONING:
Chief Complaints: "${chiefComplaints}"
Past History: "${pastMedicalHistory}"
Other Findings: "${otherFindings}"
Diagnosis: "${diagnosis}"
---------------------------------------------------------
REQUIRED INVESTIGATIONS / TESTS:
${requiredTests.length > 0 ? requiredTests.map((t, idx) => `  ${idx + 1}. ${t}`).join('\n') : '  None mandated.'}
---------------------------------------------------------
Rx TREATMENT:
${medications.map((m, idx) => `  ${idx + 1}. ${m.name} | Distribution: ${m.distribution} | Duration: ${m.duration}`).join('\n')}

Doctor Special Instructions: "${doctorNote}"
---------------------------------------------------------
University Health Portal Services
Verified Medical Record Portal
Generated on: ${new Date().toLocaleString()}
`;

    try {
      navigator.clipboard.writeText(textBlock);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Natively build PDF styled exactly like the University of Alabama prescription sheet!
  const handleDownloadBUETPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
      const margin = 15;
      let y = 14;

      // 1. Alabama Logo Replication
      // Left Part
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(112, 112, 112); // Gray (#707070)
      doc.text("THE UNIVERSITY OF", margin, y);
      
      doc.setFont("Times", "bold");
      doc.setFontSize(18);
      doc.setTextColor(163, 38, 56); // Alabama Crimson (#A32638)
      doc.text("ALABAMA", margin, y + 5.5);

      // Vertical Divider
      doc.setDrawColor(153, 153, 153);
      doc.setLineWidth(0.35);
      doc.line(margin + 58, y - 2.5, margin + 58, y + 7.5);

      // Right Part
      doc.setFont("Times", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(96, 96, 96); // College of
      doc.text("College of", margin + 62, y);

      doc.setFont("Helvetica", "bold"); // Community Health Sciences
      doc.setFontSize(9.5);
      doc.setTextColor(80, 80, 80);
      doc.text("Community Health Sciences", margin + 76, y);

      doc.setFont("Helvetica", "bold"); // Student Health Center and Pharmacy
      doc.setFontSize(9);
      doc.setTextColor(163, 38, 56);
      doc.text("Student Health Center and Pharmacy", margin + 62, y + 5.5);

      y += 11;

      // Developed and maintained subtitle left, printed details right
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(110, 110, 110);
      doc.text("University Health Portal Services", margin, y);
      
      const nowString = appointmentTime || new Date().toLocaleString();
      doc.text(`Printed ${nowString}   Page 1 of 1`, pageWidth - margin, y, { align: 'right' });
      y += 2.5;

      // Divider line
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      // Large centered header "Prescription" with handwritten visual style lines
      doc.setFont("Times", "bolditalic");
      doc.setFontSize(22);
      doc.setTextColor(30,30,30);
      doc.text("Prescription", pageWidth / 2, y, { align: 'center' });
      
      // Barcode lines drawing and Prescription No
      doc.setFont("Courier", "bold");
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text(`Prescription #${prescriptionNo || "—"}`, pageWidth - margin, y - 2, { align: 'right' });
      
      // Draw simulated barcode lines on top right only if prescription number exists
      if (prescriptionNo) {
        let barcodeX = pageWidth - 45;
        doc.setDrawColor(10, 10, 10);
        doc.setLineWidth(0.3);
        for(let i=0; i<15; i++) {
          const thickness = (i % 3 === 0) ? 0.6 : (i % 2 === 0) ? 0.35 : 0.15;
          doc.setLineWidth(thickness);
          doc.line(barcodeX + (i * 1.8), y + 1.5, barcodeX + (i * 1.8), y + 7);
        }
      }
      y += 12;

      // Patient Parameter Block
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.35);
      doc.setFillColor(252, 252, 252);
      doc.rect(margin, y, pageWidth - (margin * 2), 22, "FD");

      // Fill in details matching the receipt perfectly
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text(`Patient: ${patientName || "—"}`, margin + 4, y + 6);
      
      doc.setFont("Helvetica", "normal");
      doc.text(`Age: ${age ? `${age} Years` : "—"}`, margin + 105, y + 6);
      doc.text(`Department: ${department || "—"}`, margin + 135, y + 6);

      doc.text(`Facility: SHC Clinic & Pharmacy`, margin + 4, y + 14);
      doc.text(`Appoint# ${appointmentNo || "—"}`, margin + 105, y + 14);
      doc.text(`App Taken: ${appointmentTime || "—"}`, margin + 135, y + 14);
      y += 28;

      // Clinical information grid (Vitals on the left, complaints and diagnosis on the right)
      // Draw vertical separator line
      const middleX = margin + 55;
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.25);
      doc.line(middleX, y, middleX, y + 65);

      // Left Column: Vitals
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text("Vitals Exam", margin, y);
      y += 6;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`Pulse: ${pulse || "—"}`, margin, y);
      y += 6;
      doc.text(`BloodPressure: ${bloodPressure || "—"}`, margin, y);
      y += 6;
      doc.text(`Temperature: ${temperature || "—"}`, margin, y);
      y += 6;
      doc.text(`Heart: ${heart || "—"}`, margin, y);
      y += 6;
      doc.text(`Lung: ${lung || "—"}`, margin, y);
      
      // Reset y back to start of block for Right Column: Chief Complaints etc
      let rightY = y - 24;

      if (location) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(30, 30, 30);
        doc.text("Location:", middleX + 5, rightY);
        rightY += 4.5;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(70, 70, 70);
        const wrappedLoc = doc.splitTextToSize(location, pageWidth - middleX - margin - 5);
        doc.text(wrappedLoc, middleX + 5, rightY);
        rightY += (wrappedLoc.length * 4.5) + 2.5;
      }

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 30, 30);
      doc.text("Chief Complaints:", middleX + 5, rightY);
      rightY += 5;
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const wrappedComplaints = doc.splitTextToSize(chiefComplaints || "—", pageWidth - middleX - margin - 5);
      doc.text(wrappedComplaints, middleX + 5, rightY);
      rightY += (wrappedComplaints.length * 4.5) + 3;

      doc.setFont("Helvetica", "bold");
      doc.text("Past History:", middleX + 5, rightY);
      rightY += 4.5;
      doc.setFont("Helvetica", "normal");
      const wrappedHistory = doc.splitTextToSize(pastMedicalHistory || "—", pageWidth - middleX - margin - 5);
      doc.text(wrappedHistory, middleX + 5, rightY);
      rightY += (wrappedHistory.length * 4.5) + 3;

      doc.setFont("Helvetica", "bold");
      doc.text("Other Findings:", middleX + 5, rightY);
      rightY += 4.5;
      doc.setFont("Helvetica", "normal");
      const wrappedFindings = doc.splitTextToSize(otherFindings || "—", pageWidth - middleX - margin - 5);
      doc.text(wrappedFindings, middleX + 5, rightY);
      rightY += (wrappedFindings.length * 4.5) + 3;

      doc.setFont("Helvetica", "bold");
      doc.text("Diagnosis:", middleX + 5, rightY);
      rightY += 4.5;
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(175, 20, 20); // Clinical red for diagnosis
      doc.text(diagnosis || "—", middleX + 5, rightY);
      
      // Push y past both columns
      y = Math.max(y + 12, rightY + 12);

      // Section divider line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      // Required Tests section output (on left side)
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text("Required Investigations / Clinical Tests:", margin, y);
      y += 6;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      if (requiredTests.length === 0) {
        doc.text("No diagnostic investigations suggested.", margin + 4, y);
        y += 5;
      } else {
        requiredTests.forEach((test, idx) => {
          doc.text(`[ ] ${idx + 1}. ${test}`, margin + 4, y);
          y += 5.5;
        });
      }
      y += 5;

      // Section for Treatment Medications (Rx)
      doc.setFont("Times", "bolditalic");
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text("Rx", margin, y);
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("Treatment Plan:", margin + 9, y - 1);
      y += 4;

      // Draw Medication Table
      // Header
      doc.setDrawColor(180, 180, 180);
      doc.setFillColor(242, 242, 242);
      doc.rect(margin, y, pageWidth - (margin * 2), 7, "FD");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);
      doc.text("#", margin + 3, y + 4.5);
      doc.text("Medicine Name", margin + 12, y + 4.5);
      doc.text("Distribution / Frequency", margin + 95, y + 4.5);
      doc.text("Duration", margin + 145, y + 4.5);
      y += 7;

      // Rows
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      if (medications.length === 0) {
        doc.text("No treatment medications prescribed yet.", margin + 12, y + 5);
        y += 8;
      } else {
        medications.forEach((med, num) => {
          doc.text((num + 1).toString(), margin + 3, y + 5.5);
          
          doc.setFont("Helvetica", "bold");
          doc.setTextColor(20, 20, 20);
          doc.text(med.name, margin + 12, y + 5.5);
          
          doc.setFont("Helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          doc.text(med.distribution, margin + 95, y + 5.5);
          doc.text(med.duration, margin + 145, y + 5.5);
          
          // Draw thin horizontal grid row lines
          doc.line(margin, y + 7.5, pageWidth - margin, y + 7.5);
          y += 8;
        });
      }
      y += 3;

      // Cursive style handwritten advice: e.g. savlon/dettol diye dhuye apply
      if (doctorNote) {
        doc.setFont("Times", "italic");
        doc.setFontSize(11);
        doc.setTextColor(150, 40, 40);
        doc.text(`Note: "${doctorNote}"`, margin + 4, y);
        y += 10;
      }

      // Legal disclaimer & footer seal
      if (y > 245) {
        doc.addPage();
        y = 30; // safety margin for subsequent page
      }

      doc.setDrawColor(210, 210, 210);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(110, 110, 110);
      const disclaimer = "This document is a digitized reproduction of the official University of Alabama Student Health Center & Pharmacy Prescription, processed in secure healthcare preview sandbox context. Always verify clinical choices with a certified doctor before pursuing pharmacological changes.";
      const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - (margin * 2));
      doc.text(splitDisclaimer, margin, y);
      
      y += (splitDisclaimer.length * 3.5) + 3;

      // Signature seals
      doc.setFont("Courier", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);
      doc.text("AUTHORIZED SPECIALIST", pageWidth - margin - 45, y);
      doc.setFont("Courier", "normal");
      doc.setFontSize(7.5);
      doc.text("Senior Clinical Specialist, SHC", pageWidth - margin - 45, y + 4);
      doc.text("Reg #80551", pageWidth - margin - 45, y + 8);

      // Trigger automatic save
      const sanitizedName = (patientName || 'Prescription').replace(/\s+/g, '_');
      doc.save(`Alabama_Prescription_${sanitizedName}.pdf`);
    } catch (pdfErr) {
      console.error("PDF generation failure error:", pdfErr);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn("Print trigger blocked in sandbox container", err);
    }
  };

  return (
    <div id="buet-parent-frame" className="min-h-screen bg-[#f3f4f6] text-slate-800 font-sans">
      
      {/* Top Professional Header Bar */}
      <div className="bg-[#A32638] text-white border-b border-[#821e2c] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-1.5 rounded-lg text-[#A32638] shadow-xs shrink-0 select-none">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest text-red-100 uppercase font-bold block leading-none">STUDENT HEALTH CENTER & PHARMACY</span>
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-wide">The University of Alabama</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-100 opacity-90 select-none">Sandbox Doctor Session:</span>
            <span className="bg-[#821e2c] text-red-50 border border-red-900/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs select-none">
              <span className="h-1.5 w-1.5 bg-red-100 rounded-full animate-pulse"></span>
              Connected (Clinic Portal)
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Error Warning Callout */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 text-red-900 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold font-sans">System Diagnostics Warning</h4>
              <p className="text-xs mt-1 leading-relaxed text-red-800">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ==================== LEFT CONTROL & TRIAGE PANEL ==================== */}
          <div className="lg:col-span-5 space-y-6">
            

            
            {/* Main Interactive Symptom Input and Demographics Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-[#A32638] px-6 py-4 text-white border-b border-[#821e2c]">
                <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base">
                  <ClipboardList className="h-4.5 w-4.5 text-rose-100" /> Patient Clinical Intake & Demographics
                </h3>
                <p className="text-[11px] text-red-100/90 mt-0.5 font-sans">
                  Enter patient details, clinical symptoms, and customize diagnoses or notes
                </p>
              </div>

              <div className="p-6 space-y-5">

                {/* Patient Information Grid */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#A32638]" /> Patient Demographics
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Input Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Patient Name</label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#A32638]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Age (Years)</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                        placeholder="e.g. 21"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#A32638]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Department / Major</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Engineering, Biology..."
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#A32638]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Student / Patient ID</label>
                      <input
                        type="text"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        placeholder="e.g. CWID #12345678"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#A32638]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Appointment #</label>
                      <input
                        type="text"
                        value={appointmentNo}
                        onChange={(e) => setAppointmentNo(e.target.value)}
                        placeholder="e.g. 1"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#A32638]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-[10px] font-bold text-slate-600 uppercase">Appointment Time</label>
                        <button
                          type="button"
                          onClick={handleSetCurrentTime}
                          className="text-[9px] text-[#A32638] font-bold hover:underline cursor-pointer"
                        >
                          Set Now
                        </button>
                      </div>
                      <input
                        type="text"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        placeholder="e.g. 10/10/2026 10:30 AM"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#A32638]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-[10px] font-bold text-slate-600 uppercase">Prescription #</label>
                        <button
                          type="button"
                          onClick={handleGeneratePrescriptionNo}
                          className="text-[9px] text-[#A32638] font-bold hover:underline cursor-pointer"
                        >
                          Generate
                        </button>
                      </div>
                      <input
                        type="text"
                        value={prescriptionNo}
                        onChange={(e) => setPrescriptionNo(e.target.value)}
                        placeholder="e.g. 80551"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#A32638]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Attending Doctor</label>
                      <input
                        type="text"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        placeholder="e.g. Dr. Jane Smith, MD"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#A32638]"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Location Input Section - Positioned before Chief Complaints */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#A32638]" /> Location / Clinic Site
                    </label>
                    <span className="text-[10px] text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded font-normal">
                      Input Box
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal mb-1">
                    Enter the clinic location, exam room, or facility intake site before recording symptoms.
                  </p>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Student Health Center, Room 102 / Tuscaloosa Campus Clinic"
                    className="w-full text-xs sm:text-sm font-sans bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#A32638] focus:border-transparent leading-relaxed"
                  />
                </div>

                {/* CRITICAL Symptom Input Section */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Chief Complaints (Current Symptoms) *</span>
                    <span className="text-[10px] text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded font-normal">
                      Input Box
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-500 leading-normal mb-1">
                    Enter the symptoms or active discomfort. Clinical Rx AI will generate medications and required diagnostic tests.
                  </p>
                  <textarea
                    rows={3}
                    value={chiefComplaints}
                    onChange={(e) => setChiefComplaints(e.target.value)}
                    placeholder="e.g. skin itching, rash on trunk, running nose with fever, dry cough, stomach pain..."
                    className="w-full text-xs sm:text-sm font-sans bg-white border border-slate-200 p-3 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#A32638] focus:border-transparent leading-relaxed"
                  />
                  
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={isGenerating || !chiefComplaints.trim()}
                      onClick={handleGenerateFromSymptoms}
                      className="bg-[#A32638] hover:bg-[#821e2c] hover:shadow-xs text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                          Simulating Rx & Tests...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" /> Analyse Symptoms via AI
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Additional Clinical Reasoning & Notes */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="border-b border-slate-200 pb-1.5">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-[#A32638]" /> Clinical History & Findings
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Past Medical History</label>
                      <input
                        type="text"
                        value={pastMedicalHistory}
                        onChange={(e) => setPastMedicalHistory(e.target.value)}
                        placeholder="e.g. No known chronic illnesses or drug allergies"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#A32638]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Other Examination Findings</label>
                      <input
                        type="text"
                        value={otherFindings}
                        onChange={(e) => setOtherFindings(e.target.value)}
                        placeholder="e.g. Clear breath sounds, no lymphadenopathy"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#A32638]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Clinical Diagnosis</label>
                      <input
                        type="text"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="e.g. Acute Viral Pharyngitis"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#A32638]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Doctor's Handwritten Note / Special Instructions</label>
                      <textarea
                        rows={2}
                        value={doctorNote}
                        onChange={(e) => setDoctorNote(e.target.value)}
                        placeholder="e.g. Drink warm fluids, avoid cold water, review in 5 days..."
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#A32638]"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Vitals Calibration Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-2">
                <Activity className="h-4 w-4 text-emerald-600" /> Physical Vitals Adjustments
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Pulse Rate</label>
                  <input
                    type="text"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Blood Pressure</label>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Temperature</label>
                  <input
                    type="text"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Heart Sound</label>
                  <input
                    type="text"
                    value={heart}
                    onChange={(e) => setHeart(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Lung sounds</label>
                  <input
                    type="text"
                    value={lung}
                    onChange={(e) => setLung(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Custom Required Tests Multi-builder Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3.5">
              <h3 className="font-bold flex items-center justify-between text-xs uppercase tracking-widest text-slate-500">
                <span>Manage Suggested Tests</span>
                <span className="text-[10px] text-slate-400 capitalize normal-case font-normal">Add custom lab work</span>
              </h3>
              
              <form onSubmit={handleAddTest} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Skin scraping for KOH, Serum Creatinine"
                  value={newTestText}
                  onChange={(e) => setNewTestText(e.target.value)}
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 rounded-lg text-white font-bold text-xs hover:bg-slate-900 cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </form>

              {requiredTests.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {requiredTests.map((test, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-800 border border-slate-200 px-2 py-1 rounded-md text-[10px] font-semibold transition"
                    >
                      {test}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTest(index)}
                        className="text-slate-400 hover:text-red-650 cursor-pointer p-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">No diagnostic clinical tests are currently recommended.</p>
              )}
            </div>

            {/* Custom Medications Builder Box */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                <span>Prescribe Custom Medicines</span>
              </h3>
              
              <form onSubmit={handleAddMedication} className="space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Tab. Napa Extend 665mg)"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900"
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Distribution (e.g. 1+0+1)"
                      value={newMedDist}
                      onChange={(e) => setNewMedDist(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 5 days)"
                      value={newMedDur}
                      onChange={(e) => setNewMedDur(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 rounded-lg text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" /> Add to Rx Treatments
                  </button>
                </div>
              </form>

              {/* Active list of medicines with delete option inside the builder panel */}
              {medications.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Prescribed Medicines ({medications.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to clear all prescribed medications?")) {
                          setMedications([]);
                        }
                      }}
                      className="text-[10px] text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1 border border-slate-100 rounded-lg bg-slate-50/50 p-2 space-y-1">
                    {medications.map((m, idx) => (
                      <div key={m.id || idx} className="py-1.5 flex items-center justify-between text-xs gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800 truncate">{m.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Dist: {m.distribution} | Dur: {m.duration}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(m.id)}
                          className="text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 p-1 rounded-md text-[10px] font-bold cursor-pointer transition border border-slate-200 bg-white"
                          title="Delete medication"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>


          {/* ==================== RIGHT PREVIEW PANEL (Pixel-perfect replica Of BUET prescription) ==================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quick Export Tools Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Digital Prescription Controls:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer duration-200 bg-white"
                  title="Clear all inputs and outputs"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" /> Reset / Clear Form
                </button>

                <button
                  onClick={handleSavePrescription}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer duration-200 ${saveStatus ? 'bg-slate-100 border-slate-350 text-slate-800 border' : 'bg-[#A32638] hover:bg-[#821e2c] text-white shadow-xs'}`}
                >
                  <Save className="h-4 w-4" /> {saveStatus ? saveStatus : "Save Prescription"}
                </button>

                <button
                  onClick={handleDownloadBUETPdf}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#A32638] hover:bg-[#821e2c] text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-xs duration-200"
                >
                  <Download className="h-4 w-4" /> Download PDF Prescription
                </button>

                <button
                  onClick={handleCopyPrescriptionText}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer duration-200 ${copiedState ? 'bg-slate-50 border-slate-300 text-slate-900' : 'border-[#d2d1cb] bg-slate-50 hover:bg-slate-100 text-slate-700'}`}
                >
                  {copiedState ? "Copied! ✓" : "Copy Plain Text"}
                </button>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#d2d1cb] hover:bg-slate-100 text-xs font-bold text-slate-700 bg-white transition cursor-pointer"
                >
                  <Printer className="h-4 w-4" /> Print Protocol
                </button>
              </div>
            </div>

            {/* Sandbox iframe warning helper */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs flex gap-3">
              <AlertCircle className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">💡 AI Studio Developer Notice:</span> Since this system runs inside of a sandboxed preview, direct print triggers can occasionally be restricted by browser defaults. Click the <span className="font-bold">"Download PDF Prescription"</span> button above to immediately trigger a direct download of this exact prescription.
              </div>
            </div>

            {/* Simulated Printed Recipe Block - Matches image exactly! */}
            <div className="bg-white border-2 border-slate-300 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.06)] print:border-0 print:p-0 font-sans relative overflow-hidden">
              
              {/* Receipt Background Texture decoration */}
              <div className="absolute inset-0 bg-linear-to-b from-neutral-500/[0.002] to-transparent pointer-events-none" />

              {/* Pad inner spacing */}
              <div className="p-6 sm:p-10 space-y-6 print:p-4 select-text">

                {/* Alabama header representing the requested image */}
                <header className="border-b border-stone-300 pb-3 flex flex-col items-center relative">
                  
                  {/* High-fidelity CSS replicated logo matching the image */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-stretch justify-center gap-3 sm:gap-4 py-2 px-1 select-none w-full">
                    {/* Left Column: The University of Alabama */}
                    <div className="flex flex-col items-center sm:items-end justify-center text-center sm:text-right">
                      <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-[#707070] font-sans leading-none">
                        THE UNIVERSITY OF
                      </span>
                      <span className="text-2xl sm:text-3xl font-serif font-extrabold tracking-normal text-[#A32638] leading-none mt-1 h-7 relative">
                        ALABAMA<span className="text-[8px] sm:text-[9px] absolute -top-1 font-sans font-normal ml-0.5">®</span>
                      </span>
                    </div>

                    {/* Vertical Gray Line Divider */}
                    <div className="hidden sm:block w-[1.5px] bg-[#999999] opacity-70 my-1 self-stretch" />
                    {/* Mobile separator if column wrapped */}
                    <div className="block sm:hidden w-16 h-[1.5px] bg-[#999999]/50 my-1" />

                    {/* Right Column: College and Center info */}
                    <div className="flex flex-col items-center sm:items-start justify-center text-center sm:text-left">
                      <div className="flex items-baseline gap-1.5 leading-none">
                        <span className="font-serif italic text-sm sm:text-base text-[#606060] font-medium">
                          College of
                        </span>
                        <span className="font-sans text-sm sm:text-base font-medium tracking-wide text-[#505050]">
                          Community Health Sciences
                        </span>
                      </div>
                      <span className="text-xs sm:text-[13px] font-sans font-semibold tracking-wide text-[#A32638] mt-1.5 leading-none">
                        Student Health Center and Pharmacy
                      </span>
                    </div>
                  </div>

                  <div className="w-full flex justify-between items-center text-[9px] text-slate-450 pt-1.5 border-t border-slate-100 mt-2">
                    <span>University Health Portal Services</span>
                    <span className="font-medium">{appointmentTime ? `Printed ${appointmentTime} | Page 1 of 1` : ''}</span>
                  </div>
                </header>

                {/* Central Title and Barcode Info Row */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
                  
                  {/* Empty balance placeholder */}
                  <div className="hidden sm:block w-[130px]" />

                  {/* Cursive cursive script prescription badge */}
                  <div className="text-center relative">
                    <h1 className="text-3xl font-serif font-bold italic text-slate-900 tracking-wide">
                      Prescription
                    </h1>
                    <div className="h-[2px] w-36 bg-linear-to-r from-transparent via-slate-400 to-transparent mx-auto mt-1" />
                  </div>

                  {/* Simulated barcode */}
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] font-mono font-bold text-slate-800 block mb-0.5">
                      Prescription #{prescriptionNo || "—"}
                    </span>
                    {prescriptionNo ? (
                      <div className="flex gap-[1.5px] items-stretch h-6 mt-1 overflow-hidden opacity-100">
                        {[1,3,1,2,3,4,1,3,2,1,2,4,1,3,1,2,1,3,4,2].map((w,i) => (
                          <div 
                            key={i} 
                            className="bg-black" 
                            style={{ width: `${w * 0.75}px` }} 
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Patient metadata Row with exact spacing and dotted borders */}
                <div className="border border-slate-300 rounded bg-[#fafafa]/80 p-4 text-[11px] sm:text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-2 gap-x-4">
                    
                    <div className="sm:col-span-6">
                      <span className="text-slate-500 font-bold block uppercase text-[9px]">Patient</span>
                      <span className="font-bold text-slate-950">{patientName || "—"}</span>
                    </div>

                    <div className="sm:col-span-3">
                      <span className="text-slate-500 font-bold block uppercase text-[9px]">Age</span>
                      <span className="font-bold text-slate-900">{age ? `${age} Years` : "—"}</span>
                    </div>

                    <div className="sm:col-span-3">
                      <span className="text-slate-500 font-bold block uppercase text-[9px]">Department</span>
                      <span className="font-bold text-slate-900">{department || "—"}</span>
                    </div>

                    {/* Dr name and App info separator */}
                    <div className="sm:col-span-12 border-t border-dotted border-slate-300 my-1"></div>

                    <div className="sm:col-span-5">
                      <span className="text-slate-500 font-bold block uppercase text-[9px]">Appoint#</span>
                      <span className="font-bold text-slate-900">{appointmentNo || "—"}</span>
                    </div>

                    <div className="sm:col-span-7">
                      <span className="text-slate-500 font-bold block uppercase text-[9px]">App Taken</span>
                      <span className="font-semibold text-slate-800 font-mono">{appointmentTime || "—"}</span>
                    </div>

                  </div>
                </div>

                {/* Main diagnosis & vitals examination split column */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
                  
                  {/* Left Column (Exam/Vitals) */}
                  <div className="sm:col-span-4 space-y-4 pr-1">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2">Vitals</h4>
                      
                      <div className="space-y-2.5 font-mono text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-tight">Pulse:</span>
                          <span className="text-slate-850 font-bold">{pulse || "—"}</span>
                        </div>
                        
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-tight">BloodPressure:</span>
                          <span className="text-slate-850 font-bold">{bloodPressure || "—"}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-tight">Temperature:</span>
                          <span className="text-slate-850 font-bold">{temperature || "—"}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-tight">Heart:</span>
                          <span className="text-slate-850 font-semibold">{heart || "—"}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-tight">Lung:</span>
                          <span className="text-slate-850 font-semibold">{lung || "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Chief Complaints output box & Diagnosis) */}
                  <div className="sm:col-span-8 space-y-4 border-l border-slate-100 sm:pl-6">
                    
                    {/* Location reflection */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Location / Facility:</h4>
                      <p className="mt-1 text-slate-800 font-semibold leading-relaxed text-xs">
                        {location ? location : <span className="text-slate-400 font-normal italic">—</span>}
                      </p>
                    </div>

                    {/* Symptom Input reflection */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Chief Complaints:</h4>
                      <p className="mt-1 text-slate-900 font-bold leading-relaxed text-xs sm:text-sm">
                        {chiefComplaints ? chiefComplaints : <span className="text-slate-400 font-normal italic">—</span>}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Past Medical History:</h4>
                      <p className="mt-1 text-slate-700 text-xs font-medium">
                        {pastMedicalHistory ? pastMedicalHistory : <span className="text-slate-400 font-normal italic">—</span>}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Other Findings:</h4>
                      <p className="mt-1 text-slate-700 text-xs font-medium">
                        {otherFindings ? otherFindings : <span className="text-slate-400 font-normal italic">—</span>}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Diagnosis:</h4>
                      {diagnosis ? (
                        <p className="mt-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider bg-slate-100 border border-slate-300 rounded px-2.5 py-1 max-w-fit">
                          {diagnosis}
                        </p>
                      ) : (
                        <span className="text-slate-400 text-xs italic font-normal">—</span>
                      )}
                    </div>

                  </div>
                </div>

                {/* Dotted border wrapper */}
                <div className="border-t border-dashed border-slate-300 pt-5 space-y-6">
                  
                  {/* Suggested Laboratorial / Diagnostics tests (Top Section) */}
                  <div className="space-y-3 select-text">
                    <h4 className="text-[11px] uppercase font-mono font-extrabold text-slate-800 tracking-wider flex items-center gap-1.5">
                      <ClipboardList className="h-4 w-4 text-slate-500" /> Suggested Tests:
                    </h4>
                    
                    {requiredTests.length > 0 ? (
                      <ol className="space-y-1.5 text-xs text-slate-900 font-bold list-decimal pl-4">
                        {requiredTests.map((t, idx) => (
                          <li key={idx} className="marker:text-slate-800">
                            {t}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-xs text-slate-400 italic">—</p>
                    )}
                  </div>

                  {/* Horizontal separator between Tests and Medicines */}
                  <div className="border-t border-dotted border-slate-200"></div>

                  {/* Rx treatments prescription (Bottom Section) */}
                  <div className="space-y-4">
                    {/* Big elegant script 'Rx' logo */}
                    <div className="flex items-end gap-2 text-slate-900">
                      <span className="font-serif font-bold italic text-3xl leading-none">Rx</span>
                      <h4 className="text-[11.5px] uppercase font-bold tracking-widest border-b border-slate-200 pb-0.5 leading-none flex-1">
                        Treatment Protocol
                      </h4>
                    </div>

                    {/* Handwritten instructions exactly matching the image */}
                    {doctorNote && (
                      <div className="p-2 sm:p-3 bg-slate-50 rounded border border-slate-350 leading-relaxed max-w-fit">
                        <span className="text-[9px] uppercase font-extrabold text-slate-700 block tracking-tighter">Doctor's Handwritten Note:</span>
                        <span className="font-serif italic text-xs leading-normal font-semibold text-slate-900 block mt-0.5">
                          "{doctorNote}"
                        </span>
                      </div>
                    )}

                    {/* Rx Medication lists item details */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] sm:text-xs border border-slate-200">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[#475569]">
                            <th className="py-2 px-2.5 font-bold w-6">#</th>
                            <th className="py-2 px-2 font-bold">Medicine</th>
                            <th className="py-2 px-2 font-bold text-center">Distribution</th>
                            <th className="py-2 px-2 font-bold text-right">Duration</th>
                            <th className="py-2 px-2 font-bold text-center print:hidden w-16">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {medications.length > 0 ? (
                            medications.map((m, idx) => (
                              <tr key={m.id} className="hover:bg-slate-50/50 group">
                                <td className="py-2.5 px-2.5 font-bold text-[#475569]">{idx + 1}</td>
                                <td className="py-2.5 px-2 font-bold text-[#0f172a]">{m.name}</td>
                                <td className="py-2.5 px-2 font-semibold text-center text-slate-700 min-w-[70px]">{m.distribution}</td>
                                <td className="py-2.5 px-2 font-semibold text-right text-slate-700">{m.duration}</td>
                                <td className="py-2 px-2 text-center print:hidden">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMedication(m.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-md transition cursor-pointer inline-flex items-center justify-center p-1"
                                    title="Delete medicine"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-4 text-center text-slate-400 italic">
                                —
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Medicine General Uses and Patient Education Companion */}
                    {medications.length > 0 && (
                      <div className="mt-5 p-4 bg-slate-50 border border-slate-200 shadow-2xs space-y-3.5 text-left select-text">
                        <h5 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-850 bg-slate-100 px-2 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-slate-600 animate-pulse" /> Medicine Desk: General Uses &amp; Safety Guide
                        </h5>
                        <div className="space-y-4 divide-y divide-slate-200">
                          {medications.map((m, index) => {
                            const details = getMedicineDetails(m.name);
                            return (
                              <div key={m.id} className={`${index > 0 ? 'pt-3.5' : ''} space-y-1.5`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                  <span className="font-extrabold text-slate-900 text-xs sm:text-[13px]">{m.name}</span>
                                  <span className="text-[9.5px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-mono px-2 py-0.5 rounded border border-slate-300 font-semibold uppercase tracking-wide self-start sm:self-auto shrink-0 transition">
                                    {details.generic}
                                  </span>
                                </div>
                                
                                <div className="text-[11px] leading-relaxed pl-2 border-l-2 border-slate-400 space-y-1">
                                  <p className="text-slate-600">
                                    <span className="font-bold text-slate-700">Category:</span> <span className="text-slate-600 font-mono text-[10px] bg-slate-100 px-1 py-0.2 rounded font-medium">{details.class}</span>
                                  </p>
                                  <p className="text-slate-700 text-xs font-normal">
                                    <span className="font-bold text-slate-800">Primary Purpose:</span> {details.indication}
                                  </p>
                                  <div className="mt-1 text-[10px] text-slate-800 bg-slate-105 p-2 rounded-md border border-slate-200 flex items-start gap-1.5 shadow-3xs leading-relaxed">
                                    <span className="shrink-0 text-[11px]">💡</span>
                                    <span><strong className="font-bold text-slate-900">How to take:</strong> {details.tips}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[9px] text-slate-400 leading-tight italic">
                          *Disclaimer: Provided as clinical patient education details. Take exactly as scheduled on your physical prescription.
                        </p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Final seal stamp and follow up text */}
                <div className="border-t border-slate-200 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-[10px] text-slate-400 text-center sm:text-left shadow-2xs p-3 rounded bg-slate-50">
                  <div className="space-y-1">
                    <span className="text-slate-905 font-bold block uppercase tracking-wide text-[9px]">Follow Up Visit</span>
                    {(diagnosis || doctorNote || chiefComplaints || medications.length > 0) ? (
                      <p className="font-semibold text-slate-700 text-xs">
                        Re-evaluate at the Student Health Center and Pharmacy in 14 days or sooner if symptoms worsen.
                      </p>
                    ) : (
                      <p className="font-semibold text-slate-400 text-xs italic">—</p>
                    )}
                  </div>

                  <div className="border-l pl-4 border-slate-300 text-right shrink-0">
                    <span className="block text-stone-400 text-[8px] uppercase tracking-wider">Senior Specialist Signature</span>
                    <span className="font-serif italic text-xs font-bold text-slate-800 tracking-wider">Authorized Practitioner</span>
                    <span className="block text-[8px] font-mono mt-0.5 text-slate-900">Senior Clinical Specialist, Student Health Center</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Clinical Prescription Enquiry Assistant */}
            <div id="prescription-enquiry-box" className="p-6 bg-stone-50 border border-stone-200 rounded-lg shadow-sm space-y-4 font-sans select-text">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-stone-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-bold text-stone-900 tracking-tight">Prescription Clinical Enquiry Assistant</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Have any questions regarding this generated prescription? Write an enquiry below to receive detailed guidance from our consulting desk relative to this specific prescription's symptoms, diagnosis, tests, or medication timing.
                  </p>
                </div>
              </div>

              {/* Dropdown Options for Preset Enquiries */}
              <div className="space-y-1.5 pt-1">
                <label htmlFor="enquiry-select" className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                  Select a clinical question:
                </label>
                <select
                  id="enquiry-select"
                  onChange={(e) => {
                    const selectedVal = e.target.value;
                    if (selectedVal) {
                      setEnquiryInput(selectedVal);
                      handleSendEnquiry(selectedVal);
                    }
                  }}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-stone-500 font-medium cursor-pointer"
                >
                  <option value="">-- Click to choose a standard clinical enquiry question --</option>
                  <option value="When should I take the prescribed medications (before or after food)?">
                    When should I take the prescribed medications (before or after food)?
                  </option>
                  <option value="Are there any specific lifestyle or dietary restrictions for this diagnosis?">
                    Are there any specific lifestyle or dietary restrictions for this diagnosis?
                  </option>
                  <option value="What are the exact diagnostic preparation steps for the required tests?">
                    What are the exact diagnostic preparation steps for the required tests?
                  </option>
                  <option value="Are there common generic alternatives to these medicines?">
                    Are there common generic alternatives to these medicines?
                  </option>
                  <option value="What should I do if I experience dry skin or mild irritation from the cream/medicines?">
                    What should I do if I experience dry skin or mild irritation from the cream/medicines?
                  </option>
                  <option value="How long does this condition usually take to clear up completely under this treatment plan?">
                    How long does this condition usually take to clear up completely under this treatment plan?
                  </option>
                  <option value="Can I use Savlon/Dettol water directly or is it better to dilute it for standard hygiene?">
                    Can I use Savlon/Dettol water directly or is it better to dilute it for standard hygiene?
                  </option>
                  <option value="What should I do if I miss a dose of the prescribed tablets?">
                    What should I do if I miss a dose of the prescribed tablets?
                  </option>
                  <option value="Is this condition contagious, and how can I protect myself and my family members from it?">
                    Is this condition contagious, and how can I protect myself and my family members from it?
                  </option>
                  <option value="What are the key follow-up benchmarks that I should check before the 14-day re-evaluation?">
                    What are the key follow-up benchmarks that I should check before the 14-day re-evaluation?
                  </option>
                  <option value="Can these medications be safely taken during physical activities or sports sessions at UA?">
                    Can these medications be safely taken during physical activities or sports sessions at UA?
                  </option>
                </select>
              </div>

              {/* Input Form Area */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={enquiryInput}
                  onChange={(e) => setEnquiryInput(e.target.value)}
                  placeholder="Ask a clarifying question about medication frequency, diet guidelines, or test preparations..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendEnquiry();
                    }
                  }}
                  className="flex-1 bg-white border border-stone-350 rounded px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 tracking-tight"
                />
                <button
                  type="button"
                  onClick={() => handleSendEnquiry()}
                  disabled={isAnsweringEnquiry || !enquiryInput.trim()}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {isAnsweringEnquiry ? (
                    <span className="flex items-center gap-1">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>Ask Doctor <ArrowRight className="h-3 w-3" /></>
                  )}
                </button>
              </div>

              {/* Inquiry Response Display */}
              {(enquiryAnswer || enquiryError) && (
                <div className="pt-2 animate-fade-in block">
                  <div className={`p-4 rounded border text-stone-900 ${enquiryError ? 'bg-red-50/50 border-red-200 text-red-800' : 'bg-stone-100 border-stone-200'}`}>
                    <div className="flex items-start border-b border-stone-300 pb-2 mb-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-stone-700" />
                        <span className="font-serif text-xs font-bold text-stone-900">Advisory Response:</span>
                      </div>
                      <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">Verified Specialist Advice</span>
                    </div>

                    {enquiryError ? (
                      <p className="text-xs">{enquiryError}</p>
                    ) : (
                      <div className="text-xs leading-relaxed space-y-1 text-stone-800 font-medium whitespace-pre-line">
                        {enquiryAnswer}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Visitor Traffic & Analytics: Option Below to show visitors today, this month, this year */}
        <VisitorCounter />

      </div>

    </div>
  );
}
