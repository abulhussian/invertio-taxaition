"use client"

import { useState } from "react"
import { Link, useNavigate } from "../../utils/navigation"
import { motion } from "framer-motion"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Checkbox } from "../../../components/ui/checkbox"
import { Loader2, Phone, Mail, Building2 } from "lucide-react"

const DEMO_CREDENTIALS = {
  email: "abc234@gmail.com",
  phone: "+1234567890",
  password: "12345",
  otp: "123456",
}

const Register = () => {
  const [activeTab, setActiveTab] = useState("email")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [step, setStep] = useState("input") // 'input' or 'verify'
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Please enter your first and last name")
      return false
    }

    if (!formData.password || !formData.confirmPassword) {
      setError("Please enter password and confirm password")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (activeTab === "phone") {
      if (!formData.phoneNumber) {
        setError("Please enter phone number")
        return false
      }
      if (formData.phoneNumber !== DEMO_CREDENTIALS.phone || formData.password !== DEMO_CREDENTIALS.password) {
        setError("Use demo credentials: +1234567890 and password 12345")
        return false
      }
    }

    if (activeTab === "email") {
      if (!formData.email) {
        setError("Please enter email address")
        return false
      }
      if (formData.email !== DEMO_CREDENTIALS.email || formData.password !== DEMO_CREDENTIALS.password) {
        setError("Use demo credentials: abc234@gmail.com and password 12345")
        return false
      }
    }

    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions")
      return false
    }

    return true
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      setStep("verify")
      setSuccess("OTP sent successfully! Use 123456")
      setLoading(false)
    }, 1000)
  }

  const handleOTPVerification = async (e) => {
    e.preventDefault()

    if (!otp) {
      setError("Please enter the OTP")
      return
    }

    if (otp !== DEMO_CREDENTIALS.otp) {
      setError("Invalid OTP. Use 123456")
      return
    }

    setLoading(true)
    setError("")

    // Simulate successful registration
    setTimeout(() => {
      const demoUser = {
        uid: "demo-user-123",
        email: activeTab === "email" ? formData.email : null,
        phoneNumber: activeTab === "phone" ? formData.phoneNumber : null,
        displayName: `${formData.firstName} ${formData.lastName}`,
      }

      // Store user profile
      const userProfile = {
        uid: demoUser.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem("userProfile", JSON.stringify(userProfile))

      login(demoUser)
      navigate("dashboard")
      setLoading(false)
    }, 1000)
  }

  const resetForm = () => {
    setStep("input")
    setOtp("")
    setError("")
    setSuccess("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            >
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600">Join Invertio.us business management platform</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800 mb-1">Demo Credentials:</p>
              <p className="text-xs text-green-700">Email: abc234@gmail.com</p>
              <p className="text-xs text-green-700">Phone: +1234567890</p>
              <p className="text-xs text-green-700">Password: 12345</p>
              <p className="text-xs text-green-700">OTP: 123456</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {step === "input" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                    <TabsTrigger
                      value="email"
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger
                      value="phone"
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Phone className="w-4 h-4" />
                      Phone
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email" className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="abc234@gmail.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="12345"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="12345"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms-email" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} />
                        <label htmlFor="terms-email" className="text-sm text-gray-700">
                          I agree to the{" "}
                          <Link to="terms" className="text-primary hover:underline">
                            Terms and Conditions
                          </Link>
                        </label>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          placeholder="+1234567890"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="phone-password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <Input
                          id="phone-password"
                          name="password"
                          type="password"
                          placeholder="12345"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone-confirm-password"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Confirm Password
                        </label>
                        <Input
                          id="phone-confirm-password"
                          name="confirmPassword"
                          type="password"
                          placeholder="12345"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms-phone" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} />
                        <label htmlFor="terms-phone" className="text-sm text-gray-700">
                          I agree to the{" "}
                          <Link to="terms" className="text-primary hover:underline">
                            Terms and Conditions
                          </Link>
                        </label>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </>
            )}

            {step === "verify" && (
              <form onSubmit={handleOTPVerification} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the 6-digit code sent to {activeTab === "email" ? formData.email : formData.phoneNumber}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Create Account"
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="login" className="text-primary hover:underline font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Register
