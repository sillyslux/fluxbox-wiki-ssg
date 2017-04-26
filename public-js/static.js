/* eslint-disable */
(function(w, d) {
  // preselect language for location /
  const availableLang = [ "de", "hr", "en", "it", "fi", "pt", "ru", "es", "kp", "fr" ]
  const browserLang = navigator.language.slice(0, 2)
  const lang = localStorage.getItem('lang') || (availableLang.includes(browserLang) ? browserLang : 'en')
  const prefixed = /^\/fluxbox-wiki\//.test(location.pathname)
  if (['/','/fluxbox-wiki/'].includes(location.pathname)) {
    location += `${lang}/`
  }

  // save current language to localStorage
  let currentLang = prefixed ? location.pathname.match(/^\/fluxbox-wiki\/(\w+)/) : location.pathname.match(/^\/(\w+)\//)
  currentLang = currentLang && currentLang[1]
  const regex = new RegExp(`^/[^/]+/(${availableLang.join('|')})/`)
  const pathdata = location.pathname.match(regex)
  if(pathdata) {
    localStorage.setItem('lang', pathdata[1])
  }

  const a = 'addEventListener'
  const q = 'querySelector'
  const qa = 'querySelectorAll'

  const [breadcrumbs, historyEl] = d[qa]('.subnav-pagetree, .subnav-history')
  const logo = d[q]('.navbar-header')
  const headroom = d[q]('.headroom-wrapper')
  const searchBtn = d[q]('.glyphicon-search')
  const searchInput = d[q]('#duck-search input')
  const goSearch = () => w.open(
    `https://duckduckgo.com/?q=site%3Awww.fluxbox-wiki.org%20${searchInput.value}`
  )
  const prefixLink=lnk=>`${linkPrefix}${lnk}`

  // add functionality
  new Headroom(headroom, {
    offset : 130,
    classes: {
      initial: "animated",
      pinned: "slideDown",
      unpinned: "slideUp"
    }
  }).init()

  w[a]('keydown', (evt) => {
    evt.target === searchInput && evt.keyCode === 13 && goSearch()
  })
  searchBtn && searchBtn[a]('click', () =>
    goSearch()
  )

    let visible = false
    document.querySelector('.navbar-header').addEventListener('mouseenter', () => {
      visible = true
      breadcrumbs&&breadcrumbs.classList.remove('slideUp')
      historyEl&&historyEl.classList.add('slideUp')
    })
    document.querySelector('.headroom .navbar-right').addEventListener('mouseenter', () => {
      visible = true
      historyEl&&historyEl.classList.remove('slideUp')
      breadcrumbs&&breadcrumbs.classList.add('slideUp')
    })
    document.querySelector('.subnav-pagetree')&&document.querySelector('.subnav-pagetree').addEventListener('mouseleave', () => {
      visible = false
      setTimeout(()=>{
        !visible&&breadcrumbs&&breadcrumbs.classList.add('slideUp')
      }, 500)
    })
    document.querySelector('.subnav-history')&&document.querySelector('.subnav-history').addEventListener('mouseleave', () => {
      visible = false
      setTimeout(()=>{
        !visible&&historyEl&&historyEl.classList.add('slideUp')
      }, 500)
    })

    const history = JSON.parse(window.sessionStorage.getItem('history')) || []
    if (
      !availableLang.includes(window.location.pathname)&&
      !availableLang.includes(`${window.location.pathname}/fluxbox-wiki`)
    )
    // debugger
    history.find(p=>p.path===location.pathname)||history.unshift({path: window.location.pathname, title: window.document.title.replace(/^Fluxbox Wiki \| /, '')})
    history.length=history.length>5?5:history.length
    window.sessionStorage.setItem('history', JSON.stringify(history))
    console.log(history)
    if(document.querySelector('.subnav-history .nav'))document.querySelector('.subnav-history .nav').innerHTML = history.map(p => `<li role="presentation" class=""><a href="${p.path}" role="menuitem" tabindex="-1">${p.title}</a></li>`).join('')

    const editorlnk = document.querySelector(`[href="${prefixLink('editor/')}"]`).addEventListener('click', evt => { evt.preventDefault();window.open(prefixLink('editor/'), '_blank', 'toolbar=no,menubar=no,titlebar=no,height=600,width=800')
    })
    document.querySelector('.glyphicon-search').addEventListener('click',function(){
      document.querySelector('#duck-search input').hasFocus||document.querySelector('#duck-search input').focus()})

})(window, document)
