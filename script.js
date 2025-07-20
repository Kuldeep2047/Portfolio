// DOM Elements
const navbar = document.getElementById("navbar")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")
const themeToggle = document.getElementById("theme-toggle")
const backToTop = document.getElementById("back-to-top")
const downloadResumeBtn = document.getElementById("download-resume")

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme)
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i")
  icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon"
}

// Navigation
function toggleMobileMenu() {
  navMenu.classList.toggle("active")
  hamburger.classList.toggle("active")
}

function closeMobileMenu() {
  navMenu.classList.remove("active")
  hamburger.classList.remove("active")
}

// Smooth scrolling for navigation links
function handleNavClick(e) {
  if (e.target.classList.contains("nav-link")) {
    e.preventDefault()
    const targetId = e.target.getAttribute("href")
    const targetSection = document.querySelector(targetId)

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 70
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }

    closeMobileMenu()
  }
}

// Resume Download with better implementation
function handleResumeDownload() {
  // Show loading state
  const originalText = downloadResumeBtn.innerHTML
  downloadResumeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...'
  downloadResumeBtn.disabled = true

  // Simulate download preparation (you can replace this with actual file serving logic)
  setTimeout(() => {
    try {
      // Method 1: Direct download link (recommended)
      const resumeUrl = "assets/Kuldeep_Garg_Resume.pdf" // Make sure this file exists

      // Create temporary link
      const link = document.createElement("a")
      link.href = resumeUrl
      link.download = "Kuldeep_Garg_Resume.pdf"
      link.target = "_blank"

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showNotification("Resume download started successfully!", "success")
    } catch (error) {
      console.error("Download error:", error)

      // Fallback: Open Google Drive or cloud storage link
      const fallbackUrl = "https://drive.google.com/file/d/your-resume-file-id/view" // Replace with your actual resume link
      window.open(fallbackUrl, "_blank")

      showNotification("Opening resume in new tab...", "info")
    }

    // Reset button state
    downloadResumeBtn.innerHTML = originalText
    downloadResumeBtn.disabled = false
  }, 1000)
}

// Certificate Modal Functions
let currentCertificateUrl = ""

function viewCertificate(imagePath) {
  currentCertificateUrl = imagePath
  const modal = document.getElementById("certificate-modal")
  const certificateImage = document.getElementById("certificate-image")

  certificateImage.src = imagePath
  modal.style.display = "block"

  // Add fade-in animation
  setTimeout(() => {
    modal.style.opacity = "1"
  }, 10)
}

function closeCertificateModal() {
  const modal = document.getElementById("certificate-modal")
  modal.style.opacity = "0"

  setTimeout(() => {
    modal.style.display = "none"
  }, 300)
}

function downloadCertificate() {
  if (currentCertificateUrl) {
    const link = document.createElement("a")
    link.href = currentCertificateUrl
    link.download = currentCertificateUrl.split("/").pop()
    link.target = "_blank"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification("Certificate download started!", "success")
  }
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("certificate-modal")
  if (event.target === modal) {
    closeCertificateModal()
  }
}

// Scroll Effects
function handleScroll() {
  const scrollTop = window.pageYOffset

  // Navbar background
  if (scrollTop > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)"
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      navbar.style.background = "rgba(17, 24, 39, 0.98)"
    }
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)"
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      navbar.style.background = "rgba(17, 24, 39, 0.95)"
    }
  }

  // Back to top button
  if (scrollTop > 300) {
    backToTop.classList.add("visible")
  } else {
    backToTop.classList.remove("visible")
  }

  // Active navigation link
  updateActiveNavLink()

  // Animate elements on scroll
  animateOnScroll()
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight

    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
}

// Animation on Scroll
function animateOnScroll() {
  const elements = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("visible")
    }
  })
}

// Skills Animation
function animateSkills() {
  const skillBars = document.querySelectorAll(".skill-progress")

  skillBars.forEach((bar) => {
    const width = bar.getAttribute("data-width")
    const barTop = bar.getBoundingClientRect().top

    if (barTop < window.innerHeight - 100) {
      bar.style.width = width + "%"
    }
  })
}

// Enhanced Notification System
function showNotification(message, type = "success") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => {
    notification.remove()
  })

  const notification = document.createElement("div")
  notification.className = `notification ${type}`

  // Add icon based on type
  let icon = ""
  switch (type) {
    case "success":
      icon = '<i class="fas fa-check-circle"></i>'
      break
    case "error":
      icon = '<i class="fas fa-exclamation-circle"></i>'
      break
    case "info":
      icon = '<i class="fas fa-info-circle"></i>'
      break
    default:
      icon = '<i class="fas fa-bell"></i>'
  }

  notification.innerHTML = `${icon} <span>${message}</span>`

  // Add notification styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        ${
          type === "success"
            ? "background: linear-gradient(135deg, #10b981, #059669);"
            : type === "error"
              ? "background: linear-gradient(135deg, #ef4444, #dc2626);"
              : type === "info"
                ? "background: linear-gradient(135deg, #3b82f6, #2563eb);"
                : "background: linear-gradient(135deg, #6366f1, #4f46e5);"
        }
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 5000)
}

// Typing Animation for Hero Section
function typeWriter(element, text, speed = 100) {
  let i = 0
  element.innerHTML = ""

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }

  type()
}

// Parallax Effect
function handleParallax() {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll(".parallax")

  parallaxElements.forEach((element) => {
    const speed = element.dataset.speed || 0.5
    const yPos = -(scrolled * speed)
    element.style.transform = `translateY(${yPos}px)`
  })
}

