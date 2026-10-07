/**
 * Portfolio Interactive Scripts
 * Author: Annapoorna Patil | Software Engineer & Data Scientist
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Night Mode / Theme Toggle Logic (System Preference + Manual Toggle)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const heroThemeToggleBtn = document.getElementById('hero-theme-toggle');
  const heroToggleIcon = document.getElementById('hero-toggle-icon');
  const heroToggleText = document.getElementById('hero-toggle-text');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  function updateThemeUI(isDark) {
    if (heroToggleIcon && heroToggleText) {
      heroToggleIcon.textContent = isDark ? '☀️' : '🌙';
      heroToggleText.textContent = isDark ? 'DAY MODE' : 'NIGHT MODE';
    }
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  function getCurrentTheme() {
    const explicitlySet = document.documentElement.getAttribute('data-theme');
    if (explicitlySet) {
      return explicitlySet;
    }
    return prefersDarkScheme.matches ? 'dark' : 'light';
  }

  function applyTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem('portfolio-theme', theme);
    }
    updateThemeUI(theme === 'dark');
  }

  // Initial Theme Initialization
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    applyTheme(savedTheme, false);
  } else {
    // If not manually stored, check default browser media query
    const initialTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    applyTheme(initialTheme, false);
  }

  // Handle Theme Toggle Action
  function toggleTheme() {
    const current = getCurrentTheme();
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (heroThemeToggleBtn) {
    heroThemeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Respond dynamically if user alters their OS / browser theme preference
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  // -------------------------------------------------------------------------
  // 2. Vertical Navigation Bar (Left Sidebar Drawer & Accessibility)
  // -------------------------------------------------------------------------
  const sidebar = document.getElementById('pixel-sidebar');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  function openSidebar() {
    if (sidebar) {
      sidebar.classList.add('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.add('visible');
      if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = window.innerWidth <= 992 ? 'hidden' : '';
    }
  }

  function closeSidebar() {
    if (sidebar) {
      sidebar.classList.remove('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('visible');
      if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      const isOpen = sidebar && sidebar.classList.contains('open');
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Close drawer when Escape key is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
      if (sidebarToggleBtn) sidebarToggleBtn.focus();
    }
  });

  // Close mobile sidebar upon clicking navigation links
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 3. Active Nav Link on Scroll (Scrollspy for Vertical Sidebar)
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function highlightCurrentSection() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        sidebarLinks.forEach((link) => {
          if (link.getAttribute('data-section') === sectionId || link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightCurrentSection);
  highlightCurrentSection();

  // -------------------------------------------------------------------------
  // 4. Interactive Retro Chat Terminal Assistant
  // -------------------------------------------------------------------------
  const chatForm = document.getElementById('chat-input-form');
  const chatInputField = document.getElementById('chat-input-field');
  const chatMessagesDisplay = document.getElementById('chat-messages-display');
  const quickChips = document.querySelectorAll('.quick-chip');

  function appendChatMessage(sender, text, isBot = false) {
    if (!chatMessagesDisplay) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isBot ? 'bot-message' : 'user-message'}`;

    const senderHeader = document.createElement('div');
    senderHeader.className = 'message-sender';
    senderHeader.textContent = sender;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;

    const timestampSpan = document.createElement('span');
    timestampSpan.className = 'message-timestamp';
    timestampSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.appendChild(senderHeader);
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timestampSpan);

    chatMessagesDisplay.appendChild(messageDiv);
    chatMessagesDisplay.scrollTop = chatMessagesDisplay.scrollHeight;
  }

  function generateBotResponse(userInput) {
    const query = userInput.toLowerCase();

    if (query.includes('skill') || query.includes('tech') || query.includes('language') || query.includes('stack')) {
      return "Annapoorna's core technical toolkit includes Unix / Linux architecture, Shell scripting, Python, C/C++, Data Science pipelines (Pandas & NumPy), SQL databases, and modern responsive Web Development.";
    } else if (query.includes('hackathon') || query.includes('sih') || query.includes('adhi tantra') || query.includes('competition')) {
      return "Annapoorna is a proven hackathon participant! She competed in the Smart India Internal Hackathon (SIH 2026) solving challenge statements, and the ADHI TANTRA 2k26 Hardware Hackathon prototyping embedded IoT systems.";
    } else if (query.includes('certif') || query.includes('unix') || query.includes('infosys') || query.includes('credential')) {
      return "She holds an official certification in 'Introduction to Unix' from Infosys Springboard (Issued October 6, 2026 by Satheesha B. Nanjappa, Senior VP Infosys Limited).";
    } else if (query.includes('college') || query.includes('education') || query.includes('degree') || query.includes('study')) {
      return "Annapoorna is pursuing her Bachelor of Engineering in Computer Science & Engineering (Data Science) at Adichunchanagiri Institute of Technology (AIT Chikkamagaluru).";
    } else if (query.includes('contact') || query.includes('email') || query.includes('hire') || query.includes('reach')) {
      return "You can get in touch with Annapoorna via the contact form located right below, or connect with her regarding internships and software opportunities in Chikkamagaluru / Karnataka, India!";
    } else if (query.includes('project') || query.includes('work')) {
      return "Her featured projects include Smart Problem Solving Prototypes (SIH 2026), Unix Shell & Automation Scripts, and Python Data Insights & Predictive Analytics.";
    } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      return "Greetings! I'm here to answer any questions about Annapoorna's software engineering journey, Unix skills, or hackathon achievements. What would you like to explore?";
    } else {
      return `Interesting question! Annapoorna is specializing in Software Engineering and Data Science at AIT. Feel free to explore her projects or shoot her a direct message through the contact section below!`;
    }
  }

  function handleUserChatSubmission(messageText) {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    // Display user message
    appendChatMessage('[VISITOR]:', trimmed, false);

    // Simulate retro bot typing delay
    setTimeout(() => {
      const botReply = generateBotResponse(trimmed);
      appendChatMessage('[ANNA_BOT]:', botReply, true);
    }, 450);
  }

  if (chatForm && chatInputField) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = chatInputField.value;
      chatInputField.value = '';
      handleUserChatSubmission(userText);
    });
  }

  // Quick suggestion chips
  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        handleUserChatSubmission(prompt);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 5. Contact Form Handling (Demonstration)
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formStatus) {
        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
        formStatus.style.display = 'block';
        formStatus.style.color = '#10b981';
        contactForm.reset();
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      }
    });
  }

  // -------------------------------------------------------------------------
  // Avatar Photo Toggle (About Me Section)
  // -------------------------------------------------------------------------
  const avatarDisplay = document.getElementById('about-avatar-display');
  const btnShowPixel = document.getElementById('btn-show-pixel');
  const btnShowReal = document.getElementById('btn-show-real');

  if (avatarDisplay && btnShowPixel && btnShowReal) {
    const PIXEL_SRC = 'pixel_avatar.jpg';
    const REAL_SRC  = 'Profilepic.jpeg';

    function setAvatar(src, activeBtn, inactiveBtn) {
      avatarDisplay.style.opacity = '0';
      setTimeout(() => {
        avatarDisplay.src = src;
        avatarDisplay.style.opacity = '1';
      }, 250);
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-pressed', 'true');
      inactiveBtn.classList.remove('active');
      inactiveBtn.setAttribute('aria-pressed', 'false');
    }

    btnShowPixel.addEventListener('click', () => {
      setAvatar(PIXEL_SRC, btnShowPixel, btnShowReal);
    });

    btnShowReal.addEventListener('click', () => {
      setAvatar(REAL_SRC, btnShowReal, btnShowPixel);
    });
  }

});
