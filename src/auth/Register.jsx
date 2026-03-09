import {useState, useEffect} from "react";
import "../styles/register.css";
import theme from "../styles/theme";

/* ── Validation ── */
function validateAll({name, email, password, confirm}) {
    const e = {};
    if (!name.trim()) e.name = "Full name is required";
    else if (name.trim().length < 2) e.name = "Name too short";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    if (!confirm) e.confirm = "Please confirm your password";
    else if (confirm !== password) e.confirm = "Passwords do not match";
    return e;
}

/* ── Spinner ── */
function Spinner() {
    return <div className="register-spinner"/>;
}

/* ── Input Field ── */
function InputField({label, type = "text", value, onChange, onBlur, error, placeholder, icon}) {
    const [focused, setFocused] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const isPass = type === "password";
    const hasErr = !!error;

    return (
        <div className="register-field">
            <label className={`register-label ${focused ? "focused" : ""} ${hasErr ? "errored" : ""}`}>
                {icon} {label}
            </label>
            <div className="register-input-wrap">
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
                    className={`register-input ${isPass ? "has-toggle" : ""} ${focused ? "focused" : ""} ${hasErr ? "errored" : ""}`}
                />
                {isPass && (
                    <button
                        type="button"
                        className="register-toggle-btn"
                        onClick={() => setShowPass(p => !p)}
                    >
                        {showPass ? "🙈" : "👁️"}
                    </button>
                )}
            </div>
            {error && <div className="register-field-error">⚠ {error}</div>}
        </div>
    );
}

/* ── Password Strength Bar ── */
function StrengthBar({password}) {
    if (!password) return null;

    const score = password.length < 6 ? 1
        : password.length < 10 ? 2
            : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4
                : 3;

    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = ["", theme.strengthWeak, theme.strengthFair, theme.strengthGood, theme.strengthGreat];

    return (
        <div className="register-strength">
            <div className="register-strength-bars">
                {[1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        className="register-strength-bar"
                        style={{background: score >= i ? colors[score] : undefined}}
                    />
                ))}
            </div>
            <span
                className="register-strength-label"
                style={{color: colors[score]}}
            >
                {labels[score]}
            </span>
        </div>
    );
}

/* ── Main Component ── */
export default function Register({onSuccess, onGoLogin}) {
    const [form, setForm] = useState({name: "", email: "", password: "", confirm: ""});
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
        if (touched[k]) setErrors(p => ({...p, [k]: validateAll({...form, [k]: val})[k]}));
    };

    const blur = k => () => {
        setTouched(t => ({...t, [k]: true}));
        setErrors(p => ({...p, [k]: validateAll(form)[k]}));
    };

    const handleSubmit = async () => {
        setTouched({name: true, email: true, password: true, confirm: true});
        const errs = validateAll(form);
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setLoading(true);
        setMsg("");
        try {
            const res = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name: form.name, email: form.email, password: form.password}),
            });
            const text = await res.text();
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => onSuccess(), 1500);
            } else {
                setMsg(text || "Registration failed. Please try again.");
            }
        } catch {
            setMsg("Cannot reach server. Is Spring Boot running on :8080?");
        } finally {
            setLoading(false);
        }
    };

    /* Password requirement checks */
    const reqs = [
        ["6+ chars", form.password.length >= 6],
        ["Has number", /[0-9]/.test(form.password)],
        ["Uppercase", /[A-Z]/.test(form.password)],
    ];

    return (
        <div className="register-root">
            <div className="register-page">

                {/* Background */}
                <div className="register-blob-1"/>
                <div className="register-blob-2"/>
                <div className="register-grid"/>

                <div className={`register-wrapper ${mounted ? "mounted" : ""}`}>

                    {/* Brand */}
                    <div className="register-brand">
                        <div className="register-brand-icon">📄</div>
                        <div className="register-brand-row">
                            <span className="register-brand-ats">ATS</span>
                            <span className="register-brand-dot"/>
                            <span className="register-brand-sub">RESUME SYSTEM</span>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="register-card">
                        <div className="register-card-accent"/>

                        {/* Success overlay */}
                        {success && (
                            <div className="register-success-overlay">
                                <div className="register-success-icon">✓</div>
                                <p className="register-success-title">Account created!</p>
                                <p className="register-success-sub">Redirecting to login...</p>
                            </div>
                        )}

                        {/* Heading */}
                        <div className="register-heading">
                            <h1>Create account</h1>
                            <p>Start your ATS journey today</p>
                        </div>

                        {/* Fields */}
                        <InputField
                            label="Full Name" icon="👤"
                            value={form.name} placeholder="John Doe"
                            onChange={set("name")} onBlur={blur("name")}
                            error={touched.name && errors.name}
                        />
                        <InputField
                            label="Email Address" type="email" icon="✉"
                            value={form.email} placeholder="you@company.com"
                            onChange={set("email")} onBlur={blur("email")}
                            error={touched.email && errors.email}
                        />
                        <InputField
                            label="Password" type="password" icon="🔒"
                            value={form.password} placeholder="Create a strong password"
                            onChange={set("password")} onBlur={blur("password")}
                            error={touched.password && errors.password}
                        />

                        {/* Strength bar */}
                        <StrengthBar password={form.password}/>

                        <InputField
                            label="Confirm Password" type="password" icon="🔑"
                            value={form.confirm} placeholder="Repeat your password"
                            onChange={set("confirm")} onBlur={blur("confirm")}
                            error={touched.confirm && errors.confirm}
                        />

                        {/* Requirements */}
                        <div className="register-reqs">
                            {reqs.map(([lbl, ok]) => (
                                <div key={lbl} className={`register-req-item ${ok ? "met" : ""}`}>
                                    <span>{ok ? "✓" : "○"}</span> {lbl}
                                </div>
                            ))}
                        </div>

                        {/* Server error */}
                        {msg && (
                            <div className="register-alert">
                                <span>⚠️</span>
                                <span>{msg}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            className="register-submit-btn"
                            onClick={handleSubmit}
                            disabled={loading || success}
                        >
                            {loading
                                ? <><Spinner/><span>Creating account...</span></>
                                : "Create Account →"
                            }
                        </button>

                        {/* Switch */}
                        <p className="register-switch">
                            Already have an account?{" "}
                            <button className="register-switch-btn" onClick={onGoLogin}>
                                Sign in →
                            </button>
                        </p>
                    </div>

                    <p className="register-footer-note">🔒 Enterprise-grade encryption</p>
                </div>
            </div>
        </div>
    );
}