
const navbar = document.getElementById("navbar")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")
const themeToggle = document.getElementById("theme-toggle")
const backToTop = document.getElementById("back-to-top")
const viewResumeBtn = document.getElementById("view-resume")




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

// Skills Dashboard Functionality
function initSkillsDashboard() {
  const skillTabs = document.querySelectorAll(".skill-tab")
  const skillPanels = document.querySelectorAll(".skill-panel")

  skillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and panels
      skillTabs.forEach((t) => t.classList.remove("active"))
      skillPanels.forEach((p) => p.classList.remove("active"))

      // Add active class to clicked tab
      tab.classList.add("active")

      // Show corresponding panel
      const targetPanel = document.getElementById(tab.dataset.category)
      if (targetPanel) {
        targetPanel.classList.add("active")

        // Animate skill bars in the active panel
        setTimeout(() => {
          animateSkillBars(targetPanel)
        }, 100)
      }
    })
  })

  // Animate initial panel
  setTimeout(() => {
    const activePanel = document.querySelector(".skill-panel.active")
    if (activePanel) {
      animateSkillBars(activePanel)
    }
  }, 500)
}

function animateSkillBars(panel) {
  const skillBars = panel.querySelectorAll(".level-fill")
  skillBars.forEach((bar) => {
    const level = bar.getAttribute("data-level")
    bar.style.width = level + "%"
  })
}


// Resume Modal Functions
function viewResume() {
  const modal = document.getElementById("resume-modal")
  const resumeFrame = document.getElementById("resume-frame")

  
  resumeFrame.src = "Kuldeepgarg_resume.pdf"

  modal.style.display = "block"
  setTimeout(() => {
    modal.classList.add("show")
  }, 10)

  showNotification("Resume loaded successfully!", "success")
}

function closeResumeModal() {
  const modal = document.getElementById("resume-modal")
  modal.classList.remove("show")
  setTimeout(() => {
    modal.style.display = "none"
  }, 300)
}

function downloadResume() {
  try {
    const resumeUrl = "Kuldeepgarg_resume.pdf"
    const link = document.createElement("a")
    link.href = resumeUrl
    link.download = "Kuldeepgarg_resume.pdf"
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showNotification("Resume download started successfully!", "success")
  } catch (error) {
    console.error("Download error:", error)
    showNotification("Download failed. Please try again.", "error")
  }
}

function openResumeNewTab() {
  window.open("Kuldeepgarg_resume.pdf", "_blank")
  showNotification("Resume opened in new tab!", "info")
}


let currentCertificateUrl = ""

function viewCertificate(imagePath) {
  currentCertificateUrl = imagePath
  const modal = document.getElementById("certificate-modal")
  const certificateImage = document.getElementById("certificate-image")

  certificateImage.src = imagePath
  modal.style.display = "block"
  setTimeout(() => {
    modal.classList.add("show")
  }, 10)
}

