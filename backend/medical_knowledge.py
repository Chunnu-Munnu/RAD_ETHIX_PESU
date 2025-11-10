# backend/medical_knowledge.py


MEDICAL_KNOWLEDGE = {
    "Atelectasis": {
        "definition": "Collapse or closure of a lung resulting in reduced or absent gas exchange",
        "xray_findings": [
            "Increased opacity in affected area",
            "Volume loss with mediastinal shift toward affected side",
            "Elevation of hemidiaphragm",
            "Crowding of ribs on affected side"
        ],
        "clinical_significance": "May indicate airway obstruction, post-surgical complication, or mucus plugging",
        "action_steps": [
            "Assess for underlying cause (obstruction, infection)",
            "Consider chest physiotherapy and incentive spirometry",
            "Evaluate need for bronchoscopy if persistent",
            "Monitor oxygen saturation and respiratory status"
        ],
        "citations": [
            "Woodring JH, Reed JC. Types and mechanisms of pulmonary atelectasis. J Thorac Imaging. 1996;11(2):92-108",
            "Duggan M, Kavanagh BP. Pulmonary atelectasis: a pathogenic perioperative entity. Anesthesiology. 2005;102(4):838-854"
        ]
    },
    
    "Cardiomegaly": {
        "definition": "Enlargement of the heart, typically defined as cardiothoracic ratio greater than 0.5 on PA chest radiograph",
        "xray_findings": [
            "Increased cardiac silhouette width",
            "Cardiothoracic ratio exceeding 50%",
            "Bilateral enlargement of cardiac borders",
            "Possible pulmonary vascular congestion"
        ],
        "clinical_significance": "Associated with heart failure, valvular disease, hypertension, or cardiomyopathy",
        "action_steps": [
            "Perform echocardiography for structural and functional assessment",
            "Evaluate for clinical signs of heart failure",
            "Check BNP or NT-proBNP levels",
            "Review and optimize cardiac medication regimen"
        ],
        "citations": [
            "Danzer CS. The cardiothoracic ratio: An index of cardiac enlargement. Am J Med Sci. 1919;157:513-521",
            "Mensah GA, et al. Heart failure-related hospitalization in the United States. J Am Coll Cardiol. 2007;52(6):428-434"
        ]
    },
    
    "Consolidation": {
        "definition": "Replacement of alveolar air by fluid, pus, blood, cells, or other substances resulting in increased lung density",
        "xray_findings": [
            "Homogeneous opacity obscuring vascular markings",
            "Air bronchograms frequently visible",
            "Lobar or segmental distribution pattern",
            "No volume loss typically present"
        ],
        "clinical_significance": "Most commonly indicates pneumonia, but may represent pulmonary edema, hemorrhage, or tumor",
        "action_steps": [
            "Correlate with clinical symptoms including fever, cough, dyspnea",
            "Obtain sputum culture and inflammatory markers (WBC, CRP, procalcitonin)",
            "Initiate appropriate antibiotic therapy if bacterial infection suspected",
            "Schedule follow-up imaging in 6-8 weeks to confirm resolution"
        ],
        "citations": [
            "Hansell DM, et al. Fleischner Society: Glossary of terms for thoracic imaging. Radiology. 2008;246(3):697-722",
            "Metlay JP, et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. Am J Respir Crit Care Med. 2019;200(7):e45-e67"
        ]
    },
    
    "Edema": {
        "definition": "Accumulation of extravascular fluid in lung interstitium and alveoli, typically cardiogenic or non-cardiogenic in origin",
        "xray_findings": [
            "Bilateral perihilar opacity with bat-wing or butterfly pattern",
            "Kerley B lines indicating septal thickening",
            "Bilateral pleural effusions often present",
            "Vascular redistribution to upper lung zones"
        ],
        "clinical_significance": "Indicates heart failure, fluid overload, ARDS, renal failure, or capillary leak syndrome",
        "action_steps": [
            "Administer diuretics if cardiogenic origin suspected",
            "Assess fluid balance and volume status carefully",
            "Monitor oxygen saturation and provide supplemental oxygen as needed",
            "Evaluate underlying cardiac, renal, or hepatic function"
        ],
        "citations": [
            "Ware LB, Matthay MA. Clinical practice. Acute pulmonary edema. N Engl J Med. 2005;353(26):2788-2796",
            "Ketai L, Godwin JD. A new view of pulmonary edema and acute respiratory distress syndrome. J Thorac Imaging. 1998;13(3):147-171"
        ]
    },
    
    "Enlarged Cardiomediastinum": {
        "definition": "Widening of the mediastinal silhouette beyond normal limits, potentially involving cardiac or mediastinal structures",
        "xray_findings": [
            "Mediastinal width greater than 8 cm on PA view",
            "Widening of superior mediastinum",
            "Loss of normal mediastinal contours",
            "May involve cardiac enlargement component"
        ],
        "clinical_significance": "Differential includes cardiomegaly, lymphadenopathy, mediastinal mass, aortic aneurysm, or mediastinitis",
        "action_steps": [
            "Obtain CT chest with contrast for detailed evaluation",
            "Assess for signs of aortic pathology including dissection",
            "Evaluate for infectious or inflammatory causes",
            "Consider echocardiography to assess cardiac contribution"
        ],
        "citations": [
            "Whitten CR, et al. A diagnostic approach to mediastinal abnormalities. Radiographics. 2007;27(3):657-671",
            "Juanpere S, et al. A diagnostic approach to the mediastinal masses. Insights Imaging. 2013;4(1):29-52"
        ]
    },
    
    "Fracture": {
        "definition": "Break in continuity of rib or other thoracic bony structures, typically traumatic in origin",
        "xray_findings": [
            "Cortical disruption or step-off deformity",
            "Displacement or angulation of bone fragments",
            "Associated soft tissue swelling",
            "Possible associated pneumothorax or hemothorax"
        ],
        "clinical_significance": "Trauma-related injury with risk of underlying pulmonary contusion, pneumothorax, or hemothorax",
        "action_steps": [
            "Carefully assess for pneumothorax, hemothorax, or pulmonary contusion",
            "Provide adequate analgesia to prevent hypoventilation",
            "Encourage incentive spirometry to prevent atelectasis",
            "Monitor closely for delayed complications including pneumonia"
        ],
        "citations": [
            "Sirmali M, et al. A comprehensive analysis of traumatic rib fractures. Eur J Cardiothorac Surg. 2003;24(1):133-138",
            "Bulger EM, et al. Rib fractures in the elderly. J Trauma. 2000;48(6):1040-1047"
        ]
    },
    
    "Lung Lesion": {
        "definition": "Focal abnormality within lung parenchyma, may represent nodule, mass, or other discrete pathology",
        "xray_findings": [
            "Discrete rounded or irregular opacity",
            "Well-defined or poorly-defined margins",
            "Size variable from small nodule to large mass",
            "May be solitary or multiple"
        ],
        "clinical_significance": "Broad differential including malignancy, infection (granuloma), benign tumor, or metastasis",
        "action_steps": [
            "Obtain prior imaging for comparison if available",
            "CT chest with contrast for detailed characterization",
            "Apply Fleischner Society guidelines for nodule management",
            "Consider biopsy or PET scan if malignancy suspected"
        ],
        "citations": [
            "MacMahon H, et al. Guidelines for Management of Incidental Pulmonary Nodules. Radiology. 2017;284(1):228-243",
            "Ost DE, et al. Clinical and organizational factors in the initial evaluation of patients with lung cancer. Chest. 2013;143(5 Suppl):e121S-e141S"
        ]
    },
    
    "Lung Opacity": {
        "definition": "Any area of increased density within the lung parenchyma on radiograph, non-specific finding",
        "xray_findings": [
            "Hazy increased density not obscuring vessels",
            "Ground-glass appearance possible",
            "May be focal, multifocal, or diffuse",
            "Variable patterns and distributions"
        ],
        "clinical_significance": "Non-specific finding that may represent infection, inflammation, interstitial disease, or early consolidation",
        "action_steps": [
            "Clinical correlation with symptoms and history essential",
            "Determine acute versus chronic nature",
            "Consider CT chest for further characterization if persistent",
            "Follow-up imaging to assess for progression or resolution"
        ],
        "citations": [
            "Hansell DM, et al. Fleischner Society: Glossary of terms for thoracic imaging. Radiology. 2008;246(3):697-722",
            "Remy-Jardin M, et al. Ground-glass opacity. Semin Ultrasound CT MR. 2002;23(2):246-260"
        ]
    },
    
    "No Finding": {
        "definition": "Chest radiograph demonstrates normal pulmonary and cardiac structures without pathologic findings",
        "xray_findings": [
            "Clear lung fields bilaterally",
            "Normal cardiac silhouette and mediastinal contours",
            "Sharp costophrenic angles",
            "Normal pulmonary vasculature"
        ],
        "clinical_significance": "Normal chest radiograph, though clinical symptoms may still warrant further evaluation",
        "action_steps": [
            "Correlate with clinical presentation",
            "Consider that chest X-ray has limitations in sensitivity",
            "CT chest may be warranted if high clinical suspicion despite normal X-ray",
            "Reassure patient but maintain clinical vigilance"
        ],
        "citations": [
            "Raoof S, et al. Interpretation of plain chest roentgenogram. Chest. 2012;141(2):545-558",
            "Bradley SH, et al. Sensitivity of chest X-ray for detecting lung cancer in primary care. Br J Gen Pract. 2019;69(689):e827-e835"
        ]
    },
    
    "Pleural Effusion": {
        "definition": "Abnormal collection of fluid in the pleural space between the visceral and parietal pleura",
        "xray_findings": [
            "Blunting of costophrenic angle on upright view",
            "Meniscus sign along lateral chest wall",
            "Homogeneous opacity obscuring lung base",
            "Mediastinal shift away from effusion if large volume"
        ],
        "clinical_significance": "Multiple etiologies including heart failure, infection (parapneumonic), malignancy, or inflammatory conditions",
        "action_steps": [
            "Perform thoracentesis for diagnostic and therapeutic purposes",
            "Analyze pleural fluid using Light's criteria to differentiate transudate versus exudate",
            "Treat underlying cause such as diuretics for CHF or antibiotics for infection",
            "Monitor for reaccumulation and consider chest tube if indicated"
        ],
        "citations": [
            "Light RW. Clinical practice. Pleural effusion. N Engl J Med. 2002;346(25):1971-1977",
            "Porcel JM, Light RW. Diagnostic approach to pleural effusion in adults. Am Fam Physician. 2006;73(7):1211-1220"
        ]
    },
    
    "Pleural Other": {
        "definition": "Pleural abnormalities other than effusion, including thickening, plaques, calcification, or masses",
        "xray_findings": [
            "Pleural thickening or irregularity",
            "Pleural plaques often bilateral",
            "Calcification along pleural surfaces",
            "Focal pleural-based masses or nodules"
        ],
        "clinical_significance": "May indicate asbestos exposure, prior empyema, tuberculosis, or pleural malignancy",
        "action_steps": [
            "Obtain detailed occupational and exposure history",
            "CT chest for detailed characterization of pleural abnormality",
            "Consider pleural biopsy if malignancy suspected",
            "Pulmonary function tests if restrictive pattern suspected"
        ],
        "citations": [
            "Maskell NA, Butland RJ. BTS guidelines for the investigation of a unilateral pleural effusion in adults. Thorax. 2003;58 Suppl 2:ii8-17",
            "Huggins JT, et al. Pleural disease. Lancet. 2017;390(10113):2662-2674"
        ]
    },
    
    "Pneumonia": {
        "definition": "Infection of the lung parenchyma with inflammatory consolidation, most commonly bacterial or viral",
        "xray_findings": [
            "Airspace opacity with consolidation pattern",
            "Air bronchograms commonly present",
            "Lobar, segmental, or patchy distribution",
            "May have associated pleural effusion"
        ],
        "clinical_significance": "Common respiratory infection requiring prompt antibiotic therapy, varying severity from outpatient to ICU-level care",
        "action_steps": [
            "Assess severity using CURB-65 or PSI score",
            "Obtain blood cultures and sputum culture before antibiotics",
            "Initiate empiric antibiotic therapy based on likely pathogens",
            "Monitor clinical response and consider follow-up imaging"
        ],
        "citations": [
            "Metlay JP, et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. Am J Respir Crit Care Med. 2019;200(7):e45-e67",
            "Mandell LA, et al. Infectious Diseases Society of America/American Thoracic Society consensus guidelines. Clin Infect Dis. 2007;44 Suppl 2:S27-72"
        ]
    },
    
    "Pneumothorax": {
        "definition": "Presence of air in the pleural space causing partial or complete lung collapse",
        "xray_findings": [
            "Visceral pleural line visible separated from chest wall",
            "Absence of lung markings peripheral to pleural line",
            "Deep sulcus sign on supine films",
            "Mediastinal shift away from pneumothorax if tension physiology"
        ],
        "clinical_significance": "May be spontaneous (primary or secondary) or traumatic, tension pneumothorax is life-threatening emergency",
        "action_steps": [
            "Assess hemodynamic stability immediately",
            "Measure size of pneumothorax (British Thoracic Society or American College guidelines)",
            "Small pneumothorax may be observed, larger requires chest tube placement",
            "Immediate needle decompression if tension pneumothorax suspected"
        ],
        "citations": [
            "MacDuff A, et al. Management of spontaneous pneumothorax: British Thoracic Society Pleural Disease Guideline 2010. Thorax. 2010;65 Suppl 2:ii18-31",
            "Baumann MH, et al. Management of spontaneous pneumothorax: an American College of Chest Physicians Delphi consensus statement. Chest. 2001;119(2):590-602"
        ]
    },
    
    "Support Devices": {
        "definition": "Medical devices visible on chest radiograph including tubes, lines, pacemakers, or other supportive equipment",
        "xray_findings": [
            "Endotracheal or tracheostomy tube visualization",
            "Central venous catheters or PICC lines",
            "Nasogastric or feeding tubes",
            "Chest tubes, pacemakers, or ICD leads"
        ],
        "clinical_significance": "Important to verify appropriate positioning and absence of complications from device placement",
        "action_steps": [
            "Verify endotracheal tube position 2-4 cm above carina",
            "Confirm central line tip in lower SVC or cavoatrial junction",
            "Check for pneumothorax after central line or chest tube placement",
            "Ensure pacemaker/ICD leads are appropriately positioned"
        ],
        "citations": [
            "Godwin JD, et al. Pitfalls in evaluation of the chest radiograph in intensive care unit patients. J Thorac Imaging. 1995;10(4):247-254",
            "Tse JL, et al. Chest radiograph after central venous catheter insertion. Can J Anaesth. 2009;56(10):769-774"
        ]
    }
}


def get_pathology_info(pathology_name):
    """Retrieve medical knowledge for a specific pathology"""
    return MEDICAL_KNOWLEDGE.get(pathology_name, None)


def get_all_pathologies():
    """Return list of all pathology names"""
    return list(MEDICAL_KNOWLEDGE.keys())


def search_knowledge(query):
    """Simple search across all pathologies"""
    query_lower = query.lower()
    results = []
    
    for pathology, info in MEDICAL_KNOWLEDGE.items():
        # Search in definition and findings
        if (query_lower in pathology.lower() or 
            query_lower in info['definition'].lower() or
            any(query_lower in finding.lower() for finding in info['xray_findings'])):
            results.append({
                'pathology': pathology,
                'info': info
            })
    
    return results