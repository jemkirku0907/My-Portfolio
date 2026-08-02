from pathlib import Path
from textwrap import wrap

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "resume" / "Jemkirk-Utana-CV.pdf"

PAGE_W, PAGE_H = letter
MARGIN_X = 38
TOP = PAGE_H - 34
BOTTOM = 30
CONTENT_W = PAGE_W - (MARGIN_X * 2)

INK = colors.HexColor("#111827")
MUTED = colors.HexColor("#4B5563")
LINE = colors.HexColor("#D1D5DB")
ACCENT = INK


def register_fonts():
    font_dir = Path("C:/Windows/Fonts")
    fonts = {
        "Resume-Regular": font_dir / "calibri.ttf",
        "Resume-Bold": font_dir / "calibrib.ttf",
        "Resume-Italic": font_dir / "calibrii.ttf",
    }

    for name, path in fonts.items():
        if path.exists():
            pdfmetrics.registerFont(TTFont(name, str(path)))

    if not fonts["Resume-Regular"].exists():
        return {
            "regular": "Helvetica",
            "bold": "Helvetica-Bold",
            "italic": "Helvetica-Oblique",
        }

    return {
        "regular": "Resume-Regular",
        "bold": "Resume-Bold" if fonts["Resume-Bold"].exists() else "Resume-Regular",
        "italic": "Resume-Italic" if fonts["Resume-Italic"].exists() else "Resume-Regular",
    }


FONTS = register_fonts()


def text_width(text, font_name, font_size):
    return pdfmetrics.stringWidth(text, font_name, font_size)


