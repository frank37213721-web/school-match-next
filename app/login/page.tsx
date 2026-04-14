'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { searchSchools } from '@/lib/supabase'
import { SchoolRegistry } from '@/types/database'

type AuthMode = 'school-login' | 'register' | 'admin-login'

export default function LoginPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<AuthMode>('school-login')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('error')

  // School login form state
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  // Registration form state
  const [schoolCode, setSchoolCode] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [schoolPhone, setSchoolPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [registrantName, setRegistrantName] = useState('')
  const [registrantExtension, setRegistrantExtension] = useState('')
  const [registrantEmail, setRegistrantEmail] = useState('')
  const [academicDirectorEmail, setAcademicDirectorEmail] = useState('')
  const [principalEmail, setPrincipalEmail] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [searchResults, setSearchResults] = useState<SchoolRegistry[]>([])
  const [showSchoolSearch, setShowSchoolSearch] = useState(false)

  // Forgot password form state
  const [forgotPhone, setForgotPhone] = useState('')
  const [forgotName, setForgotName] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  // Admin login form state
  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  // Terms and conditions
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const termsRef = useRef<HTMLDivElement>(null)

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

  // Handle terms scroll
  useEffect(() => {
    const handleScroll = () => {
      if (termsRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = termsRef.current
        const atBottom = scrollHeight - scrollTop - clientHeight < 10
        setScrolledToBottom(atBottom)
      }
    }

    const termsElement = termsRef.current
    if (termsElement) {
      termsElement.addEventListener('scroll', handleScroll)
      return () => termsElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSchoolLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { authenticateSchool } = await import('@/lib/auth')
      const result = await authenticateSchool(phone, password)

      if (result.success) {
        setMessage('登入成功！')
        setMessageType('success')
        // TODO: Store session and redirect to lobby
        setTimeout(() => {
          router.push('/lobby')
        }, 1000)
      } else {
        setMessage(result.error || '登入失敗')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('登入失敗，請重試')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (!forgotPhone || !forgotName || !forgotEmail) {
      setMessage('請填寫所有必填欄位')
      setMessageType('error')
      setIsLoading(false)
      return
    }

    try {
      // TODO: Implement actual forgot password logic
      setTimeout(() => {
        const defaultPassword = forgotPhone.slice(-4)
        setMessage(`密碼重置成功！新密碼：${defaultPassword}`)
        setMessageType('success')
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      setMessage('重置失敗，請重試')
      setMessageType('error')
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Registration form submitted')
    setIsLoading(true)
    setMessage('')

    if (!termsAgreed) {
      setMessage('請先同意使用條款')
      setMessageType('error')
      setIsLoading(false)
      return
    }

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
      console.log('Attempting to create school account...')
      const { createSchoolAccount } = await import('@/lib/auth')
      
      const result = await createSchoolAccount({
        name: schoolName,
        phone: schoolPhone,
        password: regPassword,
        contact_person: registrantName,
        extension: registrantExtension,
        director_email: academicDirectorEmail,
        principal_email: principalEmail,
        role: 'user'
      })

      console.log('Registration result:', result)

      if (result.success) {
        const defaultPassword = schoolPhone.slice(-4)
        setMessage(`註冊成功！預設密碼：${defaultPassword}`)
        setMessageType('success')
        
        // Reset form
        setSchoolCode('')
        setSchoolName('')
        setSchoolPhone('')
        setRegPassword('')
        setConfirmPassword('')
        setRegistrantName('')
        setRegistrantExtension('')
        setRegistrantEmail('')
        setAcademicDirectorEmail('')
        setPrincipalEmail('')
        setTermsAgreed(false)
        
        // Switch to login tab after successful registration
        setTimeout(() => {
          setAuthMode('school-login')
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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Admin login form submitted')
    setIsLoading(true)
    setMessage('')

    try {
      console.log('Attempting admin login...')
      // TODO: Implement actual admin login logic
      setTimeout(() => {
        console.log('Admin login completed')
        setMessage('管理員登入功能開發中...')
        setMessageType('error')
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Admin login error:', error)
      setMessage('登入失敗，請重試')
      setMessageType('error')
      setIsLoading(false)
    }
  }

  const selectSchool = (school: SchoolRegistry) => {
    setSchoolCode(school.school_code)
    setSchoolName(school.school_name)
    setSelectedDistrict(school.district || '')
    setShowSchoolSearch(false)
    setSearchResults([])
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-50 border-[1.5px] border-[#1a1a1a] rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          課程匯流平台 - 帳號管理
        </h1>

        {/* Tab Navigation */}
        <div className="flex mb-8">
          <button
            onClick={() => {
              console.log('Switching to school login')
              setAuthMode('school-login')
            }}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-l-lg transition-colors ${
              authMode === 'school-login'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            🔑 學校帳號登入
          </button>
          <button
            onClick={() => {
              console.log('Switching to register')
              setAuthMode('register')
            }}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors border-x border-gray-300 ${
              authMode === 'register'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            📝 註冊學校帳號
          </button>
          <button
            onClick={() => {
              console.log('Switching to admin login')
              setAuthMode('admin-login')
            }}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-r-lg transition-colors ${
              authMode === 'admin-login'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            🔐 管理人員登入
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

        {/* School Login Tab */}
        {authMode === 'school-login' && (
          <div className="space-y-8">
            <form onSubmit={handleSchoolLogin} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">🔑 學校帳號登入</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      帳號（學校電話）
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
                    {isLoading ? '登入中...' : '確認登入'}
                  </button>
                </div>
              </div>
            </form>

            {/* Forgot Password Section */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🔐 忘記密碼</h2>
              <p className="text-gray-600 mb-4">
                如果您忘記密碼，可以透過以下方式重置為預設密碼
              </p>

              {!showForgotPassword ? (
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  📋 點擊展開重置密碼說明
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">重置密碼流程：</h3>
                    <ol className="list-decimal list-inside space-y-1 text-blue-800">
                      <li>輸入學校帳號（電話號碼）</li>
                      <li>輸入承辦人姓名進行身分驗證</li>
                      <li>輸入承辦人 Email 進行驗證</li>
                      <li>驗證成功後，密碼將重置為預設密碼（電話號碼後4碼）</li>
                      <li>重置密碼會 Email 通知相關人員</li>
                    </ol>
                  </div>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label htmlFor="forgot_phone" className="block text-sm font-medium text-gray-700 mb-2">
                        學校帳號 (電話號碼)
                      </label>
                      <input
                        id="forgot_phone"
                        type="tel"
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="請輸入學校電話"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="forgot_name" className="block text-sm font-medium text-gray-700 mb-2">
                        承辦人姓名
                      </label>
                      <input
                        id="forgot_name"
                        type="text"
                        value={forgotName}
                        onChange={(e) => setForgotName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="請輸入承辦人姓名"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="forgot_email" className="block text-sm font-medium text-gray-700 mb-2">
                        承辦人 Email
                      </label>
                      <input
                        id="forgot_email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="請輸入承辦人 Email"
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg border-[1.5px] border-orange-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? '重置中...' : '🔄 重置密碼'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                      >
                        取消
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Registration Tab */}
        {authMode === 'register' && (
          <div className="space-y-6">
            {/* Terms and Conditions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 使用者權利須知與合作約定</h2>
              <p className="text-sm text-gray-600 mb-4">
                請閱讀並滑至底部後勾選同意，方可進行註冊。
              </p>
              
              <div
                ref={termsRef}
                className="h-80 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-white mb-4"
              >
                <h3 className="font-semibold text-gray-900 mb-3">跨校課程串聯平台：註冊須知與約定事項</h3>
                
                <div className="space-y-4 text-sm text-gray-700">
                  <div>
                    <strong>1. 平台的角色定位：資訊鏈結與輔助</strong>
                    <p>本平台定位為「教育資源資訊交換中心」，僅提供各校課程需求與開課資訊之展示。平台之功能在於輔助學校發現潛在合作對象，而非課程決策單位。</p>
                  </div>

                  <div>
                    <strong>2. 積極洽談之義務：學校需主動出擊</strong>
                    <p>本平台採「被動式資訊彙整」模式。相關課程之細節洽談、排課協調及行政作業，需由註冊學校雙方主動聯繫。平台不介入後續的行政決策與過程。</p>
                  </div>

                  <div>
                    <strong>3. 免責聲明：不保證合作成功</strong>
                    <p>開發者（及平台方）致力於優化資訊鏈結之精準度，但不保證註冊學校一定能達成跨校課程之合作。合作是否成功，取決於各校課程性質、距離、時間及雙方合作意願等客觀因素，開發者不負任何配對成功之保證責任。</p>
                  </div>

                  <div>
                    <strong>4. 資訊真實性責任</strong>
                    <p>註冊學校應確保上傳至平台之課程資訊、聯繫方式及合作需求皆為真實。若因資訊有誤導致合作受阻或產生行政缺失，應由提供資訊之學校自行負責。</p>
                  </div>

                  <div>
                    <strong>5. 行政主體性原則</strong>
                    <p>跨校課程之開設應符合教育部（局）相關法規，平台所提供之配對建議僅供參考。所有行政契約、合作備忘錄（MOU）之簽署及學分認定，皆需回歸各校現行行政流程與法規處理。</p>
                  </div>

                  <p className="text-center text-blue-600 font-medium pt-4">
                    ― 已閱讀至本頁底部，請勾選下方同意按鈕繼續 ―
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms_agreed"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  disabled={!scrolledToBottom}
                  className="mr-2"
                />
                <label htmlFor="terms_agreed" className={`text-sm ${!scrolledToBottom ? 'text-gray-400' : 'text-gray-700'}`}>
                  我已閱讀並同意以上《使用者權利須知與合作約定》
                </label>
              </div>

              {!scrolledToBottom && (
                <p className="text-sm text-amber-600 mt-2">
                  ☝️ 請閱讀上方說明並滑至底部，勾選同意後繼續填寫註冊資料。
                </p>
              )}
            </div>

            {termsAgreed && scrolledToBottom && (
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Debug info */}
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    Debug: Form is ready. Terms agreed: {termsAgreed.toString()}, 
                    Scrolled to bottom: {scrolledToBottom.toString()}
                  </p>
                </div>
                {/* School Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">1. 選擇學校名稱</h3>
                  
                  <div className="relative">
                    <label htmlFor="schoolCode" className="block text-sm font-medium text-gray-700 mb-2">
                      輸入學校代碼（快速帶出學校名稱）
                    </label>
                    <input
                      id="schoolCode"
                      type="text"
                      value={schoolCode}
                      onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="例：183314"
                      maxLength={10}
                    />
                    
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

                  <div className="mt-4">
                    <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
                      學校名稱
                    </label>
                    <input
                      id="schoolName"
                      type="text"
                      value={schoolName}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      placeholder="學校名稱將自動帶入"
                    />
                    {selectedDistrict && (
                      <p className="text-sm text-gray-500 mt-1">分區：{selectedDistrict}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">2. 承辦人資訊</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="registrantName" className="block text-sm font-medium text-gray-700 mb-2">
                        承辦人姓名
                      </label>
                      <input
                        id="registrantName"
                        type="text"
                        value={registrantName}
                        onChange={(e) => setRegistrantName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="例：王小明"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="registrantExtension" className="block text-sm font-medium text-gray-700 mb-2">
                        承辦人分機
                      </label>
                      <input
                        id="registrantExtension"
                        type="text"
                        value={registrantExtension}
                        onChange={(e) => setRegistrantExtension(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="例：123"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="schoolPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      學校電話（作為登入帳號，請含區域號碼）
                    </label>
                    <input
                      id="schoolPhone"
                      type="tel"
                      value={schoolPhone}
                      onChange={(e) => setSchoolPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="例：073475181"
                      required
                    />
                    <p className="text-sm text-amber-600 mt-1">
                      ⚠️ 請輸入含區域號碼的完整電話，例如高雄市為 07、台北市為 02
                    </p>
                    
                    {schoolPhone && schoolPhone.length >= 4 && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          🔒 預設密碼（電話後4碼）：**{schoolPhone.slice(-4)}**
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">3. 學校重要聯絡人 Email</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="registrantEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        承辦人 Email
                      </label>
                      <input
                        id="registrantEmail"
                        type="email"
                        value={registrantEmail}
                        onChange={(e) => setRegistrantEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="請輸入承辦人 Email"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="academicDirectorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        承辦處室主任 Email
                      </label>
                      <input
                        id="academicDirectorEmail"
                        type="email"
                        value={academicDirectorEmail}
                        onChange={(e) => setAcademicDirectorEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="請輸入主任 Email"
                        required
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
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">4. 設定密碼</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg border-[1.5px] border-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '註冊中...' : '🎉 確認註冊'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Admin Login Tab */}
        {authMode === 'admin-login' && (
          <form onSubmit={handleAdminLogin} className="space-y-6">
            {/* Debug info */}
            <div className="p-3 bg-purple-50 border border-purple-200 rounded">
              <p className="text-sm text-purple-800">
                Debug: Admin login form is ready. Current mode: {authMode}
              </p>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔐 管理人員登入</h2>
            
            <div>
              <label htmlFor="adminUsername" className="block text-sm font-medium text-gray-700 mb-2">
                管理員帳號
              </label>
              <input
                id="adminUsername"
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="請輸入管理員帳號"
                required
              />
            </div>

            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
                管理員密碼
              </label>
              <input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="請輸入管理員密碼"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg border-[1.5px] border-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登入中...' : '🎉 管理員登入'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
