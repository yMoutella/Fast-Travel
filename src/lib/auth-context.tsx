"use client"

import * as React from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)

  const login = async (email: string, _password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({
      id: "1",
      name: email.split("@")[0],
      email,
    })
  }

  const register = async (name: string, email: string, _password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({
      id: "1",
      name,
      email,
    })
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