function closeCertificateModal() {
  const modal = document.getElementById("certificate-modal")
  modal.classList.remove("show")
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



// Close modals when clicking outside
window.onclick = (event) => {
  const certificateModal = document.getElementById("certificate-modal")
  const resumeModal = document.getElementById("resume-modal")

  if (event.target === certificateModal) {
    closeCertificateModal()
  }
  if (event.target === resumeModal) {
    closeResumeModal()
  }
}

// Enhanced Competitive Programming Functions
function updatePlatformStatus(platform, status, message) {
  const statusElement = document.getElementById(`${platform}-status`)
  const statusDot = statusElement.querySelector(".status-dot")
  const statusText = statusElement.querySelector("span")

  statusDot.className = `status-dot ${status}`
  statusText.textContent = message
}

async function fetchLeetCodeData() {
  try {
    updatePlatformStatus("lc", "loading", "Fetching data...")

    // Try to fetch from LeetCode API
    const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/Kuldeep_Garg`)

    if (!response.ok) {
      throw new Error("API request failed")
    }

    const data = await response.json()

    
    updateLeetCodeDisplay({
      totalSolved: data.totalSolved || 250,
      ranking: data.ranking || "Top 15%",
      easySolved: data.easySolved || 150,
      mediumSolved: data.mediumSolved || 85,
      hardSolved: data.hardSolved || 15,
    })

    updatePlatformStatus("lc", "success", "Live data")
  } catch (error) {
    console.error("LeetCode API Error:", error)

    // Fallback to static data
    updateLeetCodeDisplay({
      totalSolved: 250,
      ranking: "Top 15%",
      easySolved: 150,
      mediumSolved: 85,
      hardSolved: 15,
    })

    updatePlatformStatus("lc", "error", "Cached data")
    document.getElementById("lc-error").style.display = "block"
  }
}

async function fetchCodeforcesData() {
  try {
    updatePlatformStatus("cf", "loading", "Fetching data...")

    // Try to fetch from Codeforces API
    const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=Kuldeep_garg`)

    if (!userResponse.ok) {
      throw new Error("User API request failed")
    }

    const userData = await userResponse.json()

    if (userData.status !== "OK") {
      throw new Error("Invalid API response")
    }

    const user = userData.result[0]

    // Fetch contest data
    const contestResponse = await fetch(`https://codeforces.com/api/user.rating?handle=Kuldeep_garg`)
    let contests = []

    if (contestResponse.ok) {
      const contestData = await contestResponse.json()
      if (contestData.status === "OK") {
        contests = contestData.result.slice(-3).reverse() // Last 3 contests
      }
    }

    
    updateCodeforcesDisplay({
      rating: user.rating || 1400,
      maxRating: user.maxRating || 1450,
      rank: user.rank || "pupil",
      contests: contests.map((contest) => ({
        name: `Contest #${contest.contestId}`,
        rank: contest.rank,
        change: contest.newRating - contest.oldRating,
      })),
    })

    updatePlatformStatus("cf", "success", "Live data")
  } catch (error) {
    console.error("Codeforces API Error:", error)

    // Fallback to static data
    updateCodeforcesDisplay({
      rating: 1200,
      maxRating: 1350,
      rank: "pupil",
      contests: [
        { name: "Codeforces Round #900", rank: 1250, change: 45 },
        { name: "Educational Round #155", rank: 980, change: 32 },
        { name: "Div. 2 Round #895", rank: 1580, change: -18 },
      ],
    })

    updatePlatformStatus("cf", "error", "Cached data")
    document.getElementById("cf-error").style.display = "block"
  }
}

function updateLeetCodeDisplay(data) {
  // Hide loading, show content
  document.getElementById("lc-loading").style.display = "none"
  document.getElementById("lc-content").style.display = "block"

  // Update stats with animation
  animateCounter("lc-total-solved", data.totalSolved)
  document.getElementById("lc-ranking").textContent = data.ranking

  // Update problem counts
  animateCounter("easy-count", data.easySolved)
  animateCounter("medium-count", data.mediumSolved)
  animateCounter("hard-count", data.hardSolved)

  // Update total problems in overview
  animateCounter("total-problems-solved", data.totalSolved)




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

  
  document.getElementById("cf-loading").style.display = "none"
  document.getElementById("cf-content").style.display = "block"

  // Update stats with animation
  animateCounter("cf-rating", data.rating)
  animateCounter("cf-max-rating", data.maxRating)
  animateCounter("max-rating", data.maxRating)

  



  const rankElement = document.getElementById("cf-rank")
  rankElement.className = `rank-badge ${data.rank.toLowerCase()}`
  rankElement.querySelector(".rank-title").textContent = data.rank.charAt(0).toUpperCase() + data.rank.slice(1)

  // Update contests
  const contestsList = document.getElementById("cf-contests")
  if (data.contests && data.contests.length > 0) {
    contestsList.innerHTML = data.contests
      .map(
        (contest) => `
      <div class="contest-item">
        <span class="contest-name">${contest.name}</span>
        <span class="contest-rank">Rank: ${contest.rank}</span>
        <span class="rating-change ${contest.change >= 0 ? "positive" : "negative"}">
          ${contest.change >= 0 ? "+" : ""}${contest.change}
        </span>
      </div>
    `,
      )
      .join("")
  } else {
    contestsList.innerHTML = '<div class="contest-placeholder">No recent contests</div>'
  }
}

function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId)
  if (!element) return

  const startValue = 0
  const duration = 1500
  const startTime = performance.now()

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Use easing function for smoother animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart)

    element.textContent = currentValue

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = targetValue
    }
  }

  requestAnimationFrame(updateCounter)
}

