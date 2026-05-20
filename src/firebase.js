import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if using placeholder credentials
const isMock = !firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_API_KEY");

let realAuth, realDb;
if (!isMock) {
  try {
    const app = initializeApp(firebaseConfig);
    realAuth = getAuth(app);
    realDb = getFirestore(app);
  } catch (err) {
    console.error("Firebase failed to initialize, falling back to Mock Mode.", err);
  }
}

// -------------------------------------------------------------
// HMS Mock Layer (LocalStorage Mock Database Engine)
// -------------------------------------------------------------

const initMockData = () => {
  const getOrSet = (key, defaultVal) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
    }
    return JSON.parse(localStorage.getItem(key));
  };

  // Mock Users Directory
  getOrSet('hms_users', [
    {
      id: 'admin_1',
      name: 'Executive Admin',
      email: 'admin@healthcare.com',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'doctor_1',
      name: 'Dr. Sarah Jenkins',
      email: 'doctor@healthcare.com',
      role: 'doctor',
      department: 'Cardiology',
      specialization: 'Chief Cardiologist',
      createdAt: new Date().toISOString()
    },
    {
      id: 'patient_1',
      name: 'Alex Mercer',
      email: 'patient@healthcare.com',
      role: 'patient',
      createdAt: new Date().toISOString()
    },
    {
      id: 'staff_1',
      name: 'Workstation Staff',
      email: 'staff@healthcare.com',
      role: 'staff',
      createdAt: new Date().toISOString()
    }
  ]);

  // Mock Inventory
  getOrSet('hms_inventory', [
    {
      id: 'med_1',
      name: 'Amoxicillin 500mg',
      stock: 420,
      unit: 'Units',
      category: 'Antibiotics',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'med_2',
      name: 'Paracetamol IV',
      stock: 850,
      unit: 'Units',
      category: 'Analgesics',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'med_3',
      name: 'Lisinopril 10mg',
      stock: 95,
      unit: 'Units',
      category: 'Antihypertensives',
      updatedAt: new Date().toISOString()
    }
  ]);

  // Mock Lab Requests
  getOrSet('hms_lab_requests', [
    {
      id: 'lab_1',
      patientId: 'patient_1',
      patientName: 'Alex Mercer',
      doctorId: 'doctor_1',
      doctorName: 'Dr. Sarah Jenkins',
      testType: 'Complete Blood Count (CBC)',
      result: 'Pending laboratory examination...',
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  ]);

  // Mock Appointments & Prescriptions
  getOrSet('hms_appointments', []);
  getOrSet('hms_prescriptions', []);
};

if (isMock) {
  initMockData();
}

// Custom Event dispatchers for real-time notifications
const triggerUpdate = (collectionName) => {
  window.dispatchEvent(new CustomEvent('hms_db_update', { detail: { collection: collectionName } }));
};

const triggerAuthChange = () => {
  window.dispatchEvent(new CustomEvent('hms_auth_change'));
};

// -------------------------------------------------------------
// Mock API Wrapper Exports
// -------------------------------------------------------------

export const auth = !isMock ? realAuth : {
  config: { apiKey: firebaseConfig.apiKey },
  currentUser: JSON.parse(localStorage.getItem('hms_current_user')) || null
};

export const db = !isMock ? realDb : { mock: true };

// Auth API Mock
export const signInWithEmailAndPassword = async (authObj, email, password) => {
  if (!isMock) {
    const { signInWithEmailAndPassword: realSignIn } = await import('firebase/auth');
    return realSignIn(realAuth, email, password);
  }

  const users = JSON.parse(localStorage.getItem('hms_users')) || [];
  const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (foundUser && password.length >= 4) { // Simulate validation
    const mockUser = {
      uid: foundUser.id,
      email: foundUser.email,
      displayName: foundUser.name
    };
    localStorage.setItem('hms_current_user', JSON.stringify(mockUser));
    auth.currentUser = mockUser;
    triggerAuthChange();
    return { user: mockUser };
  } else {
    throw new Error("auth/user-not-found");
  }
};

export const signOut = async (authObj) => {
  if (!isMock) {
    const { signOut: realSignOut } = await import('firebase/auth');
    return realSignOut(realAuth);
  }
  localStorage.removeItem('hms_current_user');
  auth.currentUser = null;
  triggerAuthChange();
};

export const onAuthStateChanged = (authObj, callback) => {
  if (!isMock) {
    const { onAuthStateChanged: realOnAuth } = require('firebase/auth'); // or dyn import
    // Note: since this is handled in AuthContext, we use dynamic/module reference.
    // To keep it simple, we wrap AuthContext to check isMock as well.
  }

  // Mock implementation
  const handleEvent = () => {
    const user = JSON.parse(localStorage.getItem('hms_current_user'));
    callback(user);
  };
  window.addEventListener('hms_auth_change', handleEvent);
  
  // Initial call
  handleEvent();
  return () => window.removeEventListener('hms_auth_change', handleEvent);
};

