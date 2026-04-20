function initAnimations() {
  const els = document.querySelectorAll('.afu');
  if (!els.length) return;
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.animationPlayState = 'running';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => { el.style.animationPlayState = 'paused'; obs.observe(el); });
  } else {
    els.forEach(el => { el.style.opacity = '1'; });
  }
}

/* ── 2. localStorage user store helpers ──────────────────────── */
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('cinescope_users')) || {};
  } catch (e) {
    return {};
  }
}
function saveUsers(users) {
  localStorage.setItem('cinescope_users', JSON.stringify(users));
}

/* ── 3. Shared validation helpers ────────────────────────────── */
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
function setError(inputId, msgId, message) {
  const inp = document.getElementById(inputId);
  const msg = document.getElementById(msgId);
  if (!inp || !msg) return;
  inp.classList.add('error');
  msg.textContent = message;
  msg.classList.add('show');
}
function clearError(inputId, msgId) {
  const inp = document.getElementById(inputId);
  const msg = document.getElementById(msgId);
  if (!inp || !msg) return;
  inp.classList.remove('error');
  msg.classList.remove('show');
}
function showSuccess(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
}
function hideSuccess(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

/* ── 4. SIGNUP form ──────────────────────────────────────────── */
function initSignup() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    hideSuccess('signupSuccess');

    const username = document.getElementById('signupUsername').value.trim();
    const email    = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    clearError('signupUsername', 'errUsername');
    if (!username) {
      setError('signupUsername', 'errUsername', 'Username is required.');
      valid = false;
    } else if (username.length < 3) {
      setError('signupUsername', 'errUsername', 'Username must be at least 3 characters.');
      valid = false;
    }

    clearError('signupEmail', 'errSignupEmail');
    if (!email) {
      setError('signupEmail', 'errSignupEmail', 'Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setError('signupEmail', 'errSignupEmail', 'Please enter a valid email address.');
      valid = false;
    } else {
      const users = getUsers();
      if (users[email]) {
        setError('signupEmail', 'errSignupEmail', 'An account with this email already exists.');
        valid = false;
      }
    }

    clearError('signupPassword', 'errSignupPassword');
    if (!password) {
      setError('signupPassword', 'errSignupPassword', 'Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setError('signupPassword', 'errSignupPassword', 'Password must be at least 6 characters.');
      valid = false;
    }

    if (valid) {
      const users = getUsers();
      users[email] = { username, password };
      saveUsers(users);
      showSuccess('signupSuccess', 'Account created successfully! You can now log in.');
      form.reset();
    }
  });

  ['signupUsername', 'signupEmail', 'signupPassword'].forEach(id => {
    const el = document.getElementById(id);
    const errMap = { signupUsername: 'errUsername', signupEmail: 'errSignupEmail', signupPassword: 'errSignupPassword' };
    if (el) el.addEventListener('input', () => clearError(id, errMap[id]));
  });
}

/* ── 5. LOGIN form ───────────────────────────────────────────── */
function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    hideSuccess('loginSuccess');

    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    clearError('loginEmail', 'errLoginEmail');
    if (!email) {
      setError('loginEmail', 'errLoginEmail', 'Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setError('loginEmail', 'errLoginEmail', 'Please enter a valid email address.');
      valid = false;
    }

    clearError('loginPassword', 'errLoginPassword');
    if (!password) {
      setError('loginPassword', 'errLoginPassword', 'Password is required.');
      valid = false;
    }

    if (valid) {
      const users = getUsers();
      const user  = users[email];
      if (!user) {
        setError('loginEmail', 'errLoginEmail', 'No account found with this email.');
      } else if (user.password !== password) {
        setError('loginPassword', 'errLoginPassword', 'Incorrect password.');
      } else {
        showSuccess('loginSuccess', 'Welcome back, ' + user.username + '! Login successful.');
        form.reset();
      }
    }
  });

  ['loginEmail', 'loginPassword'].forEach(id => {
    const el = document.getElementById(id);
    const errMap = { loginEmail: 'errLoginEmail', loginPassword: 'errLoginPassword' };
    if (el) el.addEventListener('input', () => clearError(id, errMap[id]));
  });
}

