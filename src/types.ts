export type Gender = 'male' | 'female' | 'other';

export interface PrescriptionPrescription {
  prescriptionNo: string;
  patientName: string;
  patientId: string;
  age: number;
  department: string;
  designation: string;
  doctorName: string;
  appointmentNo: string;
  appointmentTime: string;
  
  // Vitals
  pulse: string;
  bloodPressure: string;
  temperature: string;
  heart: string;
  lung: string;

  // Clinical Text
  chiefComplaints: string; // Current Symptoms
  pastMedicalHistory: string;
  otherFindings: string;
  diagnosis: string;
  doctorNote: string; // "Savlon/dettol diye..." equivalent

  // Outputs (Required Tests & Medications)
  requiredTests: string[];
  medications: MedicationItem[];
}

export interface MedicationItem {
  id: string;
  name: string;
  distribution: string; // e.g. "1+0+1", "apply over the affected area 2 times"
  duration: string; // e.g. "14 days", "14 days after meal"
}

export interface PrescriptionResponse {
  prescriptionNo: string;
  doctorName: string;
  appointmentNo: string;
  pulse: string;
  bloodPressure: string;
  temperature: string;
  heart: string;
  lung: string;
  otherFindings: string;
  diagnosis: string;
  doctorNote: string;
  requiredTests: string[];
  medications: MedicationItem[];
  summaryMessage: string;
}
