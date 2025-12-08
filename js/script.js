(function () {
    //Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (!href || href === '#' || href.length < 2) return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    //Dark mode toggle
    var STORAGE_KEY = 'pref-theme';
    var html = document.documentElement;
    var btn = document.querySelector('.theme-toggle');

    function systemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function apply(theme) {
        if (theme === 'dark') html.setAttribute('data-theme', 'dark');
        else html.removeAttribute('data-theme'); // fallback to light vars
        if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    var saved = localStorage.getItem(STORAGE_KEY);
    apply(saved || systemTheme());

    if (btn) {
        btn.addEventListener('click', function () {
            var current = html.getAttribute('data-theme') ? 'dark' : 'light';
            var next = current === 'dark' ? 'light' : 'dark';
            apply(next);
            localStorage.setItem(STORAGE_KEY, next);
        });


    //Simple project filter
        var FILTER_KEY = 'pref-filter';
        var filterWrap = document.querySelector('.filter');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
        var emptyMsg = document.getElementById('empty-projects');
        var cardsWrap = document.getElementById('project-cards');
        var sortSelect = document.getElementById('sort-projects');
        var originalOrder = cards.slice();

        function setActive(filter) {
            if (!filterWrap) return;
            filterWrap.querySelectorAll('[data-filter]').forEach(function (b) {
                b.classList.toggle('active', b.getAttribute('data-filter') === filter);
            });
        }


        function applyFilter(filter) {
            var visible = 0;
            cards.forEach(function (card) {
                var cat = card.getAttribute('data-category');
                var match = (filter === 'all') || (cat === filter);
                card.style.display = match ? '' : 'none';
                if (match) visible++;
            });
            if (emptyMsg) emptyMsg.hidden = visible !== 0;
            setActive(filter);
            localStorage.setItem(FILTER_KEY, filter);
        }


        if (filterWrap) {
            filterWrap.addEventListener('click', function (e) {
                var t = e.target;
                if (!(t instanceof HTMLElement)) return;
                var f = t.getAttribute('data-filter');
                if (!f) return;
                applyFilter(f);
            });
            var initial = localStorage.getItem(FILTER_KEY) || 'all';
            applyFilter(initial);
        }

        //sorting by year
        if (sortSelect && cardsWrap) {
            sortSelect.addEventListener('change', function () {
                var value = sortSelect.value;
                var sorted = cards.slice();

                if (value === 'newest') {
                    sorted.sort(function (a, b) {
                        var ya = parseInt(a.getAttribute('data-year') || '0', 10);
                        var yb = parseInt(b.getAttribute('data-year') || '0', 10);
                        return yb - ya; // bigger year first
                    });
                } else if (value === 'oldest') {
                    sorted.sort(function (a, b) {
                        var ya = parseInt(a.getAttribute('data-year') || '0', 10);
                        var yb = parseInt(b.getAttribute('data-year') || '0', 10);
                        return ya - yb;
                    });
                } else {
                    sorted = originalOrder;
                }
                sorted.forEach(function (card) {
                    cardsWrap.appendChild(card);
                });
            });
        }

    }

    var search = document.getElementById('project-search');
    function applySearch(){
        var q = (search.value || '').trim().toLowerCase();
        var visible = 0;
        cards.forEach(function(card){
            var text = card.textContent.toLowerCase();
            var match = text.indexOf(q) !== -1 && card.style.display !== 'none'; // respect filter
            card.style.opacity = match ? '' : '0.25';
            card.style.pointerEvents = match ? '' : 'none';
            if (match) visible++;
        });
        if (emptyMsg) emptyMsg.hidden = visible !== 0 || (q.length>0); // show empty only if filter hides all (not when just dimmed)
    }
    if (search) {
        search.addEventListener('input', applySearch);
    }


    //form validation + success message
    var form = document.querySelector('.contact-form');
    if (form) {
        var nameI = document.getElementById('name');
        var emailI = document.getElementById('email');
        var msgI = document.getElementById('message');
        var nameE = document.getElementById('name-error');
        var emailE = document.getElementById('email-error');
        var msgE = document.getElementById('message-error');
        var ok = document.getElementById('form-success');


        function show(el, showIt) { if (el) el.hidden = !showIt; }


        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var hasErr = false;
            var name = (nameI && nameI.value.trim()) || '';
            var email = (emailI && emailI.value.trim()) || '';
            var msg = (msgI && msgI.value.trim()) || '';


            if (nameE) show(nameE, !name);
            if (emailE) show(emailE, !/^\S+@\S+\.\S+$/.test(email));
            if (msgE) show(msgE, !msg);


            hasErr = (!name) || (!/^\S+@\S+\.\S+$/.test(email)) || (!msg);
            if (ok) show(ok, !hasErr);
            if (!hasErr) form.reset();
        });
    }

    // Greeting + remember visitor name + edit button
    (function greetingWithName() {
        var greetEl = document.getElementById('greeting');
        var nameInput = document.getElementById('visitor-name');
        var editBtn = document.getElementById('edit-name-btn');
        if (!greetEl) return;

        var KEY = 'visitor-name';

        function partOfDay() {
            var h = new Date().getHours();
            return h < 12 ? 'morning' : (h < 18 ? 'afternoon' : 'evening');
        }

        function renderGreeting(name) {
            var base = 'Good ' + partOfDay();
            if (name && name.trim()) {
                greetEl.textContent = base + ', ' + name.trim() + '!';
            } else {
                greetEl.textContent = base + '!';
            }
        }

        function hideNameInput() {
            if (!nameInput) return;
            var wrap = nameInput.closest('.name-input');
            if (wrap) wrap.style.display = 'none';
            if (editBtn) editBtn.hidden = false;
        }

        function showNameInput() {
            if (!nameInput) return;
            var wrap = nameInput.closest('.name-input');
            if (wrap) wrap.style.display = '';
            if (editBtn) editBtn.hidden = true;
            nameInput.focus();
        }

        var stored = localStorage.getItem(KEY) || '';

        if (nameInput && stored) {
            nameInput.value = stored;
            hideNameInput();
        }

        renderGreeting(stored);

        if (nameInput) {
            function handleChange() {
                var name = (nameInput.value || '').trim();
                localStorage.setItem(KEY, name);
                renderGreeting(name);

                if (name) {
                    hideNameInput();
                } else {
                    showNameInput();
                }
            }

            nameInput.addEventListener('blur', handleChange);
            nameInput.addEventListener('change', handleChange);

            nameInput.addEventListener('input', function () {
                renderGreeting(nameInput.value);
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', function () {
                showNameInput();
            });
        }
    })();





    //Inspirational Quote from ZenQuotes
    (function loadZenQuote() {
        const card = document.getElementById('quote');
        const textEl = document.getElementById('t3-quote');
        const authorEl = document.getElementById('t3-author');
        if (!card || !textEl || !authorEl) return;

        async function fetchQuote() {
            try {
                const url = 'https://zenquotes.io/api/today';
                const proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
                const res = await fetch(proxy);
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const data = await res.json();
                textEl.textContent = '“' + data[0].q + '”';
                authorEl.textContent = '— ' + data[0].a;
            } catch (err) {
                textEl.textContent = '“The best time to start is now.”';
                authorEl.textContent = '— Unknown (offline mode)';
            } finally {
                card.classList.add('show');
            }
        }
        fetchQuote();
    })();

    // Latest GitHub repositories
    (function loadGitHubRepos() {
        var list = document.getElementById('github-repos');
        var errorEl = document.getElementById('github-error');
        if (!list) return;

        async function fetchRepos() {
            list.innerHTML = '<li class="small">Loading repositories…</li>';
            if (errorEl) errorEl.hidden = true;

            try {
                var res = await fetch('https://api.github.com/users/LujainKfupm/repos?sort=updated&per_page=5');

                if (!res.ok) {
                    throw new Error('HTTP ' + res.status);
                }

                var data = await res.json();

                if (!Array.isArray(data) || data.length === 0) {
                    list.innerHTML = '<li class="small">No public repositories found.</li>';
                    return;
                }

                list.innerHTML = '';

                data.forEach(function (repo) {
                    var li = document.createElement('li');
                    li.innerHTML =
                        '<a href="' + repo.html_url + '" target="_blank" rel="noopener noreferrer">' +
                        repo.name +
                        '</a>' +
                        (repo.description ? '<p class="small">' + repo.description + '</p>' : '');
                    list.appendChild(li);
                });
            } catch (err) {
                console.error('GitHub fetch error', err);
                list.innerHTML = '';
                if (errorEl) {
                    errorEl.hidden = false;
                } else {
                    list.innerHTML = '<li class="small">Could not load repositories.</li>';
                }
            }
        }

        fetchRepos();
    })();


})();
