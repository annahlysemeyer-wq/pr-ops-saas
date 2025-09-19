export default function VerifyEmailPage() {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Check Your Email
        </h2>
        <p className="text-gray-600 mb-4">
          We've sent a confirmation link to your email address.
          Please click the link to verify your account.
        </p>
        <p className="text-sm text-gray-500">
          Didn't receive it? Check your spam folder or contact support.
        </p>
      </div>
    )
  }