/* ── 6. CONTACT form ─────────────────────────────────────────── */
function initContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    hideSuccess('contactSuccess');

    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    clearError('contactName', 'errContactName');
    if (!name) { setError('contactName', 'errContactName', 'Your name is required.'); valid = false; }

    clearError('contactEmail', 'errContactEmail');
    if (!email) {
      setError('contactEmail', 'errContactEmail', 'Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setError('contactEmail', 'errContactEmail', 'Please enter a valid email address.');
      valid = false;
    }

    clearError('contactMessage', 'errContactMessage');
    if (!message) {
      setError('contactMessage', 'errContactMessage', 'Message cannot be empty.');
      valid = false;
    } else if (message.length < 10) {
      setError('contactMessage', 'errContactMessage', 'Message must be at least 10 characters.');
      valid = false;
    }

    if (valid) {
      showSuccess('contactSuccess', "Thanks, " + name + "! Your message has been received. We'll be in touch soon.");
      form.reset();
    }
  });

  ['contactName', 'contactEmail', 'contactMessage'].forEach(id => {
    const el = document.getElementById(id);
    const errMap = { contactName: 'errContactName', contactEmail: 'errContactEmail', contactMessage: 'errContactMessage' };
    if (el) el.addEventListener('input', () => clearError(id, errMap[id]));
  });
}

/* ── 7. MOVIES page — search / genre filter ──────────────────── */
function initMoviesFilter() {
  const searchEl = document.getElementById('searchInput');
  const genreEl  = document.getElementById('genreFilter');
  const countEl  = document.getElementById('resultCount');
  if (!searchEl && !genreEl) return;

  function filter() {
    const q = searchEl ? searchEl.value.toLowerCase() : '';
    const g = genreEl  ? genreEl.value : '';
    const items = document.querySelectorAll('.movie-item');
    let n = 0;
    items.forEach(item => {
      const title = (item.dataset.title || '').toLowerCase();
      const genre = (item.dataset.genre || '');
      const show  = (!q || title.includes(q)) && (!g || genre === g);
      item.style.display = show ? '' : 'none';
      if (show) n++;
    });
    if (countEl) countEl.textContent = n;
    const noRes = document.getElementById('noResults');
    if (noRes) noRes.style.display = n === 0 ? 'block' : 'none';
  }

  if (searchEl) searchEl.addEventListener('input', filter);
  if (genreEl)  genreEl.addEventListener('change', filter);

  const clearBtn = document.getElementById('clearFilters');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (searchEl) searchEl.value = '';
    if (genreEl)  genreEl.value  = '';
    filter();
  });
}