// Initialize Animations
function initAnimations() {
  // Add animation classes to elements
  const aboutText = document.querySelector(".about-text")
  const aboutImage = document.querySelector(".about-image")
  const skillCategories = document.querySelectorAll(".skill-category")
  const projectCards = document.querySelectorAll(".project-card")
  const timelineItems = document.querySelectorAll(".timeline-item")
  const codingProfiles = document.querySelectorAll(".coding-profile")
  const achievementCards = document.querySelectorAll(".achievement-card")
  const certificationCards = document.querySelectorAll(".certification-card")

  if (aboutText) aboutText.classList.add("fade-in")
  if (aboutImage) aboutImage.classList.add("fade-in")

  skillCategories.forEach((category, index) => {
    category.classList.add("fade-in")
    category.style.animationDelay = `${index * 0.2}s`
  })

  projectCards.forEach((card, index) => {
    card.classList.add("fade-in")
    card.style.animationDelay = `${index * 0.1}s`
  })

  timelineItems.forEach((item, index) => {
    if (index % 2 === 0) {
      item.classList.add("slide-in-left")
    } else {
      item.classList.add("slide-in-right")
    }
  })

  codingProfiles.forEach((profile, index) => {
    profile.classList.add("fade-in")
    profile.style.animationDelay = `${index * 0.2}s`
  })

  achievementCards.forEach((card, index) => {
    card.classList.add("slide-in-right")
    card.style.animationDelay = `${index * 0.2}s`
  })

  certificationCards.forEach((card, index) => {
    card.classList.add("fade-in")
    card.style.animationDelay = `${index * 0.15}s`
  })
}

// Scroll to Top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}






























// Improved Competitive Programming Section (Static Data)
function initializeCodingProfiles() {
  // Since APIs might have CORS issues, we'll use static data that you can update manually
  const leetcodeData = {
    totalSolved: 250,
    ranking: "Top 15%",
    easySolved: 150,
    mediumSolved: 85,
    hardSolved: 15,
  }

  const codeforcesData = {
    rating: 1200,
    maxRating: 1350,
    rank: "Pupil",
    contests: [
      { name: "Codeforces Round #900", rank: 1250, change: 45 },
      { name: "Educational Round #155", rank: 980, change: 32 },
      { name: "Div. 2 Round #895", rank: 1580, change: -18 },
    ],
  }

  // Update LeetCode UI
  updateLeetCodeDisplay(leetcodeData)

  // Update Codeforces UI
  updateCodeforcesDisplay(codeforcesData)

  // Add success notification
  setTimeout(() => {
    showNotification("Coding profiles loaded successfully!", "success")
  }, 1000)
}

function updateLeetCodeDisplay(data) {
  // Update stats with animation
  animateCounter("lc-total-solved", data.totalSolved)
  document.getElementById("lc-ranking").textContent = data.ranking

  // Update problem counts
  animateCounter("easy-count", data.easySolved)
  animateCounter("medium-count", data.mediumSolved)
  animateCounter("hard-count", data.hardSolved)

  // Update progress bars with animation
  setTimeout(() => {
    const easyPercent = Math.min((data.easySolved / 800) * 100, 100)
    const mediumPercent = Math.min((data.mediumSolved / 1600) * 100, 100)
    const hardPercent = Math.min((data.hardSolved / 700) * 100, 100)

    document.getElementById("easy-progress").style.width = `${easyPercent}%`
    document.getElementById("medium-progress").style.width = `${mediumPercent}%`
    document.getElementById("hard-progress").style.width = `${hardPercent}%`
  }, 500)
}

function updateCodeforcesDisplay(data) {
  // Update stats with animation
  animateCounter("cf-rating", data.rating)
  animateCounter("cf-max-rating", data.maxRating)

  // Update rank
  const rankElement = document.getElementById("cf-rank")
  rankElement.className = `rank-badge ${data.rank.toLowerCase()}`
  rankElement.querySelector(".rank-title").textContent = data.rank

  // Update contests (already in HTML, but you can make it dynamic)
  // The contests are already displayed in the HTML for better performance
}

function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId)
  if (!element) return

  const startValue = 0
  const duration = 1000
  const startTime = performance.now()

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const currentValue = Math.floor(startValue + (targetValue - startValue) * progress)
    element.textContent = currentValue

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = targetValue
    }
  }

  requestAnimationFrame(updateCounter)
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  initTheme()
  initAnimations()
  initializeCodingProfiles()

  // Navigation events
  if (hamburger) hamburger.addEventListener("click", toggleMobileMenu)
  if (navMenu) navMenu.addEventListener("click", handleNavClick)
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme)
  if (backToTop) backToTop.addEventListener("click", scrollToTop)

  // Resume download event
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener("click", handleResumeDownload)
  }

  // Scroll events
  window.addEventListener("scroll", () => {
    handleScroll()
    animateSkills()
    handleParallax()
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (navMenu && hamburger && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobileMenu()
    }
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu()
      closeCertificateModal()
    }
  })

  // Initial scroll check
  handleScroll()
  animateOnScroll()
  animateSkills()
})

// Resize handler
window.addEventListener("resize", () => {
  closeMobileMenu()
})

// Smooth reveal animation for page load
window.addEventListener("load", () => {
  document.body.style.opacity = "1"

  // Trigger initial animations
  setTimeout(() => {
    animateOnScroll()
    animateSkills()
  }, 500)
})

// Add CSS for page load animation and enhanced styles
document.head.insertAdjacentHTML(
  "beforeend",
  `
    <style>
        body {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        
        .notification {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        
        .nav-link.active {
            color: var(--primary-color);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
        
        .modal {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal.show {
            opacity: 1;
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
        }
    </style>
`,
)
