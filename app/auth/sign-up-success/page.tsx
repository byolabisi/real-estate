import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="w-full max-w-md">
        <div className="space-y-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-900">Welcome!</h1>
            <p className="text-slate-600 text-lg">
              Your account has been created successfully.
            </p>
          </div>

          {/* Email Confirmation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="font-semibold text-slate-900 mb-2">Verify Your Email</h2>
            <p className="text-sm text-slate-600 mb-4">
              We&apos;ve sent a confirmation link to your email address. Please check your inbox and click the link to activate your account.
            </p>
            <p className="text-xs text-slate-500">Didn&apos;t receive an email? Check your spam folder or contact our support team.</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-11 rounded-lg">
                Go to Sign In
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full border-slate-200 h-11 rounded-lg font-semibold">
                Return Home
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-sm text-slate-600">
            Questions?{' '}
            <a href="mailto:support@propertiesng.com" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
