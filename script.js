document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('year').textContent = new Date().getFullYear()

  // Typewriter effect for hero subtitle
  const typeEl = document.getElementById('typewriter')
  if (typeEl){
    const phrases = ['Frontend Developer', 'HTML, CSS & JavaScript Expert']
    let pi = 0, ci = 0, deleting = false
    function tick(){
      const target = phrases[pi]
      if (!deleting){
        ci++
        typeEl.textContent = target.slice(0, ci)
        if (ci === target.length){ deleting = true; setTimeout(tick, 1400); return }
      } else {
        ci--
        typeEl.textContent = target.slice(0, ci)
        if (ci === 0){ deleting = false; pi = (pi + 1) % phrases.length }
      }
      setTimeout(tick, deleting ? 50 : 90)
    }
    tick()
  }

  // Projects — add categories for filtering
  const projects = [
    { id: 'p1', name: 'Login UI (Auth Demo)', category: 'Web Apps',
      desc: 'Accessible login page with validation and keyboard support.',
      img: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=800&q=60&auto=format&fit=crop&fm=webp',
      live: '#', repo: '#', tech: ['HTML', 'CSS', 'JavaScript'] },
    { id: 'p2', name: 'Landing Page (Marketing)', category: 'Dashboards',
      desc: 'Responsive landing page with hero, features and optimized assets.',
      img: 'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?w=800&q=60&auto=format&fit=crop&fm=webp',
      live: '#', repo: '#', tech: ['HTML', 'CSS', 'JavaScript'] },
    { id: 'p3', name: 'E‑commerce Website (Frontend)', category: 'E-commerce',
      desc: 'Complete e‑commerce frontend with accessible, responsive UX.',
      img: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=800&q=60&auto=format&fit=crop&fm=webp',
      live: '#', repo: '#', tech: ['HTML', 'CSS', 'JavaScript', 'React'] },
    { id: 'p4', name: 'Apple Featured Dashboard', category: 'Dashboards',
      desc: 'Enterprise analytics dashboard with code splitting and lazy loading.',
      img: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=60&auto=format&fit=crop&fm=webp',
      live: '#', repo: '#', tech: ['React', 'TypeScript', 'Webpack'] },
    { id: 'p5', name: 'Netflix Streaming UI', category: 'Web Apps',
      desc: 'High-performance streaming UI with accessibility upgrades.',
      img: 'https://images.unsplash.com/photo-1516259760930-191f58b94f86?w=800&q=60&auto=format&fit=crop&fm=webp',
      live: '#', repo: '#', tech: ['React', 'Next.js', 'Cypress'] },
    { id: 'p6', name: 'Amazon Admin Portal', category: 'Web Apps',
      desc: 'Micro-frontend admin portal optimized for large-scale teams.',
      img: 'https://images.unsplash.com/photo-1558478551-1a3788d8cd32?w=800&q=60&auto=format&fit=crop&fm=webp',
      live: '#', repo: '#', tech: ['React', 'TypeScript', 'Testing Library'] },
  ]

  const grid = document.getElementById('projects-grid')
  const filterButtons = document.querySelectorAll('.filter-btn')
  function renderProjects(filter = 'All'){
    const list = filter === 'All' ? projects : projects.filter(p => p.category === filter)
    grid.innerHTML = list.map((p, i) => `\
      <article class="project reveal" data-id="${p.id}" tabindex="0" role="button" aria-label="Open details for ${p.name}" style="transition-delay:${i*60}ms">\
        <img src="${p.img}" alt="${p.name}" loading="lazy" />\
        <h4>${p.name}</h4>\
        <p>${p.desc}</p>\
        <div class=\"tech\">${(p.tech||[]).map(t=>`<span class=\"tag\">${t}</span>`).join('')}</div>\
        <div class=\"links\">\
          <a href=\"${p.live}\" target=\"_blank\" rel=\"noopener noreferrer\">Live Demo</a>\
          <a href=\"${p.repo}\" target=\"_blank\" rel=\"noopener noreferrer\">View Code</a>\
        </div>\
      </article>`).join('')
  }
  renderProjects('All')

  filterButtons.forEach(btn =>{
    btn.addEventListener('click', ()=>{
      filterButtons.forEach(b=>b.classList.remove('active'))
      btn.classList.add('active')
      renderProjects(btn.dataset.filter || 'All')
      // re-observe newly rendered cards
      observeReveals()
    })
  })

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

  // Mobile menu toggle
  const menuToggle = document.getElementById('mobile-menu-toggle')
  const mobileMenu = document.getElementById('mobile-menu')
  if (menuToggle && mobileMenu){
    menuToggle.addEventListener('click', ()=>{
      const open = mobileMenu.classList.toggle('open')
      menuToggle.setAttribute('aria-expanded', String(open))
    })
  }

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

    contactForm.addEventListener('submit', (e)=>{
      const status = document.querySelector('.form-status')
      // basic client validation
      const name = document.getElementById('name')
      const email = document.getElementById('email')
      const message = document.getElementById('message')
      if (!name.value || !email.value || !message.value){
        e.preventDefault(); status.textContent = 'Please fill out all fields.'; return
      }
      const validEmail = /.+@.+\..+/.test(email.value)
      if (!validEmail){ e.preventDefault(); status.textContent = 'Please enter a valid email.'; return }
      status.textContent = 'Sending…'
      // Allow normal submit to Formspree
      if (!formId){ e.preventDefault(); status.textContent = 'Form not configured.' }
    })
  }
  
  // Animations: reveal elements on scroll using IntersectionObserver
  function observeReveals(){
    const targets = document.querySelectorAll('.reveal, .project')
    if ('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries, obs) =>{
        entries.forEach(entry =>{
          if (entry.isIntersecting){
            entry.target.classList.add('visible')
            obs.unobserve(entry.target)
          }
        })
      }, { threshold: 0.12 })
      targets.forEach((el)=> io.observe(el))
    } else {
      targets.forEach(el=>el.classList.add('visible'))
    }
  }
  // Initial reveal setup
  document.querySelectorAll('.hero h1, .hero p, .skill-card, .timeline-item, .testimonial').forEach((el)=> el.classList.add('reveal'))
  observeReveals()

  // Skills bars animate on reveal
