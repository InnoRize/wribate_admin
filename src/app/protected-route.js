'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect( () => {
    const token = localStorage.getItem('token')
    async function validateToken() {
        try {
            const res = await axios.post(
                process.env.NEXT_PUBLIC_APP_BASE_URL + '/admin/validate-token', 
                {token}
            )
            console.log('Token validation response:', res.data)
            if (res.data.status !== 1) {
            localStorage.removeItem('token')
            router.push('/login')
            }
        }
            catch (error) {
                console.error('Token validation failed:', error)
                localStorage.removeItem('token')
                router.push('/login')
            }
    }
    if (!token) {
      router.push('/login')
    } else {
        validateToken()
        setChecked(true)
    }
  }, [])

  if (!checked) return null

  return <>{children}</>
}
