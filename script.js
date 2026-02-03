const toggleButton = document.getElementById("theme-toggle");
const themeLabel = toggleButton.querySelector(".theme-label");
const navToggle = document.getElementById("nav-toggle");
const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".nav-links a");

const storedTheme = localStorage.getItem("theme");
if (storedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  themeLabel.textContent = "Dark";
}

const updateTheme = () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    themeLabel.textContent = "Light";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeLabel.textContent = "Dark";
  }
};

toggleButton.addEventListener("click", updateTheme);

const toggleNav = () => {
  const isOpen = header.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
};

navToggle.addEventListener("click", toggleNav);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (header.classList.contains("nav-open")) {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});


// Contact Form Handler
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Clear previous errors and status
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    formStatus.textContent = "";
    formStatus.className = "form-status";
    
    // Get form data
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim()
    };
    
    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach(field => {
        const errorEl = document.getElementById(`${field}-error`);
        if (errorEl) errorEl.textContent = errors[field];
      });
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formStatus.textContent = "Sending your message...";
    formStatus.className = "form-status loading";
    
    try {
      // Send to backend API
      const apiUrl = localStorage.getItem("apiUrl") || "http://localhost:8000/api";
      const response = await fetch(`${apiUrl}/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success
        formStatus.textContent = "✓ Message sent successfully! I'll get back to you soon.";
        formStatus.className = "form-status success";
        contactForm.reset();
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          formStatus.textContent = "";
        }, 5000);
      } else {
        // Server error
        formStatus.textContent = data.error || "Failed to send message. Please try again.";
        formStatus.className = "form-status error";
      }
    } catch (error) {
      console.error("Error:", error);
      formStatus.textContent = "Error sending message. Please check your connection and try again.";
      formStatus.className = "form-status error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

function validateForm(data) {
  const errors = {};
  
  if (!data.name || data.name.length < 2) {
    errors.name = "Please enter your full name (at least 2 characters)";
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }
  
  if (!data.subject || data.subject.length < 3) {
    errors.subject = "Please enter a subject (at least 3 characters)";
  }
  
  if (!data.message || data.message.length < 10) {
    errors.message = "Please enter a message (at least 10 characters)";
  }
  
  return errors;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