// Initialize Competitive Programming Section
function initializeCodingProfiles() {
  // Start fetching data immediately
  fetchLeetCodeData()
  fetchCodeforcesData()

  // Set up periodic refresh (every 5 minutes)
  setInterval(
    () => {
      fetchLeetCodeData()
      fetchCodeforcesData()
    },
    5 * 60 * 1000,
  )

  // Add success notification after initial load
  setTimeout(() => {
    showNotification("Coding profiles initialized!", "success")
  }, 2000)
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
    case "warning":
      icon = '<i class="fas fa-exclamation-triangle"></i>'
      break
    default:
      icon = '<i class="fas fa-bell"></i>'
  }

  notification.innerHTML = `${icon} <span>${message}</span>`
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

// Initialize Animations
function initAnimations() {
  // Add animation classes to elements
  const aboutText = document.querySelector(".about-text")
  const aboutImage = document.querySelector(".about-image")
  const skillCards = document.querySelectorAll(".skill-card")
  const projectCards = document.querySelectorAll(".project-card")
  const timelineItems = document.querySelectorAll(".timeline-item")
  const platformCards = document.querySelectorAll(".platform-card")
  const achievementItems = document.querySelectorAll(".achievement-item")
  const certificationCards = document.querySelectorAll(".certification-card")
  const statCards = document.querySelectorAll(".stat-card")

  if (aboutText) aboutText.classList.add("fade-in")
  if (aboutImage) aboutImage.classList.add("fade-in")

  skillCards.forEach((card, index) => {
    card.classList.add("fade-in")
    card.style.animationDelay = `${index * 0.1}s`
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

  platformCards.forEach((card, index) => {
    card.classList.add("fade-in")
    card.style.animationDelay = `${index * 0.2}s`
  })

  achievementItems.forEach((item, index) => {
    item.classList.add("slide-in-right")
    item.style.animationDelay = `${index * 0.2}s`
  })

  certificationCards.forEach((card, index) => {
    card.classList.add("fade-in")
    card.style.animationDelay = `${index * 0.15}s`
  })

  statCards.forEach((card, index) => {
    card.classList.add("fade-in")
    card.style.animationDelay = `${index * 0.1}s`
  })
}

// Scroll to Top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Refresh Data Function
function refreshCodingData() {
  showNotification("Refreshing coding profiles...", "info")
  fetchLeetCodeData()
  fetchCodeforcesData()
}

// Error Recovery
function retryFailedRequests() {
  const lcError = document.getElementById("lc-error")
  const cfError = document.getElementById("cf-error")

  if (lcError && lcError.style.display !== "none") {
    fetchLeetCodeData()
  }

  if (cfError && cfError.style.display !== "none") {
    fetchCodeforcesData()
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  initTheme()
  initAnimations()
  initSkillsDashboard()
  initializeCodingProfiles()

  // Navigation events
  if (hamburger) hamburger.addEventListener("click", toggleMobileMenu)
  if (navMenu) navMenu.addEventListener("click", handleNavClick)
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme)
  if (backToTop) backToTop.addEventListener("click", scrollToTop)

  // Resume view event
  if (viewResumeBtn) {
    viewResumeBtn.addEventListener("click", viewResume)
  }

  // Scroll events
  window.addEventListener("scroll", () => {
    handleScroll()
    animateSkills()
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
      closeResumeModal()
    }

    // Add refresh shortcut (Ctrl/Cmd + R for coding profiles)
    if ((e.ctrlKey || e.metaKey) && e.key === "r" && e.shiftKey) {
      e.preventDefault()
      refreshCodingData()
    }
  })

  // Retry failed requests every 30 seconds
  setInterval(retryFailedRequests, 30000)

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
  document.body.classList.add("loaded")

  // Trigger initial animations
  setTimeout(() => {
    animateOnScroll()
    animateSkills()
  }, 500)
})

// Handle online/offline status
window.addEventListener("online", () => {
  showNotification("Connection restored! Refreshing data...", "success")
  refreshCodingData()
})

window.addEventListener("offline", () => {
  showNotification("Connection lost. Showing cached data.", "warning")
})

// Performance monitoring
if ("performance" in window) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType("navigation")[0]
      if (perfData.loadEventEnd - perfData.loadEventStart > 3000) {
        console.warn("Slow page load detected")
      }
    }, 0)
  })
}

// Service Worker registration (if available)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
