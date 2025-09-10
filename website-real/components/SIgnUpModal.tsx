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
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(4px)",
      }}
      className="modal-outer flex items-center justify-center"
    >
      <div
        ref={modalRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "28rem",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transform: "scale(1)",
          transition: "all 0.3s ease-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className="modal-inner w-full max-w-xl mx-auto flex flex-col items-center justify-center"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            padding: "8px",
            color: "#222",
            backgroundColor: "transparent",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            transition: "all 0.2s",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.backgroundColor = "#222";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#222";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <X style={{ width: "20px", height: "20px" }} />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 w-full flex flex-col items-center justify-center">
          <div className="text-center w-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4 bg-black rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2 w-full text-center">
              JOIN FRUITSTAND NY
            </h2>
            <p className="text-gray-500 text-sm w-full text-center">
              Get exclusive access to fresh streetwear and early drops
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                paddingLeft: "10px"
              }}>
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pr-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 outline-none bg-white text-black placeholder-gray-400"
                required
                style={{ width: "100%", paddingLeft: "36px" }}
              />
            </div>

            {/* Email Input */}
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                paddingLeft: "10px"
              }}>
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 outline-none bg-white text-black placeholder-gray-400"
                required
                style={{ width: "100%", paddingLeft: "36px" }}
              />
            </div>

            {/* Password Input */}
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                paddingLeft: "10px"
              }}>
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 outline-none bg-white text-black placeholder-gray-400"
                required
                minLength={6}
                style={{ width: "100%", paddingLeft: "36px" }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-white hover:text-black border border-black focus:ring-4 focus:ring-black/20 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            <a href="#" className="text-black hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-black hover:underline">
              Privacy Policy
            </a>
          </p>

          {/* Social Login Alternative */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-black mb-3">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onClose}
                className="text-black hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>

        {/* Background decoration */}
  <div className="absolute top-0 left-0 w-full h-2 bg-black rounded-t-2xl"></div>
      </div>
    </div>
  );
};