def draw_centered(c, text, y, font, size, color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawCentredString(PAGE_W / 2, y, text)


def draw_text(c, text, x, y, font, size, color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, text)


def wrap_to_width(text, font, size, max_width):
    words = text.split()
    lines = []
    current = ""

    for word in words:
        candidate = f"{current} {word}".strip()
        if text_width(candidate, font, size) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word

    if current:
        lines.append(current)

    return lines


def section(c, title, y):
    y -= 7
    draw_text(c, title.upper(), MARGIN_X, y, FONTS["bold"], 8.8, ACCENT)
    line_y = y - 2.5
    c.setStrokeColor(LINE)
    c.setLineWidth(0.65)
    c.line(MARGIN_X, line_y, PAGE_W - MARGIN_X, line_y)
    return y - 12


def paragraph(c, text, y, size=8.9, leading=10.4):
    for line in wrap_to_width(text, FONTS["regular"], size, CONTENT_W):
        draw_text(c, line, MARGIN_X, y, FONTS["regular"], size, MUTED)
        y -= leading
    return y


def right_text(c, text, y, font, size, color=MUTED):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawRightString(PAGE_W - MARGIN_X, y, text)


def entry(c, title, meta, tech, bullets, y):
    draw_text(c, title, MARGIN_X, y, FONTS["bold"], 9.15, INK)
    if meta:
        right_text(c, meta, y, FONTS["regular"], 8.2, MUTED)
    y -= 10.2

    if tech:
        draw_text(c, tech, MARGIN_X, y, FONTS["italic"], 8.25, MUTED)
        y -= 9.4

    for bullet in bullets:
        bullet_x = MARGIN_X + 8
        draw_text(c, "-", MARGIN_X, y, FONTS["regular"], 8.7, MUTED)
        for index, line in enumerate(wrap_to_width(bullet, FONTS["regular"], 8.7, CONTENT_W - 8)):
            draw_text(c, line, bullet_x, y, FONTS["regular"], 8.7, MUTED)
            y -= 9.6 if index == 0 else 9.2
    return y - 2.4


def compact_entry(c, title, meta, tech, bullet, y):
    draw_text(c, title, MARGIN_X, y, FONTS["bold"], 8.85, INK)
    if meta:
        right_text(c, meta, y, FONTS["regular"], 7.9, MUTED)
    y -= 9.2
    line = f"{tech}. {bullet}"
    for wrapped in wrap_to_width(line, FONTS["regular"], 8.35, CONTENT_W):
        draw_text(c, wrapped, MARGIN_X, y, FONTS["regular"], 8.35, MUTED)
        y -= 9.1
    return y - 1.5


def build_resume():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=letter)
    c.setTitle("Jemkirk L. Utana - Resume")
    c.setAuthor("Jemkirk L. Utana")
    c.setSubject("One-page full-stack web developer resume")
    c.setCreator("Jemkirk L. Utana Portfolio")

    y = TOP
    draw_centered(c, "JEMKIRK L. UTANA", y, FONTS["bold"], 18.7, INK)
    y -= 15.6
    draw_centered(c, "Full-Stack Web Developer | Web Developer | Graphic Designer", y, FONTS["regular"], 10.4, MUTED)
    y -= 12.0
    draw_centered(c, "Makati City, Philippines | 09924562100 | jemkirku0907@gmail.com", y, FONTS["regular"], 8.75, MUTED)
    y -= 10.3
    draw_centered(c, "jemkirk.vercel.app | linkedin.com/in/jemkirk-utana-825892420 | github.com/jemkirku0907", y, FONTS["regular"], 8.75, MUTED)

    y = section(c, "Professional Summary", y)
    y = paragraph(
        c,
        "BS Computer Science student and full-stack web developer building practical web apps with Next.js, React, Supabase, "
        "PostgreSQL, PHP/MySQL, Tailwind CSS, and Vercel. Experienced in dashboards, booking flows, admin tools, responsive UI, "
        "deployment checks, and AI-assisted product features.",
        y,
    )

    y = section(c, "Skills", y)
    skill_lines = [
        ("Frontend", "Next.js, React, TypeScript, JavaScript, Tailwind CSS, Bootstrap, responsive UI, dashboards"),
        ("Backend and Data", "Supabase, PostgreSQL, PHP, MySQL, Node.js, Express, REST APIs, authentication, CRUD systems"),
        ("Tools and Design", "Git, GitHub, Vercel, Cloudflare Turnstile, Figma, Adobe Photoshop, Adobe Illustrator, NC III Graphic Design"),
    ]
    for label, value in skill_lines:
        draw_text(c, f"{label}: ", MARGIN_X, y, FONTS["bold"], 8.45, INK)
        draw_text(c, value, MARGIN_X + text_width(f"{label}: ", FONTS["bold"], 8.45), y, FONTS["regular"], 8.45, MUTED)
        y -= 9.7

    y = section(c, "Experience", y + 1)
    y = entry(
        c,
        "Officium Inc. / Marajo Group - Web Developer Intern",
        "2026 - Present",
        "Next.js, React, Supabase, PostgreSQL, Vercel, Tailwind CSS",
        [
            "Develop and support production-facing web features across frontend and backend tasks, including dashboards, booking flows, responsive pages, and deployment checks.",
            "Handle layout refinements, integration tasks, and maintenance updates while gaining real-world full-stack development experience.",
        ],
        y,
    )

    y = section(c, "Selected Projects", y + 1)
    projects = [
        (
            "Marajo Group Real Estate Platform",
            "2026 - Present",
            "Next.js, Supabase, PostgreSQL, Vercel",
            "Built property listings, booking-system improvements, admin dashboard functionality, responsive UI updates, and deployment work.",
        ),
        (
            "PharSayo Medication Management PWA",
            "2026",
            "PWA, React, AI, Healthcare",
            "Created a barangay health medication tool with role-based access, medication scanning, adherence tracking, and dashboards.",
        ),
        (
            "Suri.AI Fact-Checking Platform",
            "2026",
            "Next.js, TypeScript, Node.js, Express, Anthropic API",
            "Built a hackathon prototype that checks submitted claims and surfaces credible or debunked article matches through an AI-assisted backend.",
        ),
        (
            "Personal Portfolio",
            "2026",
            "Next.js, TypeScript, Tailwind CSS, Vercel, Gemini API",
            "Developed a public portfolio with projects, certificates, resume access, GitHub activity, chatbot support, and a canvas mini game.",
        ),
        (
            "QUACC Child Care Center System",
            "2025",
            "PHP, MySQL, Bootstrap",
            "Implemented admin, staff, and guardian workflows with file uploads, password hashing, OTP verification, and backend CRUD functionality.",
        ),
        (
            "Assignify and BasuCash Web Apps",
            "2025 - 2026",
            "Task management, finance dashboard, web app",
            "Built focused dashboard concepts for tracking academic assignments, cash flow, expenses, and simple financial records.",
        ),
    ]
    for project in projects:
        y = compact_entry(c, *project, y)

    y = section(c, "Education", y + 1)
    y = compact_entry(
        c,
        "University of Makati - BS Computer Science",
        "2025 - 2029",
        "Makati City",
        "Coursework and portfolio work focused on full-stack web systems, databases, deployment, and practical software projects.",
        y,
    )
    y = compact_entry(
        c,
        "Makati High School - TVL ICT Programming",
        "2023 - 2025",
        "NC III Graphic Design",
        "Built a foundation in programming, interface work, visual layout, and computer systems.",
        y,
    )

    y = section(c, "Training and Certifications", y + 1)
    certs = (
        "NC III Graphic Design - TESDA, May 2025 | Microcadd / TESDA Graphic Design Training - April-May 2025 | "
        "Makati Health Department Work Immersion - March 2025 | Batang Techno Hackathon - Participant, March 2026 | "
        "AI Tech 2.0 - Participant, April 2026 | InfoTechnOlympics Web Design - Participant, October 2025"
    )
    y = paragraph(c, certs, y, size=8.35, leading=9.25)

    if y < BOTTOM:
        raise RuntimeError(f"Resume content overflowed page by {BOTTOM - y:.1f} points")

    c.showPage()
    c.save()


if __name__ == "__main__":
    build_resume()
