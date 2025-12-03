document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('year').textContent = new Date().getFullYear()

  // Projects for Johnson Babarinde — replace live/repo URLs with your deployments
  const projects = [
    {
      id: 'p1',
      name: 'Login UI (Auth Demo)',
      desc: 'A clean, accessible login page demonstrating form validation, keyboard support, and progressive enhancement. Built with semantic HTML, CSS and JavaScript. Optionally connected to a mock auth service.',
      img: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=800&q=60&auto=format&fit=crop',
      live: '#',
      repo: '#',
      tech: ['HTML', 'CSS', 'JavaScript']
    },
    {
      id: 'p2',
      name: 'Landing Page (Marketing)',
      desc: 'A performant, responsive landing page with hero, features, pricing, and responsive imagery. Focus on typography, layout with CSS Grid/Flexbox, and optimized assets.',
      img: 'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?w=800&q=60&auto=format&fit=crop',
      live: '#',
      repo: '#',
      tech: ['HTML', 'CSS', 'JavaScript']
    },
    {
      id: 'p3',
      name: 'E‑commerce Website (Frontend)',
      desc: 'A complete e‑commerce frontend: product listing, product details, cart, and mock checkout flow. Emphasis on accessibility and responsive UX; implemented with vanilla JS and a React variant demonstration.',
      img: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=800&q=60&auto=format&fit=crop',
      live: '#',
      repo: '#',
      tech: ['HTML', 'CSS', 'JavaScript', 'React']
    }
  ]

  const grid = document.getElementById('projects-grid')
  grid.innerHTML = projects.map(p => `\
    <article class="project" data-id="${p.id}" tabindex="0" role="button" aria-label="Open details for ${p.name}">\
      <img src="${p.img}" alt="${p.name}" />\
      <h4>${p.name}</h4>\
      <p>${p.desc}</p>\
      <div class=\"tech\">${(p.tech||[]).map(t=>`<span class=\"tag\">${t}</span>`).join('')}</div>\
      <div class=\"links\">\
        <a href=\"${p.live}\" target=\"_blank\" rel=\"noopener noreferrer\">Live</a>\
        <a href=\"${p.repo}\" target=\"_blank\" rel=\"noopener noreferrer\">Repo</a>\
      </div>\
    </article>\
  `).join('')

  // Smooth scrolling for nav anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      const el = document.querySelector(href)
      if (el){
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })

  // small accessibility: ensure focus outlines when keyboard used
  function handleFirstTab(e){
    if (e.key === 'Tab') document.body.classList.add('show-focus')
  }
  window.addEventListener('keydown', handleFirstTab, { once: true })

  // Theme toggle: persists to localStorage
  const themeToggle = document.getElementById('theme-toggle')
  const currentTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  if (currentTheme === 'dark') document.documentElement.classList.add('dark')
  if (themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const isDark = document.documentElement.classList.toggle('dark')
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
      themeToggle.setAttribute('aria-pressed', isDark)
    })
    // set aria-pressed initial
    themeToggle.setAttribute('aria-pressed', document.documentElement.classList.contains('dark'))
  }

  // Modal dialog for project details (delegated)
  const modal = document.getElementById('modal')
  const modalContent = document.getElementById('modal-content')
  const mainContent = document.getElementById('main-content') || document.querySelector('main')
  let previouslyFocused = null
  let keydownHandler = null

  function trapFocus(container){
    const focusable = Array.from(container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
      .filter(el => el.offsetParent !== null)
    if (!focusable.length) return null
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    keydownHandler = function(e){
      if (e.key !== 'Tab') return
      if (e.shiftKey){
        if (document.activeElement === first){
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last){
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', keydownHandler)
    return { first, last }
  }

  function releaseFocus(){
    if (keydownHandler) document.removeEventListener('keydown', keydownHandler)
    keydownHandler = null
  }

  function openModal(project){
    if (!modal) return
    previouslyFocused = document.activeElement
    // build accessible content
    modalContent.innerHTML = `\
      <h3>${project.name}</h3>\
      <img src="${project.img}" alt="${project.name}" />\
      <p>${project.desc}</p>\
      <p class=\"tech\">${(project.tech||[]).map(t=>`<span class=\"tag\">${t}</span>`).join('')}</p>\
      <p><a href="${project.live}" target="_blank" rel="noopener">Live</a> | <a href="${project.repo}" target="_blank" rel="noopener">Repo</a></p>\
      <button id=\"modal-close\" class=\"btn\">Close</button>`

    // mark aria states
    modal.setAttribute('aria-hidden', 'false')
    if (mainContent) mainContent.setAttribute('aria-hidden', 'true')
    modal.classList.add('open')

    // focus management
    const trackers = trapFocus(modal)
    const focusTarget = (trackers && trackers.first) || modal.querySelector('#modal-close') || modal
    focusTarget && focusTarget.focus()
  }

  function closeModal(){
    if (!modal) return
    modal.classList.remove('open')
    modal.setAttribute('aria-hidden', 'true')
    if (mainContent) mainContent.setAttribute('aria-hidden', 'false')
    modalContent.innerHTML = ''
    releaseFocus()
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus()
  }

  if (modal){
    modal.addEventListener('click', (e)=>{
      if (e.target === modal || e.target.id === 'modal-close') closeModal()
    })
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeModal() })
    // support keyboard activation on project cards
    grid.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter' || e.key === ' ') {
        const article = e.target.closest('article.project')
        if (!article) return
        const id = article.getAttribute('data-id')
        const proj = projects.find(p=>p.id === id)
        if (proj){ e.preventDefault(); openModal(proj) }
      }
    })
  }

  // delegate clicks from project cards to open modal
  grid.addEventListener('click', (e)=>{
    const article = e.target.closest('article.project')
    if (!article) return
    const id = article.getAttribute('data-id')
    const proj = projects.find(p=>p.id === id)
    if (proj) openModal(proj)
  })

  // Formspree setup: allow easy configuration via data attribute or constant
  const FORMSPREE_ID = 'mwpgppjr' // Formspree form id set from user input
  const contactForm = document.querySelector('.contact-form')
  if (contactForm){
    const dataId = contactForm.dataset.formspreeId || ''
    const formId = dataId || FORMSPREE_ID
    if (formId){
      contactForm.action = `https://formspree.io/f/${formId}`
    } else {
      // leave placeholder action but clearly warn in console
      console.warn('Formspree form ID not set. To enable form submissions, set the form data-formspree-id attribute or edit FORMSPREE_ID in script.js')
    }

    // optional: client-side feedback
    contactForm.addEventListener('submit', (e)=>{
      // allow normal submit if action is configured
      if (!formId){
        e.preventDefault()
        alert('Contact form is not configured. Add your Formspree form id in the form data-formspree-id attribute or in script.js')
      }
    })
  }
  
  // Animations: reveal elements on scroll using IntersectionObserver
  const revealTargets = document.querySelectorAll('.reveal, .project')
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries, obs) =>{
      entries.forEach(entry =>{
        if (entry.isIntersecting){
          entry.target.classList.add('visible')
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    // add reveal class to hero text and project cards
    document.querySelectorAll('.hero h1, .hero p, .project').forEach((el, i)=>{
      el.classList.add('reveal')
      // stagger projects slightly
      if (el.classList.contains('project')) el.style.transitionDelay = (i * 80) + 'ms'
      io.observe(el)
    })
  } else {
    // fallback: make elements visible
    document.querySelectorAll('.reveal, .project').forEach(el=>el.classList.add('visible'))
  }

  // Linktree: configurable link (set here or use data attribute on links)
  const LINKTREE_URL = 'https://linktr.ee/babarindejohnson1' // e.g. 'https://linktr.ee/yourusername'
  const linkEls = document.querySelectorAll('#linktree-link, #linktree-profile')
  linkEls.forEach(el=>{
    // first check for a data attribute on the element, then the constant
    const dataUrl = el.dataset.linktreeUrl || ''
    const url = dataUrl || LINKTREE_URL || ''
    if (url){
      el.href = url
    } else {
      // if not configured, point to a placeholder and mark with a title
      el.href = 'https://linktr.ee/yourusername'
      el.title = 'Set your Linktree username in index.html or script.js'
      console.warn('Linktree URL not configured. Set data-linktree-url on the links or edit LINKTREE_URL in script.js')
    }
  })

  // Email link behavior: open Gmail compose for the visitor, with mailto fallback
  const emailLink = document.getElementById('email-link')
  if (emailLink){
    const to = 'babarindejohnson1@gmail.com'
    // optional: prefill subject/body template (URL-encoded)
    const subject = encodeURIComponent('Hello from your portfolio')
    const body = encodeURIComponent('Hi Johnson,%0A%0AI found your portfolio and would like to get in touch about...%0A%0ARegards,')
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`
    const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`

    emailLink.addEventListener('click', (e)=>{
      // open Gmail in new tab; if blocked, fallback to mailto which opens user's mail client
      e.preventDefault()
      const win = window.open(gmailUrl, '_blank')
      if (!win){
        // popup blocked — navigate to mailto so native mail client opens
        window.location.href = mailtoUrl
      }
    })
  }
})