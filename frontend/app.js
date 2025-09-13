// Theme switching
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function setTheme(mode) {
  if (mode === 'light') {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    themeToggle.style.boxShadow = '0 0 10px #1471c4, 0 0 25px #fff';
  } else {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    themeToggle.style.boxShadow = '0 0 10px #29ffe6b2, 0 0 18px #183e6e';
  }
  localStorage.setItem('theme-mode', mode);
}
themeToggle.onclick = () => {
  setTheme(body.classList.contains('dark-mode') ? 'light' : 'dark');
};
window.onload = () => {
  setTheme(localStorage.getItem('theme-mode') || 'dark');
};

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const imagePreview = document.getElementById('imagePreview');
const previewImage = document.getElementById('previewImage');
const heatmapOverlay = document.getElementById('heatmapOverlay');
const resetButton = document.getElementById('resetButton');
const analyzeButton = document.getElementById('analyzeButton');

const homepageSection = document.getElementById('homepage');
const resultsSection = document.getElementById('results');
const previewImageResults = document.getElementById('previewImageResults');
const heatmapOverlayResults = document.getElementById('heatmapOverlayResults');
const findingsGrid = document.getElementById('findingsGrid');
const confidenceValue = document.getElementById('confidenceValue');
const diagnosisTitle = document.getElementById('diagnosisTitle');
const diagnosisDescription = document.getElementById('diagnosisDescription');
const contactDoctorsBtn = document.getElementById('contactDoctorsBtn');
const doctorsModal = document.getElementById('doctorsModal');
const closeDoctorsBtn = document.getElementById('closeDoctorsBtn');
const doctorsGrid = document.getElementById('doctorsGrid');
const consultationFee = document.getElementById('consultationFee');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

let selectedFile = null;

// Upload handler
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  uploadArea.classList.add('hover');
});
uploadArea.addEventListener('dragleave', e => {
  e.preventDefault();
  uploadArea.classList.remove('hover');
});
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('hover');
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    fileInput.files = e.dataTransfer.files;
    handleFile();
  }
});
fileInput.addEventListener('change', handleFile);

function handleFile() {
  const file = fileInput.files[0];
  if (!file) return;
  selectedFile = file;

  const reader = new FileReader();
  reader.onload = function (e) {
    previewImage.src = e.target.result;
    imagePreview.style.display = 'block';
    uploadArea.style.display = 'none';
    showToast('Image loaded. You can now analyze.');
  };
  reader.readAsDataURL(file);
}

resetButton.onclick = () => {
  fileInput.value = '';
  selectedFile = null;
  imagePreview.style.display = 'none';
  uploadArea.style.display = 'block';
  heatmapOverlay.src = '';
};

analyzeButton.onclick = () => {
  if (!selectedFile) return showToast('Please select an image first.');
  uploadProgress.style.display = 'block';
  progressFill.style.width = '0%';
  progressText.textContent = 'Uploading... 0%';

  const formData = new FormData();
  formData.append('file', selectedFile);

  fetch('http://127.0.0.1:8000/predict', {
    method: 'POST',
    body: formData
  }).then(async resp => {
    uploadProgress.style.display = 'none';
    if (!resp.ok) {
      showToast('Analysis failed.');
      return;
    }
    const result = await resp.json();
    homepageSection.style.display = 'none';
    resultsSection.style.display = 'block';

    previewImageResults.src = previewImage.src;
    heatmapOverlayResults.src = 'data:image/png;base64,' + result.combined_heatmap;
    confidenceValue.textContent = Math.round(result.confidence_metrics.overall_confidence * 100) + '%';

    // ----- New pathology selection logic -----
    let findings = result.findings || [];

    // Top 2 non-critical (excluding pneumonia)
    let nonCritical = findings.filter(f => !f.critical && f.disease.toLowerCase() !== "pneumonia");
    let top2 = nonCritical.sort((a, b) => b.confidence - a.confidence).slice(0, 2);

    // Find any pneumonia (critical or not)
    let pneumoniaFinding = findings.find(f => f.disease.toLowerCase() === "pneumonia");

    // Display: always top2 + pneumonia if not already in top2
    let toDisplay = top2.slice();
    if (
      pneumoniaFinding &&
      !toDisplay.some(f => f.disease.toLowerCase() === "pneumonia")
    ) {
      toDisplay.push(pneumoniaFinding);
    }

    findingsGrid.innerHTML = '';
    toDisplay.forEach(f => {
      findingsGrid.innerHTML += `
        <div class="feature-card">
          <div class="feature-title">${f.disease}</div>
          <div class="feature-desc">${f.description}</div>
          <div style="font-size:0.93rem; color:#29ffe6c9; margin-top:2px;">
            Confidence: ${Math.round(f.confidence * 100)}% | Severity: ${f.severity}
          </div>
        </div>
      `;
    });

    if (toDisplay.length > 0) {
      diagnosisTitle.textContent = toDisplay[0].disease;
      diagnosisDescription.textContent = toDisplay[0].description;
    } else {
      diagnosisTitle.textContent = 'No significant findings';
      diagnosisDescription.textContent = 'The AI did not detect any concerning conditions.';
    }
    // ----- End pathology selection logic -----

  }).catch(e => {
    uploadProgress.style.display = 'none';
    showToast('AI backend request failed.');
  });
};

// Doctor data (synthetic)
const doctors = [
  {
    name: 'Dr. Siddharth Rao',
    speciality: 'Pulmonology',
    desc: 'Chest & respiratory specialist',
    phone: '+91-9022000110',
    fee: 400
  },
  {
    name: 'Dr. Leela Priya Kumar',
    speciality: 'Radiology',
    desc: 'Senior X-ray/Imaging consultant',
    phone: '+91-9099700512',
    fee: 350
  },
  {
    name: 'Dr. Rajat Agrawal',
    speciality: 'General Physician',
    desc: 'Internal Medicine, Diagnosis',
    phone: '+91-8866800124',
    fee: 300
  },
  {
    name: 'Dr. Reshma Suresh',
    speciality: 'Cardiology',
    desc: 'Heart & chest expert',
    phone: '+91-9977700566',
    fee: 700
  },
];

contactDoctorsBtn.onclick = () => {
  doctorsModal.style.display = 'flex';
  doctorsGrid.innerHTML = '';
  let randomIdx = Math.floor(Math.random() * doctors.length);
  consultationFee.textContent = doctors[randomIdx].fee;
  doctors.forEach(doc => {
    doctorsGrid.innerHTML += `
      <div class="doctor-card">
        <div class="doctor-title">${doc.name} — ${doc.speciality}</div>
        <div class="doctor-desc">${doc.desc}</div>
        <div class="doctor-contact">Phone: ${doc.phone}<br>
        Fee: ₹${doc.fee}</div>
      </div>
    `;
  });
};
closeDoctorsBtn.onclick = () => {
  doctorsModal.style.display = 'none';
};

function showToast(msg) {
  toastMessage.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
