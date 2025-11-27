import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-sm text-center">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold mb-4">Account Created!</h1>
        <p className="text-gray-600 mb-8">Please check your email to confirm your account and get started.</p>
        <Link href="/auth/login">
          <Button className="w-full">Back to Login</Button>
        </Link>
      </div>
    </div>
  )
}
