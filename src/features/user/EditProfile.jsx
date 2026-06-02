import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Spinner from "../../ui/Spinner";

function EditProfile() {
  const { user, updateUser, changePassword } = useAuth();
  const navigate = useNavigate();

  // Profile section state
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    phone: user?.phone || "",
    country: user?.country || "",
    city: user?.city || "",
    address: user?.address || "",
    postalCode: user?.postalCode || "",
  });

  // Password section state
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [isPwLoading, setIsPwLoading] = useState(false);

  const [pwData, setPwData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePwChange(e) {
    setPwData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);

    if (!formData.fullname.trim()) return setProfileError("Full Name is required");

    try {
      setIsProfileLoading(true);
      await updateUser(formData);
      setProfileSuccess(true);
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      setProfileError(err.message || "Failed to update profile");
    } finally {
      setIsProfileLoading(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);

    if (!pwData.currentPassword) return setPwError("Current password is required");
    if (pwData.newPassword.length < 6) return setPwError("New password must be at least 6 characters");
    if (pwData.newPassword !== pwData.confirmPassword) return setPwError("Passwords do not match");

    try {
      setIsPwLoading(true);
      await changePassword(pwData.currentPassword, pwData.newPassword);
      setPwSuccess(true);
      setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err.message || "Failed to change password");
    } finally {
      setIsPwLoading(false);
    }
  }

  const Card = ({ children, title, subtitle }) => (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 sm:py-14 space-y-6 animate-fade-in-up">
      {/* PAGE HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">Edit Profile</h1>
        <p className="text-muted text-sm">Update your personal information and security settings.</p>
      </div>

      {/* PERSONAL INFO CARD */}
      <Card title="Personal Information" subtitle="Changes will be reflected across your account.">
        <form className="space-y-4" onSubmit={handleProfileSubmit}>
          {profileError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-100 flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 shrink-0" />
              Profile updated successfully! Redirecting…
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Gelana Techan" variant="form" size="md" />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+251 9XXXXXXXX" variant="form" size="md" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="Ethiopia" variant="form" size="md" />
            <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Addis Ababa" variant="form" size="md" />
          </div>
          <Input label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Red Avenue Street" variant="form" size="md" />
          <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="et-123245" variant="form" size="md" />

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="primary" size="md" type="submit" disabled={isProfileLoading} className="flex items-center justify-center gap-2">
              {isProfileLoading && <Spinner size="sm" />}
              {isProfileLoading ? "Saving…" : "Save Changes"}
            </Button>
            <Button variant="outline" size="md" type="button" onClick={() => navigate("/profile")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      {/* CHANGE PASSWORD CARD */}
      <Card title="Change Password" subtitle="Choose a strong password you haven't used before.">
        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
          {pwError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-100 flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 shrink-0" />
              Password changed successfully!
            </div>
          )}

          <Input label="Current Password" name="currentPassword" type="password" value={pwData.currentPassword} onChange={handlePwChange} placeholder="Your current password" variant="form" size="md" />
          <Input label="New Password" name="newPassword" type="password" value={pwData.newPassword} onChange={handlePwChange} placeholder="At least 6 characters" variant="form" size="md" />
          <Input label="Confirm New Password" name="confirmPassword" type="password" value={pwData.confirmPassword} onChange={handlePwChange} placeholder="Repeat new password" variant="form" size="md" />

          <Button variant="primary" size="md" type="submit" disabled={isPwLoading} className="flex items-center justify-center gap-2">
            {isPwLoading && <Spinner size="sm" />}
            {isPwLoading ? "Updating…" : "Update Password"}
          </Button>
        </form>
      </Card>
    </section>
  );
}

export default EditProfile;
