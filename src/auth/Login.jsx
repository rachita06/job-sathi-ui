import {useState, useEffect} from "react";
import "../styles/login.css";

/* ── Validation ── */
function validate({email, password}) {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    return e;
}

/* ── Spinner ── */
function Spinner() {
    return <div className="login-spinner"/>;
}

/* ── Input Field ── */
function InputField({label, type = "text", value, onChange, onBlur, error, placeholder, icon}) {
    const [focused, setFocused] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const isPass = type === "password";
    const hasErr = !!error;

    return (
        <div className="login-field">
            <label className={`login-label ${focused ? "focused" : ""} ${hasErr ? "errored" : ""}`}>
                {icon} {label}
            </label>
            <div className="login-input-wrap">
                <input
                    type={isPass && showPass ? "text" : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                        setFocused(false);
                        onBlur && onBlur();
                    }}
                    className={`login-input ${isPass ? "has-toggle" : ""} ${focused ? "focused" : ""} ${hasErr ? "errored" : ""}`}
                />
                {isPass && (
                    <button
                        type="button"
                        className="login-toggle-btn"
                        onClick={() => setShowPass(p => !p)}
                    >
                        {showPass ? "🙈" : "👁️"}
                    </button>
                )}
            </div>
            {error && <div className="login-field-error">⚠ {error}</div>}
        </div>
    );
}

/* ── Main Component ── */
export default function Login({onLogin, onGoRegister}) {
    const [form, setForm] = useState({email: "", password: ""});
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 60);
    }, []);

    const set = k => e => {
        const val = e.target.value;
        setForm(f => ({...f, [k]: val}));
        if (touched[k]) setErrors(p => ({...p, [k]: validate({...form, [k]: val})[k]}));
    };

    const blur = k => () => {
        setTouched(t => ({...t, [k]: true}));
        setErrors(p => ({...p, [k]: validate(form)[k]}));
    };

    const handleSubmit = async () => {
        setTouched({email: true, password: true});
        const errs = validate(form);
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setLoading(true);
        setMsg("");
        try {
            const res = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: form.email, password: form.password}),
            });
            const text = await res.text();
            if (res.status === 200) {
                if (text?.startsWith("ey")) localStorage.setItem("token", text);
                setSuccess(true);
                setTimeout(() => onLogin(), 900);
            } else {
                setMsg(text || "Invalid credentials.");
            }
        } catch {
            setMsg("Cannot reach server. Is Spring Boot running on :8080?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-root">
            <div
                className="login-page"
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
            >
                {/* Background */}
                <div className="login-blob-1"/>
                <div className="login-blob-2"/>
                <div className="login-grid"/>

                <div className={`login-wrapper ${mounted ? "mounted" : ""}`}>

                    {/* Brand */}
                    <div className="login-brand">
                        <div className="login-brand-icon">📄</div>
                        <div className="login-brand-row">
                            <span className="login-brand-ats">ATS</span>
                            <span className="login-brand-dot"/>
                            <span className="login-brand-sub">RESUME SYSTEM</span>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="login-card">
                        <div className="login-card-accent"/>

                        {/* Heading */}
                        <div className="login-heading">
                            <h1>Welcome back</h1>
                            <p>Sign in to your ATS account</p>
                        </div>

                        {/* Social */}
                        <div className="login-social-row">
                            {[["G", "Google"], ["⌘", "Apple"]].map(([ic, lb]) => (
                                <button key={lb} className="login-social-btn">
                                    {ic} {lb}
                                </button>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="login-divider">
                            <div className="login-divider-line"/>
                            <span>or continue with email</span>
                            <div className="login-divider-line"/>
                        </div>

                        {/* Fields */}
                        <InputField
                            label="Email Address" type="email" icon="✉"
                            value={form.email} placeholder="you@company.com"
                            onChange={set("email")} onBlur={blur("email")}
                            error={touched.email && errors.email}
                        />
                        <InputField
                            label="Password" type="password" icon="🔒"
                            value={form.password} placeholder="Enter your password"
                            onChange={set("password")} onBlur={blur("password")}
                            error={touched.password && errors.password}
                        />

                        {/* Forgot */}
                        <div className="login-forgot">
                            <a href="#">Forgot password?</a>
                        </div>

                        {/* Server error */}
                        {msg && (
                            <div className="login-alert">
                                <span>⚠️</span>
                                <span>{msg}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            className="login-submit-btn"
                            onClick={handleSubmit}
                            disabled={loading || success}
                        >
                            {loading
                                ? <><Spinner/><span>Signing in...</span></>
                                : success ? "✓ Redirecting..." : "Sign In →"
                            }
                        </button>

                        {/* Switch */}
                        <p className="login-switch">
                            No account?{" "}
                            <button className="login-switch-btn" onClick={onGoRegister}>
                                Create one →
                            </button>
                        </p>
                    </div>

                    <p className="login-footer-note">🔒 Enterprise-grade encryption</p>
                </div>
            </div>
        </div>
    );
}