/* ── 8. DETAILS page — movie data & switcher ─────────────────── */
const MOVIES = {
  spiderverse: {
    title: 'Spider-Man: Across the Spider-Verse',
    year: '2023', genre: 'Animation / Action', genreFull: 'Animation / Action / Adventure',
    rating: '8.6', stars: '★★★★★', runtime: '140 min',
    director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
    studio: 'Sony Pictures Animation',
    desc: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    poster: 'images/spiderverse.jpg',
    trailer: 'https://www.youtube.com/embed/cqGjhVJWtEg'
  },
  eeaao: {
    title: 'Everything Everywhere All at Once',
    year: '2022', genre: 'Sci-Fi / Comedy', genreFull: 'Sci-Fi / Comedy / Drama',
    rating: '7.8', stars: '★★★★☆', runtime: '139 min',
    director: 'Daniel Kwan, Daniel Scheinert', studio: 'A24',
    desc: 'An aging Chinese immigrant is swept up in an adventure where she alone can save existence by exploring other universes and connecting with the lives she could have led.',
    poster: 'images/eeaao.jpg',
    trailer: 'https://www.youtube.com/embed/wxN1T1uxQ2g'
  },
  topgun: {
    title: 'Top Gun: Maverick',
    year: '2022', genre: 'Action / Drama', genreFull: 'Action / Drama / Thriller',
    rating: '8.3', stars: '★★★★★', runtime: '130 min',
    director: 'Joseph Kosinski', studio: 'Paramount Pictures',
    desc: 'After more than thirty years of service as one of the Navy\'s top aviators, Pete "Maverick" Mitchell is back, pushing the limits as a courageous test pilot while training a new generation of graduates.',
    poster: 'images/topgun.jpg',
    trailer: 'https://www.youtube.com/embed/giXco2jaZ_4'
  },
  dune: {
    title: 'Dune',
    year: '2021', genre: 'Sci-Fi / Epic', genreFull: 'Sci-Fi / Adventure / Drama',
    rating: '8.0', stars: '★★★★☆', runtime: '155 min',
    director: 'Denis Villeneuve', studio: 'Warner Bros. Pictures',
    desc: 'A noble family becomes embroiled in a war for the universe\'s most valuable resource — a spice found only on one of the most dangerous planets in existence.',
    poster: 'images/dune.jpg',
    trailer: 'https://www.youtube.com/embed/8g18jFHCLXk'
  },
  interstellar: {
    title: 'Interstellar',
    year: '2014', genre: 'Sci-Fi / Drama', genreFull: 'Sci-Fi / Adventure / Drama',
    rating: '8.7', stars: '★★★★★', runtime: '169 min',
    director: 'Christopher Nolan', studio: 'Warner Bros. Pictures',
    desc: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival as Earth faces environmental collapse.',
    poster: 'images/interstellar.jpg',
    trailer: 'https://www.youtube.com/embed/zSWdZVtXT7E'
  },
  inception: {
    title: 'Inception',
    year: '2010', genre: 'Sci-Fi / Thriller', genreFull: 'Sci-Fi / Thriller / Action',
    rating: '8.8', stars: '★★★★★', runtime: '148 min',
    director: 'Christopher Nolan', studio: 'Warner Bros. Pictures',
    desc: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster: 'images/inception.jpg',
    trailer: 'https://www.youtube.com/embed/YoHD9XEInc0'
  },
  darkknight: {
    title: 'The Dark Knight',
    year: '2008', genre: 'Action / Crime', genreFull: 'Action / Crime / Drama',
    rating: '9.0', stars: '★★★★★', runtime: '152 min',
    director: 'Christopher Nolan', studio: 'Warner Bros. Pictures',
    desc: 'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster: 'images/darkknight.jpg',
    trailer: 'https://www.youtube.com/embed/EXeTwQWrcwY'
  },
  endgame: {
    title: 'Avengers: Endgame',
    year: '2019', genre: 'Action / Superhero', genreFull: 'Action / Superhero / Sci-Fi',
    rating: '8.4', stars: '★★★★★', runtime: '181 min',
    director: 'Anthony & Joe Russo', studio: 'Marvel Studios',
    desc: 'After the devastating events of Infinity War, the Avengers assemble once more to undo Thanos\' actions and restore balance to the universe.',
    poster: 'images/endgame.jpg',
    trailer: 'https://www.youtube.com/embed/TcMBFSGVi1c'
  },
  joker: {
    title: 'Joker',
    year: '2019', genre: 'Drama / Thriller', genreFull: 'Drama / Psychological Thriller',
    rating: '8.4', stars: '★★★★★', runtime: '122 min',
    director: 'Todd Phillips', studio: 'Warner Bros. Pictures',
    desc: 'A mentally troubled standalone comedian embarks on a downward spiral of revolution and crime when Gotham City rejects him and treats him as invisible.',
    poster: 'images/joker.jpg',
    trailer: 'https://www.youtube.com/embed/zAGVQLHvwOY'
  },
  matrix: {
    title: 'The Matrix',
    year: '1999', genre: 'Sci-Fi / Action', genreFull: 'Sci-Fi / Action / Thriller',
    rating: '8.7', stars: '★★★★★', runtime: '136 min',
    director: 'The Wachowskis', studio: 'Warner Bros. Pictures',
    desc: 'A computer hacker learns from mysterious rebels that the world he lives in is a simulated reality, and joins their fight against its machine controllers.',
    poster: 'images/matrix.jpg',
    trailer: 'https://www.youtube.com/embed/vKQi3bBA1y8'
  }
};

function loadMovie(key) {
  const m = MOVIES[key];
  if (!m) return;
  const set     = (id, val)       => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setAttr = (id, attr, val) => { const el = document.getElementById(id); if (el) el[attr] = val; };
  setAttr('moviePoster', 'src', m.poster);
  setAttr('moviePoster', 'alt', m.title);
  set('movieTitle',   m.title);
  set('movieDesc',    m.desc);
  set('pillYear',     m.year);
  set('pillGenre',    m.genre);
  set('pillRating',   '★ ' + m.rating);
  set('pillRuntime',  m.runtime);
  set('infoDirector', m.director);
  set('infoYear',     m.year);
  set('infoGenre',    m.genreFull);
  set('infoStars',    m.stars);
  set('infoRating',   m.rating + ' / 10');
  set('infoRuntime',  m.runtime);
  set('infoStudio',   m.studio);
  setAttr('trailerFrame', 'src', m.trailer);
  set('trailerTitle', m.title);
  set('bcMovie',      m.title);
  document.title = 'CineScope — ' + m.title;
  document.querySelectorAll('.movie-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.key === key);
  });
}

function initDetails() {
  if (!document.getElementById('movieTitle')) return;
  document.querySelectorAll('.movie-pill').forEach(btn => {
    btn.addEventListener('click', () => loadMovie(btn.dataset.key));
  });
  const params = new URLSearchParams(window.location.search);
  const key = params.get('movie') || 'spiderverse';
  loadMovie(key);
  const scrollBtn = document.getElementById('scrollTrailer');
  if (scrollBtn) scrollBtn.addEventListener('click', () => {
    document.getElementById('trailerSection').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ── 9. Boot ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initAnimations();
  initSignup();
  initLogin();
  initContact();
  initMoviesFilter();
  initDetails();
});