const skillBars = document.querySelectorAll('.bar');
if ('IntersectionObserver' in window) {
  const barObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = parseInt(entry.target.getAttribute('data-level') || '0', 10);
        const progress = entry.target.querySelector('.progress');
        if (progress) {
          progress.style.setProperty('--w', level + '%');
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  skillBars.forEach(bar => barObserver.observe(bar));
} else {
  // Fallback for browsers without IntersectionObserver
  skillBars.forEach(bar => {
    const level = parseInt(bar.getAttribute('data-level') || '0', 10);
    const progress = bar.querySelector('.progress');
    if (progress) progress.style.setProperty('--w', level + '%');
  });
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

  // Copy email to clipboard
  const copyBtn = document.querySelector('.copy-email')
  if (copyBtn){
    copyBtn.addEventListener('click', ()=>{
      const email = copyBtn.getAttribute('data-email') || 'babarindejohnson1@gmail.com'
      navigator.clipboard && navigator.clipboard.writeText(email).then(()=>{
        copyBtn.textContent = 'Copied!'
        setTimeout(()=> copyBtn.textContent = 'Copy', 1500)
      })
    })
  }

  // Back to top button
  const backToTop = document.getElementById('back-to-top')
  if (backToTop){
    window.addEventListener('scroll', ()=>{
      const show = window.scrollY > 400
      backToTop.classList.toggle('show', show)
    })
    backToTop.addEventListener('click', ()=> window.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  // Cookie consent
  const cookie = document.getElementById('cookie-consent')
  if (cookie){
    const accepted = localStorage.getItem('cookie-consent')
    if (!accepted){ cookie.classList.add('show'); cookie.setAttribute('aria-hidden','false') }
    cookie.querySelector('.accept')?.addEventListener('click', ()=>{ localStorage.setItem('cookie-consent','accepted'); cookie.classList.remove('show'); cookie.setAttribute('aria-hidden','true') })
    cookie.querySelector('.decline')?.addEventListener('click', ()=>{ localStorage.setItem('cookie-consent','declined'); cookie.classList.remove('show'); cookie.setAttribute('aria-hidden','true') })
  }

  // Page load progress indicator
  const progressBar = document.getElementById('progress-bar')
  if (progressBar){
    let w = 0
    const inc = setInterval(()=>{ w += Math.random()*20; progressBar.style.width = Math.min(100,w)+'%'; if (w >= 100){ clearInterval(inc); setTimeout(()=>{ progressBar.style.opacity='0' }, 300) } }, 180)
  }

  // Testimonials carousel controls
  const track = document.getElementById('carousel-track')
  const prev = document.querySelector('.carousel .prev')
  const next = document.querySelector('.carousel .next')
  let slide = 0
  function updateCarousel(){ track && (track.style.transform = `translateX(${-slide*33.33}%)`) }
  prev && prev.addEventListener('click', ()=>{ slide = Math.max(0, slide - 1); updateCarousel() })
  next && next.addEventListener('click', ()=>{ slide = Math.min(2, slide + 1); updateCarousel() })

  // Parallax on hero particles
  const particles = document.querySelector('.particles')
  if (particles){
    document.addEventListener('mousemove', (e)=>{
      const x = (e.clientX / window.innerWidth - 0.5) * 10
      const y = (e.clientY / window.innerHeight - 0.5) * 10
      particles.style.transform = `translate(${x}px, ${y}px)`
    })
  }

  // Resume download handler
  const resumeBtn = document.getElementById('download-resume')
  if (resumeBtn){
    resumeBtn.addEventListener('click', (e)=>{
      e.preventDefault()
      const url = 'assets/Johnson_Babarinde_Resume.pdf'
      fetch(url, { method: 'HEAD' }).then(res=>{
        if (res.ok){ window.open(url, '_blank') }
        else { alert('Resume not found. Place your PDF at assets/Johnson_Babarinde_Resume.pdf') }
      }).catch(()=> alert('Resume not found. Place your PDF at assets/Johnson_Babarinde_Resume.pdf'))
    })
  }
})
