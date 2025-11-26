# Pulse Point - Smart Healthcare Outreach Platform

![Salesforce](https://img.shields.io/badge/Salesforce-00A1E0?style=for-the-badge&logo=salesforce&logoColor=white)
![Lightning Web Components](https://img.shields.io/badge/LWC-Lightning_Web_Components-blue?style=for-the-badge)
![Apex](https://img.shields.io/badge/Apex-Backend_Logic-green?style=for-the-badge)
![Experience Cloud](https://img.shields.io/badge/Experience_Cloud-Patient_Portal-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Pulse Point** is a comprehensive, end-to-end healthcare delivery system built on the Salesforce platform. It connects health workers, doctors, and patients through a unified ecosystem, digitizing the entire lifecycle of patient outreach, immunization tracking, and program enrollment.

The centerpiece of the project is a fully custom **Experience Cloud Patient Portal** featuring a modern "Glassmorphism" UI design, interactive dashboards, and secure self-service capabilities.

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technical Architecture](#-technical-architecture)
- [Component Showcase](#-component-showcase)
- [Automation & Logic](#-automation--logic)
- [Security Model](#-security-model)
- [Installation](#-installation)

---

## 🏥 Project Overview

**Business Problem:** A public health organization struggled with manual patient tracking, fragmented data, and high administrative overhead. Patients lacked visibility into their own health records, leading to missed appointments and low engagement.

**The Solution:** A scalable Salesforce solution that:
* **Empowers Patients:** Through a secure portal to view records and download certificates.
* **Enables Staff:** With tools to log visits, track high-risk patients, and manage immunizations.
* **Automates Care:** Through daily scheduled flows for reminders and trigger-based validation.

---

## ✨ Key Features

### 1. 🔐 Secure Patient Portal (Experience Cloud)
A branded, self-service site where patients can log in to:
* View their **Appointment History** (Upcoming & Past).
* Track **Immunization Status** and **Program Progress**.
* Download official **PDF Medical Certificates** upon program completion.
* Access a library of health articles.

### 2. 🎨 Modern UI/UX (Glassmorphism)
Moved beyond standard Salesforce layouts by building custom **Lightning Web Components (LWC)** with a unified design language:
* **Dark/Light Glass Effect:** Translucent cards with background blur (`backdrop-filter`).
* **Interactive Elements:** Neumorphic sliders, animated gradients, and floating action buttons.
* **Responsive Design:** Fully optimized for mobile and desktop devices.

### 3. 📄 Professional Document Generation
* **Visualforce PDF Engine:** Generates pixel-perfect, A4 landscape medical certificates dynamically using Apex controllers and Static Resources for assets.

---

## ⚙️ Technical Architecture

### Data Model
The system is built on a robust custom data model including:
* **`Wellness_Program__c`**: Defines health initiatives (e.g., Diabetes Care).
* **`Patient_Pathway__c`**: Tracks a patient's enrollment and progress in a program.
* **`Visit__c`**: Records patient-doctor interactions.
* **`Vaccination_Record__c`**: Logs vaccine administration details.
* **`Clinical_Note__c`**: Stores secure doctor notes.

### Lightning Web Components (LWC)
* **`appointmentDashboard`**: A 2x2 grid dashboard displaying real-time stats (Upcoming, Completed, Canceled) with "dark glass" styling.
* **`ageBasedNutrients` & `vitaminFinder`**: Two unrelated components communicating via **Lightning Message Service (LMS)**. Changing the age slider dynamically filters the vitamin recommendations.
* **`doctorNoteList`**: An accordion-style list that allows patients to expand notes and download prescriptions.
* **`enrollmentDashboard`**: Visualizes program progress using CSS conic-gradients (donut charts) without external libraries.

### Apex Classes
* **Trigger Handler Pattern:** Implemented `PatientPathwayTriggerHandler` to enforce complex logic (e.g., age eligibility checks) while keeping triggers logic-less.
* **Secure Data Access:** All portal controllers use `without sharing` combined with `UserInfo.getContactId()` to securely fetch *only* the logged-in user's data, bypassing standard sharing limitations where appropriate.

---

## 🤖 Automation & Logic

* **Apex Triggers:**
    * **Age Validation:** Prevents enrollment if a patient is below the minimum age for a specific wellness program.
* **Salesforce Flow:**
    * **Patient Intake (Screen Flow):** Guides staff through registering a new patient and creating their first visit.
    * **Daily Reminders (Scheduled Flow):** Runs nightly to identify upcoming immunizations and creates tasks for health workers 7 days in advance.
    * **Follow-Up Automation (Record-Triggered):** Automatically assigns tasks when a doctor sets a "Next Follow-up Date."
* **Approval Processes:**
    * **High-Risk Visits:** Visits flagged as "High Risk" are automatically locked and routed to the Facility Manager for sign-off.

---

## 🔒 Security Model

* **Organization-Wide Defaults (OWD):** set to **Private** for Contacts and related objects to ensure data isolation.
* **Sharing Sets:** Configured to grant Experience Cloud users read access strictly to records associated with their own `ContactId`.
* **Field-Level Security (FLS):** Finely tuned profiles ("Patient Customer", "Health Worker") to ensure users only see relevant data fields.

---

## 🚀 Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/SibenduD/Pulse-Point-Healthcare-Platform.git](https://github.com/SibenduD/Pulse-Point-Healthcare-Platform.git)
    ```

2.  **Verify Project Structure:**
    Ensure your local project follows the standard Salesforce DX structure:
    ```text
    Pulse-Point-Healthcare-Platform/
    ├── sfdx-project.json
    ├── manifest/
    └── force-app/
        └── main/
            └── default/
                ├── aura/
                ├── classes/
                ├── lwc/
                ├── objects/
                ├── pages/
                ├── staticresources/
                └── triggers/
    ```

3.  **Deploy to a Scratch Org or Developer Edition:**
    Run this command from the root of the project folder:
    ```bash
    sf project deploy start --target-org my-org-alias
    ```

4.  **Post-Deployment Setup:**
    * Assign the **"Patient Customer"** profile to a test user.
    * Ensure the **Pulse Point** Experience Site is published.
    * Verify **Sharing Sets** are active for the portal profile.
      
---

## 👤 Author

**Sibendu Das**
* [LinkedIn](https://www.linkedin.com/in/das-sibendu/)
* [GitHub Profile](https://github.com/SibenduD)

---
*Built as a Capstone Project demonstrating full-stack Salesforce Development capabilities.*