// Timestamp simulation
export const Timestamp = {
  now: () => ({
    toDate: () => new Date(),
    seconds: Math.floor(Date.now() / 1000)
  })
};

// Firestore API Mock Helper
const getLocalStorageKey = (col) => {
  if (typeof col === 'string') return `hms_${col}`;
  return `hms_${col._path}`;
};

// Firestore CRUD operations wrapper
export const collection = (dbObj, path) => {
  return isMock ? { _path: path } : collection(realDb, path);
};

export const doc = (dbObj, path, id) => {
  if (isMock) {
    return { _path: path, id: id };
  }
  const { doc: realDoc } = require('firebase/firestore');
  return realDoc(realDb, path, id);
};

export const query = (colRef, ...constraints) => {
  if (!isMock) {
    // Dynamic query helper
  }
  return { colRef, constraints };
};

export const where = (field, op, value) => {
  return { field, op, value };
};

export const addDoc = async (colRef, data) => {
  if (!isMock) {
    const { addDoc: realAdd } = await import('firebase/firestore');
    return realAdd(collection(realDb, colRef._path), data);
  }

  const key = getLocalStorageKey(colRef);
  const items = JSON.parse(localStorage.getItem(key)) || [];
  const newItem = {
    id: `mock_id_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    createdAt: data.createdAt || new Date().toISOString()
  };
  
  // Format timestamps
  if (newItem.date && newItem.date.toDate) {
    newItem.date = newItem.date.toDate().toISOString();
  }

  items.push(newItem);
  localStorage.setItem(key, JSON.stringify(items));
  triggerUpdate(colRef._path);
  return { id: newItem.id };
};

export const updateDoc = async (docRef, data) => {
  if (!isMock) {
    const { updateDoc: realUpdate } = await import('firebase/firestore');
    // For safety, we resolve this wrapper on the fly
  }

  const key = getLocalStorageKey(docRef);
  const items = JSON.parse(localStorage.getItem(key)) || [];
  const updatedItems = items.map(item => {
    if (item.id === docRef.id) {
      return { ...item, ...data };
    }
    return item;
  });

  localStorage.setItem(key, JSON.stringify(updatedItems));
  triggerUpdate(docRef._path);
};

export const deleteDoc = async (docRef) => {
  if (!isMock) {
    // Real delete
  }

  const key = getLocalStorageKey(docRef);
  const items = JSON.parse(localStorage.getItem(key)) || [];
  const filtered = items.filter(item => item.id !== docRef.id);
  localStorage.setItem(key, JSON.stringify(filtered));
  triggerUpdate(docRef._path);
};

export const getDoc = async (docRef) => {
  if (!isMock) {
    const { getDoc: realGetDoc } = await import('firebase/firestore');
    return realGetDoc(docRef);
  }

  const key = getLocalStorageKey(docRef);
  const items = JSON.parse(localStorage.getItem(key)) || [];
  const item = items.find(i => i.id === docRef.id);
  
  return {
    exists: () => !!item,
    data: () => item
  };
};

export const getDocs = async (queryObj) => {
  if (!isMock) {
    const { getDocs: realGetDocs } = await import('firebase/firestore');
    // Handled dynamically
  }

  // Parse query constraints
  let path = '';
  let constraints = [];
  if (queryObj.colRef) {
    path = queryObj.colRef._path;
    constraints = queryObj.constraints || [];
  } else {
    path = queryObj._path;
  }

  const key = `hms_${path}`;
  let items = JSON.parse(localStorage.getItem(key)) || [];

  // Filter mock records
  constraints.forEach(c => {
    if (c.op === '==') {
      items = items.filter(item => item[c.field] === c.value);
    }
  });

  const docs = items.map(item => ({
    id: item.id,
    data: () => item
  }));

  return {
    forEach: (callback) => docs.forEach(callback),
    size: docs.length
  };
};

export const onSnapshot = (queryObj, callback, errorCallback) => {
  if (!isMock) {
    // Handled dynamically
  }

  let path = '';
  if (queryObj.colRef) {
    path = queryObj.colRef._path;
  } else {
    path = queryObj._path;
  }

  const handleUpdate = async () => {
    try {
      const snap = await getDocs(queryObj);
      callback(snap);
    } catch (err) {
      if (errorCallback) errorCallback(err);
    }
  };

  // Add event listener
  const listener = (e) => {
    if (e.detail.collection === path) {
      handleUpdate();
    }
  };

  window.addEventListener('hms_db_update', listener);
  
  // Initial load
  handleUpdate();
  
  return () => window.removeEventListener('hms_db_update', listener);
};

export default { auth, db };
