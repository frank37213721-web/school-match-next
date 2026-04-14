'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { searchSchools } from '@/lib/supabase'
import { SchoolRegistry } from '@/types/database'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('error')

  // Login form state
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  // Registration form state
  const [schoolCode, setSchoolCode] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [schoolPhone, setSchoolPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [extension, setExtension] = useState('')
  const [directorEmail, setDirectorEmail] = useState('')
  const [principalEmail, setPrincipalEmail] = useState('')
  const [searchResults, setSearchResults] = useState<SchoolRegistry[]>([])
  const [showSchoolSearch, setShowSchoolSearch] = useState(false)

  // Search schools by code
  useEffect(() => {
    if (schoolCode.length >= 2) {
      const searchTimer = setTimeout(async () => {
        const { data } = await searchSchools(schoolCode, 5)
        setSearchResults(data || [])
        setShowSchoolSearch(true)
      }, 300)

      return () => clearTimeout(searchTimer)
    } else {
      setSearchResults([])
      setShowSchoolSearch(false)
    }
  }, [schoolCode])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      // TODO: Implement actual login logic
      // 1. SELECT * FROM schools WHERE phone = ?
      // 2. bcrypt.verify(password, password_hash)
      // 3. Success → session store school_info object
      // 4. Redirect to course lobby
      
      // Mock login for now
      setTimeout(() => {
        setIsLoading(false)
        setMessage('登入功能開發中...')
        setMessageType('error')
      }, 1000)
    } catch (error) {
      setIsLoading(false)
      setMessage('登入失敗，請重試')
      setMessageType('error')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (regPassword !== confirmPassword) {
      setMessage('密碼確認不一致')
      setMessageType('error')
      setIsLoading(false)
      return
    }

    if (regPassword.length < 8) {
      setMessage('密碼至少需要 8 個字元')
      setMessageType('error')
      setIsLoading(false)
      return
    }

    if (!schoolName) {
      setMessage('請選擇有效的學校代碼')
      setMessageType('error')
      setIsLoading(false)
      return
    }

    if (!schoolPhone) {
      setMessage('請輸入學校電話')
      setMessageType('error')
      setIsLoading(false)
      return
    }

    try {
      // Import auth functions
      const { createSchoolAccount } = await import('@/lib/auth')
      
      // Create school account
      const result = await createSchoolAccount({
        name: schoolName,
        phone: schoolPhone,
        password: regPassword,
        contact_person: contactPerson,
        extension: extension,
        director_email: directorEmail,
        principal_email: principalEmail,
        role: 'user'
      })

      if (result.success) {
        setMessage('註冊成功！請使用學校電話登入。')
        setMessageType('success')
        
        // Reset form
        setSchoolCode('')
        setSchoolName('')
        setSchoolPhone('')
        setRegPassword('')
        setConfirmPassword('')
        setContactPerson('')
        setExtension('')
        setDirectorEmail('')
        setPrincipalEmail('')
        
        // Switch to login tab after successful registration
        setTimeout(() => {
          setIsLogin(true)
        }, 2000)
      } else {
        setMessage(result.error || '註冊失敗，請重試')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setMessage('註冊失敗，請重試')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const selectSchool = (school: SchoolRegistry) => {
    setSchoolCode(school.school_code)
    setSchoolName(school.school_name)
    setShowSchoolSearch(false)
    setSearchResults([])
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-50 border-[1.5px] border-[#1a1a1a] rounded-2xl p-8">
        {/* Tab Navigation */}
        <div className="flex mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-l-lg transition-colors ${
              isLogin
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            學校登入
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-r-lg transition-colors ${
              !isLogin
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            學校註冊
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                學校電話
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="請輸入學校電話"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密碼
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="請輸入密碼"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg border-[1.5px] border-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登入中...' : '登入'}
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegister} className="space-y-6">
            {/* School Code with Auto-fill */}
            <div className="relative">
              <label htmlFor="schoolCode" className="block text-sm font-medium text-gray-700 mb-2">
                學校代碼
              </label>
              <input
                id="schoolCode"
                type="text"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="請輸入學校代碼"
                required
              />
              
              {/* School Search Results */}
              {showSchoolSearch && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {searchResults.map((school) => (
                    <button
                      key={school.id}
                      type="button"
                      onClick={() => selectSchool(school)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium">{school.school_name}</div>
                      <div className="text-sm text-gray-500">{school.school_code}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
                學校名稱
              </label>
              <input
                id="schoolName"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-100"
                placeholder="學校名稱將自動帶入"
                readOnly
                required
              />
            </div>

            <div>
              <label htmlFor="schoolPhone" className="block text-sm font-medium text-gray-700 mb-2">
                學校電話
              </label>
              <input
                id="schoolPhone"
                type="tel"
                value={schoolPhone}
                onChange={(e) => setSchoolPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="請輸入學校電話 (將用於登入)"
                required
              />
            </div>

            <div>
              <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700 mb-2">
                密碼
              </label>
              <input
                id="regPassword"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="請輸入密碼 (至少8個字元)"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                確認密碼
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="請再次輸入密碼"
                required
              />
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">聯絡人資訊</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                    承辦人姓名
                  </label>
                  <input
                    id="contactPerson"
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="請輸入承辦人姓名"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="extension" className="block text-sm font-medium text-gray-700 mb-2">
                    分機
                  </label>
                  <input
                    id="extension"
                    type="text"
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="請輸入分機號碼"
                  />
                </div>

                <div>
                  <label htmlFor="directorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    承辦處室主任 Email
                  </label>
                  <input
                    id="directorEmail"
                    type="email"
                    value={directorEmail}
                    onChange={(e) => setDirectorEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="請輸入主任 Email"
                  />
                </div>

                <div>
                  <label htmlFor="principalEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    校長 Email
                  </label>
                  <input
                    id="principalEmail"
                    type="email"
                    value={principalEmail}
                    onChange={(e) => setPrincipalEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="請輸入校長 Email"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg border-[1.5px] border-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '註冊中...' : '註冊帳號'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
