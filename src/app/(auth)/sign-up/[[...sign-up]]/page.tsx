import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <SignUp
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    fallbackRedirectUrl="/"
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            cardBox: "shadow-2xl border border-gray-800",
                            card: "bg-[#121212]",
                            headerTitle: "text-white font-display",
                            headerSubtitle: "text-gray-400 font-sans",
                            socialButtonsBlockButton: "border border-gray-700 bg-[#1A1A1A] hover:bg-[#222222] text-white",
                            socialButtonsBlockButtonText: "font-semibold",
                            dividerLine: "bg-gray-700",
                            dividerText: "text-gray-500",
                            formFieldLabel: "text-gray-300",
                            formFieldInput: "bg-[#1A1A1A] border-gray-700 text-white focus:border-[#A8FF78] focus:ring-[#A8FF78]",
                            formButtonPrimary: "bg-gradient-to-r from-[#A8FF78] to-[#78FFD6] text-black hover:from-[#90E566] hover:to-[#66E5C0]",
                            footerActionText: "text-gray-400",
                            footerActionLink: "text-[#A8FF78] hover:text-[#90E566]",
                        }
                    }}
                />
            </motion.div>
        </div>
    );
}
