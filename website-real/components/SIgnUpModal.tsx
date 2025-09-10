import { useState, useRef, useEffect } from "react";
import { X, Mail, User, Lock } from "lucide-react";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Sign up attempt:", { email, name, password });
    setIsLoading(false);
    onClose();
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 60000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        ref={modalRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "28rem",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transform: "scale(1)",
          transition: "all 0.3s ease-out",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            padding: "8px",
            color: "#9ca3af",
            backgroundColor: "transparent",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            transition: "all 0.2s",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#6b7280";
            e.currentTarget.style.backgroundColor = "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#9ca3af";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <X style={{ width: "20px", height: "20px" }} />
        </button>

        {/* Header */}
        <div className="p-6 pb-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Join FruitStand NY
            </h2>
            <p className="text-gray-600 text-sm">
              Get exclusive access to fresh streetwear and early drops
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-teal-700 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
            By signing up, you agree to our{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Privacy Policy
            </a>
          </p>

          {/* Social Login Alternative */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600 mb-3">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onClose}
                className="text-emerald-600 hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-2xl"></div>
      </div>
    </div>
  );
};