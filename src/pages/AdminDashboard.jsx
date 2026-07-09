import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { convertGoogleDriveUrl } from "../utils/facultyUtils";

const AdminDashboard = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("faculty"); // faculty | security
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [hodFilter, setHodFilter] = useState("");
  const [isCustomDept, setIsCustomDept] = useState(false);
  
  // Modals state
  const [showModal, setShowModal] = useState(false); // Add/Edit modal
  const [modalMode, setModalMode] = useState("add"); // add | edit
  const [selectedId, setSelectedId] = useState(null);
  
  // Faculty Form fields
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    designation: "",
    type: "Regular Faculty",
    hod: "no",
    phone: "",
    email: "",
    dateOfJoining: "",
    qualification: "",
    specialization: "",
    experience: "",
    subjects: "",
    awards: "",
    researchGuidance: "",
    administrativeResponsibility: "",
    professionalBodies: "",
    researchPublications: "",
    vidwanLink: "",
    researchProjects: "",
    seminarsOrganized: "",
    address: "",
    image: ""
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");

  // Security settings state
  const [securityData, setSecurityData] = useState({
    mfaEnabled: false,
    qrCodeUrl: "",
    tempSecret: "",
    verificationCode: "",
    currentPassword: "",
    newUsername: "",
    newPassword: "",
    newPasswordConfirm: ""
  });
  const [securitySuccess, setSecuritySuccess] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [showMfaEnrollModal, setShowMfaEnrollModal] = useState(false);

  const navigate = useNavigate();

  // Load faculty & MFA settings
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    
    fetchData();
    fetchMfaSettings();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getFaculty();
      setFaculty(data);
    } catch (err) {
      console.error(err);
      // If token expired, log out
      if (err.message.includes("403") || err.message.includes("token")) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMfaSettings = async () => {
    try {
      const data = await api.getMfaSettings();
      setSecurityData(prev => ({
        ...prev,
        mfaEnabled: data.mfaEnabled,
        qrCodeUrl: data.qrCodeUrl || "",
        tempSecret: data.tempSecret || ""
      }));
    } catch (err) {
      console.error("Error loading MFA settings:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  // ----------------------------------------------------
  // FACULTY CRUD HANDLERS
  // ----------------------------------------------------
  
  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      name: "",
      department: "",
      designation: "",
      type: "Regular Faculty",
      hod: "no",
      phone: "",
      email: "",
      dateOfJoining: "",
      qualification: "",
      specialization: "",
      experience: "",
      subjects: "",
      awards: "",
      researchGuidance: "",
      administrativeResponsibility: "",
      professionalBodies: "",
      researchPublications: "",
      vidwanLink: "",
      researchProjects: "",
      seminarsOrganized: "",
      address: "",
      image: ""
    });
    setIsCustomDept(false);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setModalMode("edit");
    setSelectedId(member.id);
    setFormData({ ...member });
    setIsCustomDept(member.department && !depts.includes(member.department));
    setFormError("");
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError("");
    try {
      const data = await api.uploadImage(file);
      // Store dynamic relative path (e.g. /uploads/filename.jpg)
      setFormData(prev => ({ ...prev, image: data.imageUrl }));
    } catch (err) {
      setFormError(err.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveFaculty = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name) {
      setFormError("Faculty name is required.");
      return;
    }

    try {
      if (modalMode === "add") {
        await api.addFaculty(formData);
      } else {
        await api.updateFaculty(selectedId, formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || "Failed to save record.");
    }
  };

  const handleDeleteFaculty = async (id, name, type) => {
    if (type === "Regular Faculty" || type === "Regular") {
      alert("Regular Faculty members cannot be deleted from the UI.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await api.deleteFaculty(id);
        fetchData();
      } catch (err) {
        alert(err.message || "Failed to delete faculty member.");
      }
    }
  };

  // ----------------------------------------------------
  // SECURITY HANDLERS
  // ----------------------------------------------------

  const handleToggleMfa = async () => {
    setSecurityError("");
    setSecuritySuccess("");

    if (!securityData.mfaEnabled) {
      // Prompt user to enroll
      setShowMfaEnrollModal(true);
    } else {
      // Disable MFA directly
      if (window.confirm("Are you sure you want to disable Authenticator MFA? Your account will be less secure.")) {
        try {
          await api.toggleMfa(false);
          setSecuritySuccess("Multi-Factor Authentication disabled successfully.");
          fetchMfaSettings();
        } catch (err) {
          setSecurityError(err.message || "Failed to disable MFA.");
        }
      }
    }
  };

  const handleConfirmMfaEnrollment = async () => {
    setSecurityError("");
    setSecuritySuccess("");
    if (!securityData.verificationCode) {
      alert("Please enter the 6-digit verification code.");
      return;
    }

    try {
      await api.toggleMfa(true, securityData.verificationCode, securityData.tempSecret);
      setSecuritySuccess("Google Authenticator MFA enabled successfully!");
      setShowMfaEnrollModal(false);
      setSecurityData(prev => ({ ...prev, verificationCode: "" }));
      fetchMfaSettings();
    } catch (err) {
      setSecurityError(err.message || "Invalid OTP code. Enrollment failed.");
    }
  };

  const handleResetMfa = async () => {
    if (window.confirm("This will reset your authenticator app secret. Your current Authenticator setup will stop working. Proceed?")) {
      try {
        // Disabling first clears secret
        await api.toggleMfa(false);
        // Then pull new proposed secrets
        const data = await api.getMfaSettings();
        setSecurityData(prev => ({
          ...prev,
          mfaEnabled: false,
          qrCodeUrl: data.qrCodeUrl || "",
          tempSecret: data.tempSecret || ""
        }));
        setShowMfaEnrollModal(true);
      } catch (err) {
        setSecurityError(err.message || "Failed to reset MFA device.");
      }
    }
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    setSecurityError("");
    setSecuritySuccess("");

    if (!securityData.currentPassword) {
      setSecurityError("Current password is required.");
      return;
    }

    if (securityData.newPassword && securityData.newPassword !== securityData.newPasswordConfirm) {
      setSecurityError("New passwords do not match.");
      return;
    }

    try {
      await api.updateCredentials(
        securityData.currentPassword,
        securityData.newUsername || null,
        securityData.newPassword || null
      );
      setSecuritySuccess("Admin credentials updated successfully.");
      setSecurityData(prev => ({
        ...prev,
        currentPassword: "",
        newUsername: "",
        newPassword: "",
        newPasswordConfirm: ""
      }));
    } catch (err) {
      setSecurityError(err.message || "Failed to update login credentials.");
    }
  };

  // Metrics
  const totalFaculty = faculty.length;
  const regularCount = faculty.filter(f => f.type?.toLowerCase().includes("regular")).length;
  const guestCount = faculty.filter(f => f.type?.toLowerCase().includes("guest")).length;
  const depts = [...new Set(faculty.map(f => f.department))].filter(Boolean);

  // Filters
  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = (f.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (f.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !deptFilter || f.department === deptFilter;
    const matchesType = !typeFilter || f.type === typeFilter;
    const matchesHod = !hodFilter || (hodFilter === "yes" && f.hod === "yes") || (hodFilter === "no" && f.hod !== "yes");
    return matchesSearch && matchesDept && matchesType && matchesHod;
  });

  return (
    <div className="dashboard-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        
        .dashboard-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #fffdf9;
          display: flex;
        }

        /* Sidebar styling */
        .sidebar {
          width: 260px;
          background: #8b0000;
          color: white;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 15px rgba(139,0,0,0.1);
          position: fixed;
          height: 100vh;
          z-index: 100;
        }

        .sidebar-logo {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sidebar-logo-icon {
          background: #eab308;
          color: #8b0000;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .nav-item.active {
          background: #ffffff;
          color: #8b0000;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(139, 0, 0, 0.15);
          border-left: 4px solid #eab308;
        }

        .sidebar-footer {
          margin-top: auto;
        }

        .btn-logout {
          width: 100%;
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          background: transparent;
          color: white;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-logout:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          color: #ffcccc;
        }

        /* Content window */
        .main-content {
          margin-left: 260px;
          flex: 1;
          padding: 40px;
          min-width: 0;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #8b0000;
          margin: 0;
        }

        /* Metric Cards */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .metric-card {
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(139, 0, 0, 0.03);
          border: 1px solid rgba(139, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s;
        }
        .metric-card:nth-child(1) { border-left: 4px solid #8b0000; }
        .metric-card:nth-child(2) { border-left: 4px solid #d97706; }
        .metric-card:nth-child(3) { border-left: 4px solid #eab308; }
        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(139, 0, 0, 0.08);
        }

        .metric-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: rgba(139, 0, 0, 0.08);
          color: #8b0000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .metric-icon.red {
          background: rgba(234, 179, 8, 0.08);
          color: #d97706;
        }

        .metric-icon.blue {
          background: rgba(254, 240, 138, 0.4);
          color: #b45309;
        }

        .metric-info h3 {
          margin: 0;
          font-size: 13px;
          color: #7a6e67;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-info p {
          margin: 4px 0 0;
          font-size: 28px;
          font-weight: 700;
          color: #1a2f26;
        }

        /* Filter bar & table */
        .table-controls {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 250px;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(139, 0, 0, 0.15);
          outline: none;
          font-size: 14px;
          background: white;
        }

        .search-input:focus {
          border-color: #8b0000;
          box-shadow: 0 0 0 4px rgba(139, 0, 0, 0.08);
        }

        .filter-select {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(139, 0, 0, 0.15);
          outline: none;
          font-size: 14px;
          background: white;
          color: #2b1f1a;
          cursor: pointer;
        }

        .btn-add {
          background: linear-gradient(135deg, #8b0000, #b30000);
          color: white;
          border: 1px solid rgba(234, 179, 8, 0.2);
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 10px rgba(139,0,0,0.15);
          transition: all 0.2s;
        }

        .btn-add:hover {
          background: linear-gradient(135deg, #b30000, #eab308);
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(234, 179, 8, 0.2);
        }

        .table-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(139, 0, 0, 0.04);
          border: 1px solid rgba(139, 0, 0, 0.08);
          overflow: hidden;
        }

        .faculty-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .faculty-table th {
          background: linear-gradient(90deg, #fffcf6, #ffffff);
          padding: 18px 24px;
          font-size: 11px;
          font-weight: 700;
          color: #8b0000;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border-bottom: 2px solid rgba(139, 0, 0, 0.12);
        }

        .faculty-table td {
          padding: 16px 24px;
          border-bottom: 1px solid rgba(139, 0, 0, 0.05);
          font-size: 14px;
          color: #2b1f1a;
          transition: all 0.2s ease;
        }

        .faculty-table td:first-child {
          border-left: 4px solid transparent;
        }

        .faculty-table tr {
          transition: all 0.2s ease;
        }

        .faculty-table tr:hover td {
          background: #fffbeb;
        }

        .faculty-table tr:hover td:first-child {
          border-left: 4px solid #eab308;
        }

        .fac-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          background: #fff;
          border: 2px solid white;
          box-shadow: 0 0 0 2px #eab308, 0 4px 10px rgba(139,0,0,0.1);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .faculty-table tr:hover .fac-avatar {
          transform: scale(1.1);
          box-shadow: 0 0 0 2px #8b0000, 0 6px 12px rgba(139,0,0,0.18);
        }

        .fac-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .fac-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        .fac-badge.regular {
          background: rgba(139, 0, 0, 0.06);
          color: #8b0000;
          border: 1px solid rgba(139, 0, 0, 0.12);
        }

        .fac-badge.regular::before {
          background: #8b0000;
          animation: pulse-dot-red 2s infinite ease-in-out;
        }

        .fac-badge.guest {
          background: rgba(234, 179, 8, 0.06);
          color: #d97706;
          border: 1px solid rgba(234, 179, 8, 0.15);
        }

        .fac-badge.guest::before {
          background: #d97706;
          animation: pulse-dot-gold 2s infinite ease-in-out;
        }

        @keyframes pulse-dot-red {
          0%, 100% { opacity: 0.6; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        @keyframes pulse-dot-gold {
          0%, 100% { opacity: 0.6; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        .actions-group {
          display: flex;
          gap: 10px;
        }

        .btn-action {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(139,0,0,0.15);
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .btn-action:hover:not(:disabled) {
          transform: scale(1.1) translateY(-1px);
          box-shadow: 0 4px 10px rgba(139,0,0,0.12);
        }

        .btn-action:active:not(:disabled) {
          transform: scale(0.95);
        }

        .btn-action:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-action:disabled:hover {
          background: transparent !important;
          color: inherit !important;
          border-color: rgba(139,0,0,0.15) !important;
          transform: none !important;
        }

        .btn-action.edit:hover {
          background: rgba(234, 179, 8, 0.1);
          color: #d97706;
          border-color: #d97706;
        }

        .btn-action.delete:hover {
          background: rgba(139, 0, 0, 0.15);
          color: #8b0000;
          border-color: #8b0000;
        }

        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(139, 0, 0, 0.25);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-card {
          background: white;
          border-radius: 24px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(139,0,0,0.15);
          animation: modalAppear 0.3s ease-out;
        }

        @keyframes modalAppear {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-header {
          padding: 24px 30px;
          border-bottom: 1px solid rgba(139, 0, 0, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #8b0000;
          margin: 0;
        }

        .btn-close {
          background: transparent;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #8b0000;
        }

        .modal-body {
          padding: 30px;
        }

        /* Form grids */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #0f4c35;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(15, 76, 53, 0.15);
          font-size: 14px;
          outline: none;
          background: #fdfdfd;
        }

        .form-input:focus {
          border-color: #0f4c35;
          box-shadow: 0 0 0 3px rgba(15, 76, 53, 0.06);
        }

        .span-2 {
          grid-column: span 2;
        }

        @media (max-width: 600px) {
          .span-2 {
            grid-column: span 1;
          }
        }

        /* Custom image uploader */
        .image-uploader {
          border: 2px dashed rgba(15, 76, 53, 0.2);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          background: #fcfdfe;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .image-uploader:hover {
          border-color: #0f4c35;
          background: rgba(45, 184, 126, 0.02);
        }

        .upload-preview {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
          border: 1px solid rgba(15,76,53,0.1);
        }

        .modal-footer {
          padding: 20px 30px;
          border-top: 1px solid rgba(15, 76, 53, 0.08);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-cancel {
          background: #f1f5f3;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          color: #4c665a;
        }

        .btn-save {
          background: #0f4c35;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Security section styling */
        .settings-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(15, 76, 53, 0.03);
          border: 1px solid rgba(15, 76, 53, 0.05);
          margin-bottom: 30px;
        }

        .settings-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f4c35;
          margin: 0 0 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .toggle-container {
          display: flex;
          justify-content: justify;
          align-items: center;
          padding: 20px;
          background: #f8faf9;
          border-radius: 14px;
          border: 1px solid rgba(139,0,0,0.05);
        }

        .toggle-info {
          flex: 1;
        }

        .toggle-info h4 {
          margin: 0 0 4px;
          font-size: 15px;
          color: #8b0000;
          font-weight: 600;
        }

        .toggle-info p {
          margin: 0;
          font-size: 13px;
          color: #7a6e67;
        }

        /* Switch Toggle UI */
        .switch {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 28px;
        }

        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: #cbd5e1;
          transition: .3s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #8b0000;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }

        /* Security Forms */
        .success-banner {
          background: rgba(234, 179, 8, 0.1);
          color: #b45309;
          border: 1px solid rgba(234, 179, 8, 0.2);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .error-banner-sec {
          background: rgba(126, 0, 0, 0.08);
          color: #7e0000;
          border: 1px solid rgba(126, 0, 0, 0.2);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .qr-setup-box {
          display: flex;
          gap: 30px;
          align-items: center;
          background: #f8faf9;
          padding: 24px;
          border-radius: 16px;
          margin-top: 20px;
          border: 1px solid rgba(15,76,53,0.08);
        }

        @media (max-width: 600px) {
          .qr-setup-box {
            flex-direction: column;
            text-align: center;
          }
        }

        .qr-img {
          width: 160px;
          height: 160px;
          background: white;
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 12px;
        }

        .qr-instructions ol {
          margin: 0;
          padding-left: 20px;
          color: #4c665a;
          font-size: 14px;
          line-height: 1.5;
        }

        .qr-instructions li {
          margin-bottom: 8px;
        }

        .mfa-verify-input-group {
          display: flex;
          gap: 12px;
          margin-top: 15px;
        }

        .security-btn-reset {
          background: transparent;
          border: 1px solid #7e0000;
          color: #7e0000;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          margin-top: 12px;
          transition: all 0.2s;
        }

        .security-btn-reset:hover {
          background: rgba(126, 0, 0, 0.05);
        }
      `}</style>

      {/* Sidebar Panel */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">G</div>
          <span>GCEK Admin</span>
        </div>
        
        <ul className="nav-list">
          <li 
            className={`nav-item ${activeTab === "faculty" ? "active" : ""}`}
            onClick={() => setActiveTab("faculty")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Faculty List</span>
          </li>
          <li 
            className={`nav-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Security Settings</span>
          </li>
        </ul>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="main-content">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
            <span style={{ fontSize: "16px", color: "#667e73" }}>Loading control dashboard data...</span>
          </div>
        ) : activeTab === "faculty" ? (
          /* FACULTY TAB */
          <div>
            <div className="header-section">
              <h1 className="page-title">Faculty Database</h1>
              <button className="btn-add" onClick={openAddModal}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add Faculty Member</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="metric-info">
                  <h3>Total Faculty</h3>
                  <p>{totalFaculty}</p>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="metric-info">
                  <h3>Regular</h3>
                  <p>{regularCount}</p>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon red">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <div className="metric-info">
                  <h3>Guest/Contract</h3>
                  <p>{guestCount}</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="table-controls">
              <input
                type="text"
                placeholder="Search faculty by name or email..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="filter-select"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {depts.map((d, idx) => (
                  <option key={idx} value={d}>{d}</option>
                ))}
              </select>

              <select
                className="filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Regular Faculty">Regular Faculty</option>
                <option value="Guest Faculty">Guest Faculty</option>
              </select>

              <select
                className="filter-select"
                value={hodFilter}
                onChange={(e) => setHodFilter(e.target.value)}
              >
                <option value="">All HOD Status</option>
                <option value="yes">HOD Only</option>
                <option value="no">Non-HOD Only</option>
              </select>
            </div>

            {/* Interactive Data Table */}
            <div className="table-card">
              <table className="faculty-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Type</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <img 
                          src={convertGoogleDriveUrl(member.image)}
                          alt={member.name} 
                          className="fac-avatar" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/avatar-placeholder.png';
                          }}
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{member.name}</td>
                      <td>{member.department}</td>
                      <td>{member.designation}</td>
                      <td>
                        <span className={`fac-badge ${member.type?.toLowerCase().includes('regular') ? 'regular' : 'guest'}`}>
                          {member.type || 'Regular'}
                        </span>
                      </td>
                      <td>{member.email || 'N/A'}</td>
                      <td>
                        <div className="actions-group">
                          <button 
                            className="btn-action edit" 
                            title="Edit"
                            onClick={() => openEditModal(member)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                          </button>
                          <button 
                            className="btn-action delete" 
                            title={member.type === "Regular Faculty" || member.type === "Regular" ? "Regular faculty cannot be deleted" : "Delete"}
                            disabled={member.type === "Regular Faculty" || member.type === "Regular"}
                            onClick={() => handleDeleteFaculty(member.id, member.name, member.type)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredFaculty.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", color: "#667e73", padding: "40px" }}>
                        No faculty records match your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* SECURITY SETTINGS TAB */
          <div>
            <div className="header-section">
              <h1 className="page-title">Security & Credentials</h1>
            </div>

            {securitySuccess && <div className="success-banner">{securitySuccess}</div>}
            {securityError && <div className="error-banner-sec">{securityError}</div>}

            {/* MFA Panel */}
            <div className="settings-card">
              <h2 className="settings-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Two-Factor Authentication (2FA)</span>
              </h2>

              <div className="toggle-container">
                <div className="toggle-info">
                  <h4>Google Authenticator (TOTP)</h4>
                  <p>Require a 6-digit dynamic authentication code from your mobile device upon signing in.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={securityData.mfaEnabled}
                    onChange={handleToggleMfa}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {securityData.mfaEnabled && (
                <div>
                  <button className="security-btn-reset" onClick={handleResetMfa}>
                    Reset Authenticator App Device
                  </button>
                </div>
              )}
            </div>

            {/* Update Password Panel */}
            <div className="settings-card">
              <h2 className="settings-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Update Credentials</span>
              </h2>

              <form onSubmit={handleUpdateCredentials}>
                <div className="form-grid" style={{ maxWidth: "600px" }}>
                  <div className="span-2">
                    <label className="form-label">New Username (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Leave blank to keep current"
                      value={securityData.newUsername}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, newUsername: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">New Password (Optional)</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Leave blank to keep current"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Repeat new password"
                      value={securityData.newPasswordConfirm}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, newPasswordConfirm: e.target.value }))}
                    />
                  </div>

                  <div className="span-2" style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "15px", marginTop: "10px" }}>
                    <label className="form-label" style={{ color: "#7e0000" }}>Current Password (Required for validation)</label>
                    <input
                      type="password"
                      required
                      className="form-input"
                      style={{ borderColor: "rgba(126,0,0,0.2)" }}
                      placeholder="Verify with your current password"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-add">
                  Save Credentials
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* CRUD MODAL FOR ADD/EDIT */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2 className="modal-title">{modalMode === "add" ? "Add New Faculty Profile" : "Edit Faculty Profile"}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveFaculty}>
              <div className="modal-body">
                {formError && <div className="error-banner-sec" style={{ padding: "10px 16px", marginBottom: "15px" }}>{formError}</div>}
                
                <div className="form-grid">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">Department *</label>
                    <select
                      required
                      className="form-input"
                      value={formData.department === "" || depts.includes(formData.department) ? formData.department : "NEW_DEPT"}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "NEW_DEPT") {
                          setIsCustomDept(true);
                          setFormData(prev => ({ ...prev, department: "" }));
                        } else {
                          setIsCustomDept(false);
                          setFormData(prev => ({ ...prev, department: val }));
                        }
                      }}
                    >
                      <option value="">Select Department</option>
                      {depts.map((d, idx) => (
                        <option key={idx} value={d}>{d}</option>
                      ))}
                      <option value="NEW_DEPT">+ Add New Department...</option>
                    </select>

                    {isCustomDept && (
                      <div style={{ marginTop: "10px" }}>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="Enter new department name"
                          value={formData.department}
                          onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Assistant Professor"
                      value={formData.designation}
                      onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">Faculty Type</label>
                    <select
                      className="form-input"
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="Regular Faculty">Regular Faculty</option>
                      <option value="Guest Faculty">Guest Faculty</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Is Head of Department (HOD)?</label>
                    <select
                      className="form-input"
                      value={formData.hod}
                      onChange={(e) => setFormData(prev => ({ ...prev, hod: e.target.value }))}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">Date of Joining</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.dateOfJoining}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfJoining: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">Qualification</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ph.D, M.Tech"
                      value={formData.qualification}
                      onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">Specialization</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.specialization}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">Experience</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 10 years"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">Vidwan Profile Link</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://vidwan.inflibnet.ac.in/..."
                      value={formData.vidwanLink}
                      onChange={(e) => setFormData(prev => ({ ...prev, vidwanLink: e.target.value }))}
                    />
                  </div>

                  <div className="span-2">
                    <label className="form-label">Upload Profile Photo</label>
                    <div className="image-uploader" onClick={() => document.getElementById('photo-input').click()}>
                      <input 
                        type="file" 
                        id="photo-input" 
                        accept="image/*" 
                        style={{ display: "none" }} 
                        onChange={handleImageUpload}
                      />
                      {formData.image ? (
                        <img 
                          src={convertGoogleDriveUrl(formData.image)} 
                          alt="Preview" 
                          className="upload-preview" 
                        />
                      ) : (
                        <div style={{ color: "#667e73", fontSize: "28px" }}>📷</div>
                      )}
                      <span style={{ fontSize: "13px", color: "#667e73" }}>
                        {uploadingImage ? "Uploading file..." : (formData.image ? "Change selected image" : "Click to select or drop an image")}
                      </span>
                    </div>
                  </div>

                  <div className="span-2">
                    <label className="form-label">Subjects Taught</label>
                    <textarea
                      rows="2"
                      className="form-input"
                      placeholder="Subjects separated by commas"
                      value={formData.subjects}
                      onChange={(e) => setFormData(prev => ({ ...prev, subjects: e.target.value }))}
                    />
                  </div>

                  <div className="span-2">
                    <label className="form-label">Research Guidance</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 2 Ph.D Scholars ongoing"
                      value={formData.researchGuidance}
                      onChange={(e) => setFormData(prev => ({ ...prev, researchGuidance: e.target.value }))}
                    />
                  </div>

                  <div className="span-2">
                    <label className="form-label">Administrative Responsibilities</label>
                    <textarea
                      rows="2"
                      className="form-input"
                      value={formData.administrativeResponsibility}
                      onChange={(e) => setFormData(prev => ({ ...prev, administrativeResponsibility: e.target.value }))}
                    />
                  </div>

                  <div className="span-2">
                    <label className="form-label">Professional Bodies Membership</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.professionalBodies}
                      onChange={(e) => setFormData(prev => ({ ...prev, professionalBodies: e.target.value }))}
                    />
                  </div>

                  <div className="span-2">
                    <label className="form-label">Research Publications</label>
                    <textarea
                      rows="2"
                      className="form-input"
                      value={formData.researchPublications}
                      onChange={(e) => setFormData(prev => ({ ...prev, researchPublications: e.target.value }))}
                    />
                  </div>

                  <div className="span-2">
                    <label className="form-label">Research Projects</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.researchProjects}
                      onChange={(e) => setFormData(prev => ({ ...prev, researchProjects: e.target.value }))}
                    />
                  </div>

                  <div className="span-2">
                    <label className="form-label">Seminars / Workshops Organized</label>
                    <textarea
                      rows="2"
                      className="form-input"
                      value={formData.seminarsOrganized}
                      onChange={(e) => setFormData(prev => ({ ...prev, seminarsOrganized: e.target.value }))}
                    />
                  </div>

                  <div className="span-2">
                    <label className="form-label">Awards & Recognitions</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.awards}
                      onChange={(e) => setFormData(prev => ({ ...prev, awards: e.target.value }))}
                    />
                  </div>

                  <div className="span-2">
                    <label className="form-label">Address</label>
                    <textarea
                      rows="2"
                      className="form-input"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={uploadingImage}>
                  {modalMode === "add" ? "Create Profile" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MFA ENROLLMENT SETUP MODAL */}
      {showMfaEnrollModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: "550px" }}>
            <div className="modal-header">
              <h2 className="modal-title">Enable Authenticator App MFA</h2>
              <button className="btn-close" onClick={() => setShowMfaEnrollModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="qr-setup-box" style={{ flexDirection: "column", padding: "10px" }}>
                {securityData.qrCodeUrl ? (
                  <img src={securityData.qrCodeUrl} alt="MFA QR Code" className="qr-img" />
                ) : (
                  <div style={{ height: "160px", display: "flex", alignItems: "center" }}>Generating QR Code...</div>
                )}
                
                <div className="qr-instructions" style={{ marginTop: "15px" }}>
                  <ol>
                    <li>Open <strong>Google Authenticator</strong> (or Microsoft Authenticator) on your smartphone.</li>
                    <li>Choose to <strong>Scan a QR Code</strong> and scan the image above.</li>
                    <li>If you cannot scan, manually enter this code: <code style={{ background: "#eee", padding: "2px 6px", borderRadius: "4px", fontSize: "13px" }}>{securityData.tempSecret}</code></li>
                    <li>Enter the 6-digit code displayed in the app below to confirm connection:</li>
                  </ol>
                </div>

                <div className="mfa-verify-input-group" style={{ width: "100%", justifyContent: "center" }}>
                  <input
                    type="text"
                    maxLength="6"
                    className="form-input"
                    style={{ maxWidth: "200px", textAlign: "center", fontSize: "16px", letterSpacing: "4px" }}
                    placeholder="000000"
                    value={securityData.verificationCode}
                    onChange={(e) => setSecurityData(prev => ({ ...prev, verificationCode: e.target.value.replace(/\D/g, "") }))}
                  />
                  <button className="btn-add" onClick={handleConfirmMfaEnrollment}>
                    Verify & Turn On
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
