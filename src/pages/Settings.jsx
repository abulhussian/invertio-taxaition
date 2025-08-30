"use client"
export const dynamic = "force-dynamic";

import { useState } from "react"
import { motion } from "framer-motion"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import ProtectedRoute from "../routes/ProtectedRoute"
import { useAuth } from "../contexts/AuthContext"

// Mock UI components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>{children}</div>
)

const CardHeader = ({ children }) => <div className="mb-4">{children}</div>
const CardTitle = ({ children }) => <h3 className="text-lg font-medium text-gray-900">{children}</h3>
const CardDescription = ({ children }) => <p className="text-sm text-gray-500">{children}</p>
const CardContent = ({ children }) => <div>{children}</div>

const Button = ({ children, onClick, className = "", ...props }) => (
  <button 
    onClick={onClick} 
    className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`} 
    {...props}
  >
    {children}
  </button>
)

const Input = ({ value, onChange, placeholder, className = "", ...props }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
)

const Label = ({ children, htmlFor, className = "" }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
    {children}
  </label>
)

const Switch = ({ checked, onCheckedChange, className = "" }) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-blue-600' : 'bg-gray-200'
    } ${className}`}
    onClick={() => onCheckedChange(!checked)}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
)

const Separator = ({ className = "" }) => (
  <hr className={`border-gray-200 ${className}`} />
)

const Avatar = ({ children, className = "" }) => (
  <div className={`w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
    {children}
  </div>
)

const AvatarFallback = ({ children, className = "" }) => (
  <span className={`text-lg font-medium text-gray-600 ${className}`}>{children}</span>
)

const Alert = ({ children, variant = "default", className = "" }) => (
  <div className={`p-4 rounded-md ${
    variant === "destructive" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
  } ${className}`}>
    {children}
  </div>
)

const AlertDescription = ({ children }) => (
  <p className="text-sm">{children}</p>
)

// Mock icons
const User = () => <span>👤</span>
const Bell = () => <span>🔔</span>
const Shield = () => <span>🛡️</span>
const Trash2 = () => <span>🗑️</span>
const Save = () => <span>💾</span>

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const { user } = useAuth()

  const [profile, setProfile] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("userProfile") || "{}")
    return {
      firstName: stored.firstName || "",
      lastName: stored.lastName || "",
      email: user?.email || "",
      phone: stored.phone || "",
    }
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
  })

  const getUserInitials = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    }
    return user?.email?.[0]?.toUpperCase() || "U"
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update localStorage
      const updatedProfile = {
        ...JSON.parse(localStorage.getItem("userProfile") || "{}"),
        ...profile,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile))

      setSuccess("Profile updated successfully!")
    } catch (error) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationUpdate = async (key, value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))

    // Simulate API call to update notification preferences
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.setItem("notificationSettings", JSON.stringify({ ...notifications, [key]: value }))
    } catch (error) {
      console.error("Failed to update notification settings:", error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your account settings and preferences.</p>
              </div>

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User />
                    <CardTitle>Profile Information</CardTitle>
                  </div>
                  <CardDescription>Update your personal information and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">Profile Picture</h3>
                      <p className="text-sm text-gray-500">
                        This is your avatar. It will be displayed across the platform.
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value={profile.email} disabled className="bg-gray-50" />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed after registration</p>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Save />
                          <span className="ml-2">Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save />
                          <span className="ml-2">Save Changes</span>
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell />
                    <CardTitle>Notification Preferences</CardTitle>
                  </div>
                  <CardDescription>Choose how you want to be notified about updates and activities.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationUpdate("emailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                        <p className="text-sm text-gray-500">Receive important updates via SMS</p>
                      </div>
                      <Switch
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) => handleNotificationUpdate("smsNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => handleNotificationUpdate("pushNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                        <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                      </div>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationUpdate("marketingEmails", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield />
                    <CardTitle>Security</CardTitle>
                  </div>
                  <CardDescription>Manage your account security and privacy settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Active Sessions</h4>
                      <p className="text-sm text-gray-500">Manage your active login sessions</p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trash2 />
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  </div>
                  <CardDescription>Irreversible and destructive actions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <h4 className="font-medium text-red-900">Delete Account</h4>
                      <p className="text-sm text-red-700">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Settings