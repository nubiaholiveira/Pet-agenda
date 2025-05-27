"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { loginService } from "@/lib/loginService"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: { email?: string; senha?: string } = {}

    if (!email) {
      newErrors.email = "Email é obrigatório"
    }

    if (!senha) {
      newErrors.senha = "Senha é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    console.log("LoginPage: handleSubmit iniciado. Email:", email);
    
    try {
      console.log("LoginPage: Tentando fazer login para:", email);
      
      // Usar o método login do contexto de autenticação
      const success = await login(email, senha);
      
      if (success) {
        console.log(`LoginPage: Login bem-sucedido para ${email}. Redirecionando...`);
        
        // Para garantir o redirecionamento após login, forçamos o recarregamento completo.
        // Isto garante que os cookies serão enviados em todas as requisições subsequentes.
        window.location.href = '/';
      } else {
        console.error("LoginPage: Login falhou");
        setErrors({ email: 'Email ou senha inválidos', senha: 'Email ou senha inválidos' });
      }
    } catch (error) {
      console.error("LoginPage: Erro no login:", error);
      
      if (axios.isAxiosError(error)) {
        console.error("LoginPage: Detalhes do erro:", error.response?.data || error.message);
      }
      
      setErrors({ email: 'Email ou senha inválidos', senha: 'Email ou senha inválidos' });
    } finally {
      setIsSubmitting(false);
      console.log("LoginPage: handleSubmit finalizado.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gray-900 dark:bg-gray-700 p-3 rounded-lg mb-4">
            <Building className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center">Pet Agenda</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="text"
                placeholder="seu@email.com"
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`pl-10 ${errors.senha ? "border-red-500" : ""}`}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Lembrar-me
              </label>
            </div>
            <Link href="/esqueci-senha" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              Esqueceu a senha?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-blue-600 hover:underline dark:text-blue-400">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
