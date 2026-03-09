import {useState, useRef, useEffect} from "react";
import "../styles/home.css";
import theme from "../styles/theme";

/* ── Static data ── */
const CHECKS = [
    {label: "ATS Parse Rate", pct: 95, status: "great"},
    {label: "Quantifying Impact", pct: 88, status: "great"},
    {label: "Keyword Match", pct: 74, status: "good"},
    {label: "Repetition", pct: 45, status: "warn"},
    {label: "Spelling & Grammar", pct: 98, status: "great"},
    {label: "Format & Brevity", pct: 71, status: "good"},
];

/* Maps status string → actual color from theme */
const STATUS_COLOR = {
    great: theme.strengthGreat,   // #34d399
    good: theme.strengthGood,    // #facc15
    warn: theme.strengthFair,    // #fb923c
    bad: theme.strengthWeak,    // #f87171
};

/* ── Score Ring ── */
function ScoreRing({score = 92, size = 80}) {
    const r = 42;
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;

    const color =
        score >= 80 ? theme.strengthGreat :
            score >= 60 ? theme.strengthGood :
                score >= 40 ? theme.strengthFair :
                    theme.strengthWeak;

    return (
        <div style={{
            position: "relative",
            width: size,
            height: size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <svg width={size} height={size} style={{transform: "rotate(-90deg)", position: "absolute"}}>
                <circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"
                />
                <circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    style={{
                        filter: `drop-shadow(0 0 6px ${color})`,
                        transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)",
                    }}
                />
            </svg>
            <div style={{textAlign: "center", zIndex: 1}}>
                <div style={{fontSize: 20, fontWeight: 800, color, fontFamily: theme.fontMain, lineHeight: 1}}>
                    {score}
                </div>
                <div style={{fontSize: 10, color: theme.textMuted, fontFamily: theme.fontMain, marginTop: 2}}>
                    /100
                </div>
            </div>
        </div>
    );
}

/* ── Mock Preview Card ── */
function MockPreview() {
    return (
        <div className="home-preview-card">
            <div className="home-preview-header">
                <div>
                    <div className="home-preview-score-label">RESUME SCORE</div>
                    <ScoreRing score={92} size={80}/>
                </div>
                <div style={{textAlign: "right"}}>
                    <div className="home-preview-issues">24 issues found</div>
                    <div className="home-preview-badge">ATS READY</div>
                </div>
            </div>

            <div className="home-preview-checks">
                {CHECKS.map(c => (
                    <div key={c.label} className="home-check-row">
                        <div className="home-check-top">
                            <span className="home-check-label">{c.label}</span>
                            <span
                                className="home-check-pct"
                                style={{color: STATUS_COLOR[c.status]}}
                            >
                                {c.pct}%
                            </span>
                        </div>
                        <div className="home-check-bar-bg">
                            <div
                                className="home-check-bar-fill"
                                style={{
                                    width: `${c.pct}%`,
                                    background: STATUS_COLOR[c.status],
                                    boxShadow: `0 0 6px ${STATUS_COLOR[c.status]}88`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Main Home Component ── */
export default function Home({loggedIn, onUploadClick}) {
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileErr, setFileErr] = useState("");
    const [mounted, setMounted] = useState(false);
    const fileRef = useRef();

    useEffect(() => {
        setTimeout(() => setMounted(true), 60);
    }, []);

    /* ── File validation ── */
    const handleFile = (file) => {
        if (!file) return;
        const allowed = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowed.includes(file.type)) {
            setFileErr("Only PDF or DOCX files allowed.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setFileErr("File must be under 2MB.");
            return;
        }
        setFileErr("");
        setFileName(file.name);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleUploadClick = () => {
        if (!loggedIn) {
            onUploadClick();
            return;
        }
        fileRef.current.click();
    };

    return (
        <div className="home-page">

            {/* ── NAV ── */}
            <nav className="home-nav">
                <div className="home-nav-logo">
                    <div className="home-nav-icon">📄</div>
                    <span className="home-nav-title">ATS</span>
                    <span className="home-nav-sub">Resume Checker</span>
                </div>
                <div className="home-nav-links">
                    {["Features", "How it works", "Pricing"].map(l => (
                        <a key={l} href="#" className="home-nav-link">{l}</a>
                    ))}
                    {loggedIn
                        ? <div className="home-nav-loggedin">✓ Logged in</div>
                        : <button className="home-nav-signin" onClick={onUploadClick}>Sign In</button>
                    }
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="home-hero">
                <div className="home-hero-blob1"/>
                <div className="home-hero-blob2"/>
                <div className="home-hero-grid"/>

                <div className="home-hero-inner">

                    {/* Left column */}
                    <div className={`home-hero-left ${mounted ? "mounted" : ""}`}>

                        <div className="home-badge">
                            <span className="home-badge-dot"/>
                            <span className="home-badge-text">AI-POWERED RESUME ANALYSIS</span>
                        </div>

                        <h1 className="home-h1">
                            Is your resume{" "}
                            <span className="home-h1-gradient">good enough?</span>
                        </h1>

                        <p className="home-subtext">
                            A free and fast AI resume checker doing{" "}
                            <strong>16 crucial checks</strong> to ensure your resume
                            is ready and get you interview callbacks.
                        </p>

                        {/* Stats row */}
                        <div className="home-stats">
                            {[
                                ["2M+", "Resumes analyzed"],
                                ["94%", "Interview rate"],
                                ["16", "ATS checks"],
                            ].map(([v, l], i) => (
                                <div key={v} style={{display: "contents"}}>
                                    {i > 0 && <div className="home-stat-divider"/>}
                                    <div className="home-stat">
                                        <div className="home-stat-value">{v}</div>
                                        <div className="home-stat-label">{l}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Drop zone */}
                        <div
                            className={`home-dropzone ${dragging ? "dragging" : ""} ${fileName ? "has-file" : ""}`}
                            onDragOver={e => {
                                e.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={onDrop}
                            onClick={handleUploadClick}
                        >
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                style={{display: "none"}}
                                onChange={e => handleFile(e.target.files[0])}
                            />
                            {fileName ? (
                                <>
                                    <div className="home-dropzone-icon">📄</div>
                                    <div className="home-dropzone-filename">{fileName}</div>
                                    <div className="home-dropzone-change">File ready · Click to change</div>
                                </>
                            ) : (
                                <>
                                    <div className="home-dropzone-icon">☁️</div>
                                    <div className="home-dropzone-title">
                                        {loggedIn
                                            ? "Drop your resume here or choose a file"
                                            : "Sign in to upload your resume"}
                                    </div>
                                    <div className="home-dropzone-sub">PDF & DOCX only · Max 2MB</div>
                                </>
                            )}
                        </div>

                        {fileErr && <div className="home-file-error">⚠ {fileErr}</div>}

                        <button className="home-upload-btn" onClick={handleUploadClick}>
                            {loggedIn
                                ? (fileName ? "🚀 Analyze My Resume" : "📂 Choose Resume File")
                                : "🔒 Sign In to Upload Your Resume"}
                        </button>

                        <div className="home-privacy-note">
                            🔒 Privacy guaranteed · Your data is never shared
                        </div>
                    </div>

                    {/* Right column */}
                    <div className={`home-hero-right ${mounted ? "mounted" : ""}`}>
                        <MockPreview/>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="home-section home-section-alt">
                <div className="home-section-inner">
                    <div className="home-section-head">
                        <div className="home-section-tag">WHAT WE CHECK</div>
                        <h2 className="home-section-h2">16 checks. One perfect resume.</h2>
                        <p className="home-section-p">
                            Every factor recruiters and ATS systems use to filter candidates — analyzed instantly.
                        </p>
                    </div>
                    <div className="home-features-grid">
                        {[
                            {
                                icon: "🎯",
                                title: "ATS Parse Rate",
                                desc: "Check if ATS bots can correctly read every section of your resume."
                            },
                            {
                                icon: "💡",
                                title: "Keyword Matching",
                                desc: "Compare your resume keywords against top job descriptions."
                            },
                            {
                                icon: "📊",
                                title: "Quantified Impact",
                                desc: "Identify vague bullets and suggest data-driven improvements."
                            },
                            {
                                icon: "✍️",
                                title: "Spelling & Grammar",
                                desc: "Catch every error before a recruiter does with NLP checking."
                            },
                            {
                                icon: "📐",
                                title: "Format & Brevity",
                                desc: "Ensure clean formatting, proper length, and ATS-friendly structure."
                            },
                            {
                                icon: "🏷️",
                                title: "Section Detection",
                                desc: "Verify all critical sections exist and are properly labeled."
                            },
                        ].map(f => (
                            <div key={f.title} className="home-feature-card">
                                <div className="home-feature-icon">{f.icon}</div>
                                <div className="home-feature-title">{f.title}</div>
                                <div className="home-feature-desc">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="home-section">
                <div className="home-section-sm">
                    <div className="home-section-head">
                        <div className="home-section-tag">HOW IT WORKS</div>
                        <h2 className="home-section-h2">Three steps to a better resume</h2>
                    </div>
                    <div className="home-steps-grid">
                        {[
                            {
                                step: "01",
                                icon: "📤",
                                title: "Upload Resume",
                                desc: "Upload your PDF or DOCX resume. We accept all standard formats."
                            },
                            {
                                step: "02",
                                icon: "🤖",
                                title: "AI Analysis",
                                desc: "Our engine runs 16 checks across content, format, style, and ATS compatibility."
                            },
                            {
                                step: "03",
                                icon: "📈",
                                title: "Get Your Score",
                                desc: "Receive a detailed breakdown with actionable fixes for every issue found."
                            },
                        ].map(s => (
                            <div key={s.step} className="home-step-card">
                                <div className="home-step-number">{s.step}</div>
                                <div className="home-step-icon">{s.icon}</div>
                                <div className="home-step-title">{s.title}</div>
                                <div className="home-step-desc">{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="home-cta">
                <div className="home-cta-inner">
                    <div className="home-cta-icon">📄</div>
                    <h2 className="home-cta-h2">
                        Ready to beat the{" "}
                        <span className="home-h1-gradient">ATS filter?</span>
                    </h2>
                    <p className="home-cta-p">
                        Join over 2 million job seekers who improved their resume score and landed more interviews.
                    </p>
                    <button className="home-cta-btn" onClick={handleUploadClick}>
                        {loggedIn ? "Upload Resume Now →" : "Get Started Free →"}
                    </button>
                    {!loggedIn && (
                        <p className="home-cta-note">Free forever · No credit card required</p>
                    )}
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="home-footer">
                <div className="home-footer-logo">
                    <div className="home-footer-logo-icon">📄</div>
                    <span className="home-footer-logo-text">ATS Resume Checker</span>
                </div>
                <span className="home-footer-copy">© 2025 · Built with ♥</span>
                <div className="home-footer-links">
                    {["Privacy", "Terms", "Contact"].map(l => (
                        <a key={l} href="#" className="home-footer-link">{l}</a>
                    ))}
                </div>
            </footer>

        </div>
    );
}