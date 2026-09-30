"use client";

import { ModeToggle } from "@/components/toggle";
import { useSidebar } from "@/context/sidebar-context";
import { useCurrency } from "@/context/currency-context";
import {
  Menu,
  Pencil,
  Check,
  X,
  Eye,
  EyeOff,
  Camera,
  KeyRound,
  User,
  Mail,
  Lock,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { toggleSidebar } = useSidebar();
  const { setCurrency } = useCurrency();

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingName, setIsSavingName] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar_url: "",
  });

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Password visibility toggles
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  //image handling
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password fields
  const [passwords, setPasswords] = useState({
    current: "",
    new_password: "",
    confirm: "",
  });

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          method: "GET",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data.user);
      setEditedName(data.user.name);
      setCurrency(data.user.currency || "NGN");
    } catch (error) {
      console.error(error);
      toast.add({
        title:
          error instanceof Error ? error.message : "Failed to load profile",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (isEditingName) nameInputRef.current?.focus();
  }, [isEditingName]);

  const handleStartEditing = () => {
    setEditedName(profile.name);
    setIsEditingName(true);
  };

  const handleCancelEditing = () => {
    setEditedName(profile.name);
    setIsEditingName(false);
  };

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleSaveName = async () => {
    const name = editedName.trim();

    if (!name) {
      toast.add({ title: "Name is required", type: "warning" });
      return;
    }

    setIsSavingName(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update name");
      }

      setProfile(data.user);
      setEditedName(data.user.name);
      setIsEditingName(false);
      toast.add({ title: "Name updated successfully", type: "success" });
    } catch (error) {
      console.error(error);
      toast.add({
        title: error instanceof Error ? error.message : "Failed to update name",
        type: "error",
      });
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSavePassword = async () => {
    setPasswordError("");

    if (!passwords.current || !passwords.new_password || !passwords.confirm) {
      const msg = "Please fill in all password fields.";
      setPasswordError(msg);
      toast.add({ title: msg, type: "warning" });
      return;
    }

    if (passwords.new_password !== passwords.confirm) {
      const msg = "Passwords do not match.";
      setPasswordError(msg);
      toast.add({ title: msg, type: "warning" });
      return;
    }

    setIsSavingPassword(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/password`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: passwords.current,
            new_password: passwords.new_password,
            confirm_password: passwords.confirm,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setPasswords({
        current: "",
        new_password: "",
        confirm: "",
      });

      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      setIsEditingPassword(false);
      toast.add({ title: "Password changed successfully", type: "success" });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to change password";
      setPasswordError(msg);
      toast.add({ title: msg, type: "error" });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatarError("");

    if (!file.type.startsWith("image/")) {
      const msg = "Please select an image file.";
      setAvatarError(msg);
      toast.add({ title: msg, type: "warning" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const msg = "Image must be smaller than 5MB.";
      setAvatarError(msg);
      toast.add({ title: msg, type: "warning" });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("avatar", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/avatar`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload profile picture");
      }

      setProfile((previous) => ({
        ...previous,
        avatar_url: data.avatar_url,
      }));
      toast.add({
        title: "Profile picture updated successfully",
        type: "success",
      });
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to upload profile picture";
      setAvatarError(msg);
      toast.add({ title: msg, type: "error" });
    } finally {
      setIsUploadingAvatar(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-background w-full h-full p-4 md:p-6 overflow-y-auto scroll-smooth">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="cursor-pointer rounded-md p-2 hover:bg-muted"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <h1 className="text-base font-bold sm:text-xl">Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>

      {/* Full-width two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {isLoading ? (
          <>
            {/* Skeletons for LEFT COLUMN */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <Skeleton className="h-10 w-36 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Skeletons for RIGHT COLUMN */}
            <div className="lg:col-span-1 flex flex-col gap-5">
              <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-6 flex flex-col items-center text-center">
                <Skeleton className="h-28 w-28 rounded-full mb-4" />
                <Skeleton className="h-5 w-32 mb-1.5" />
                <Skeleton className="h-4 w-40" />

                <div className="w-full border-t border-border mt-5 pt-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                    <div className="flex flex-col gap-1 w-full">
                      <Skeleton className="h-2 w-16" />
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                    <div className="flex flex-col gap-1 w-full">
                      <Skeleton className="h-2 w-12" />
                      <Skeleton className="h-4 w-full max-w-[150px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ── LEFT COLUMN: Edit forms ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Update name card */}
              <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">
                      Personal Information
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Update your display name
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Full Name
                    </label>
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          ref={nameInputRef}
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="flex-1 text-sm border border-border rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-background outline-none  transition"
                        />
                        <button
                          type="button"
                          onClick={handleSaveName}
                          disabled={isSavingName}
                          className="h-9 w-9 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          aria-label="Save name"
                        >
                          <Check className="h-4 w-4 text-white" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEditing}
                          className="h-9 w-9 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          aria-label="Cancel editing"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <div className="flex-1 text-sm border border-border rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-background text-foreground">
                          {profile.name || (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleStartEditing}
                          className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer shrink-0"
                          aria-label="Edit name"
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Email field (read-only) */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                      Email address
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-muted font-medium">
                        read-only
                      </span>
                    </label>
                    <div className="flex items-center gap-2 text-sm border border-border rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-background text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{profile.email || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change password card */}
              <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                    <KeyRound className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">Change Password</h2>
                    <p className="text-xs text-muted-foreground">
                      Update your account password
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {!isEditingPassword ? (
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-muted-foreground flex-1">
                        Your password is securely stored. Click below if you
                        need to update it.
                      </p>
                      <Button
                        variant="outline"
                        className="cursor-pointer gap-2"
                        onClick={() => setIsEditingPassword(true)}
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        Change Password
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Current password — full width */}
                      <PasswordField
                        id="current-password"
                        label="Current Password"
                        placeholder="Enter your current password"
                        value={passwords.current}
                        show={showCurrent}
                        onToggleShow={() => setShowCurrent((v) => !v)}
                        onChange={(v) =>
                          setPasswords((p) => ({ ...p, current: v }))
                        }
                      />

                      {/* New + Confirm side by side */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PasswordField
                          id="new-password"
                          label="New Password"
                          placeholder="Enter new password"
                          value={passwords.new_password}
                          show={showNew}
                          onToggleShow={() => setShowNew((v) => !v)}
                          onChange={(v) =>
                            setPasswords((p) => ({ ...p, new_password: v }))
                          }
                        />
                        <PasswordField
                          id="confirm-password"
                          label="Confirm New Password"
                          placeholder="Confirm new password"
                          value={passwords.confirm}
                          show={showConfirm}
                          onToggleShow={() => setShowConfirm((v) => !v)}
                          onChange={(v) =>
                            setPasswords((p) => ({ ...p, confirm: v }))
                          }
                          error={
                            passwords.confirm &&
                            passwords.new_password !== passwords.confirm
                              ? "Passwords do not match"
                              : undefined
                          }
                        />
                      </div>

                      {passwordError && (
                        <p className="text-xs text-red-500">{passwordError}</p>
                      )}
                      <div className="flex justify-end gap-2 pt-2 border-t border-border mt-6">
                        <Button
                          variant="outline"
                          className="cursor-pointer px-4 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setIsEditingPassword(false);
                            setPasswordError("");
                            setPasswords({
                              current: "",
                              new_password: "",
                              confirm: "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="cursor-pointer px-6 gap-2"
                          onClick={handleSavePassword}
                          disabled={isSavingPassword}
                        >
                          <Lock className="h-3.5 w-3.5" />
                          {isSavingPassword ? "Saving..." : "Save New Password"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Avatar + identity ── */}
            <div className="lg:col-span-1 flex flex-col gap-5">
              <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-6 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="h-28 w-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold shadow-md overflow-hidden">
                    {profile.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  {/* Hidden file picker */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />

                  {/* Camera button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white dark:bg-card border border-border shadow flex items-center justify-center hover:bg-muted disabled:opacity-50 transition-colors cursor-pointer"
                    aria-label="Change profile photo"
                  >
                    <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>

                {avatarError && (
                  <p className="text-xs text-red-500 mb-2">{avatarError}</p>
                )}

                <p className="text-base font-semibold">{profile.name || "—"}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate w-full">
                  {profile.email || "—"}
                </p>

                <div className="w-full border-t border-border mt-5 pt-5 space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Full Name
                      </p>
                      <p className="text-sm font-medium truncate">
                        {profile.name || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-sm font-medium truncate">
                        {profile.email || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Reusable password field ── */
function PasswordField({
  id,
  label,
  placeholder,
  value,
  show,
  onToggleShow,
  onChange,
  error,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  show: boolean;
  onToggleShow: () => void;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-muted-foreground mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full text-sm border rounded-lg px-3 py-2.5 pr-10 bg-gray-50 dark:bg-background outline-none transition ${
            error ? "border-red-400 " : "border-border "
          }`}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
