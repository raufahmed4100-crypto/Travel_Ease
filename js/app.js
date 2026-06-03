/* TravelEase shared interactions: filters, modals, storage, counters and UI polish. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const destinations = [
  { name: 'Aurora Fjords', region: 'Europe', mood: 'nature', price: '$3,200', img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80', desc: 'Private glass-cabin cruises, chef-led Nordic tastings and midnight-sun photography routes.' },
  { name: 'Velvet Kyoto', region: 'Asia', mood: 'culture', price: '$2,850', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80', desc: 'A refined journey through hidden tea houses, ryokan spas and lantern-lit garden dinners.' },
  { name: 'Sahara Astral Camp', region: 'Africa', mood: 'adventure', price: '$4,100', img: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=80', desc: 'Ultra-luxury desert suites, astronomer-guided stargazing and silent dune expeditions.' },
  { name: 'Amalfi Afterglow', region: 'Europe', mood: 'romance', price: '$3,750', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80', desc: 'Cliffside villas, vintage speedboats, lemon grove lunches and private coastal concerts.' },
  { name: 'Patagonia Pulse', region: 'Americas', mood: 'adventure', price: '$5,400', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80', desc: 'Guided glacier treks, lodge-to-lodge heli transfers and restorative thermal rituals.' },
  { name: 'Maldives Nocturne', region: 'Islands', mood: 'romance', price: '$6,200', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80', desc: 'Overwater sanctuaries, coral conservation dives and moonlit floating degustations.' }
];
const packages = [
  { name: 'Neo Honeymoon', cat: 'romance', days: '7 nights', price: '$4,950', img: destinations[5].img },
  { name: 'Founder Reset', cat: 'wellness', days: '5 nights', price: '$3,400', img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80' },
  { name: 'Arctic Signal', cat: 'adventure', days: '9 nights', price: '$7,800', img: destinations[0].img },
  { name: 'Cultural Blackbook', cat: 'culture', days: '10 nights', price: '$5,150', img: destinations[1].img }
];
const hotels = [
  { name: 'The Orbital Ritz', city: 'Singapore', rating: 5, price: '$720/night', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80' },
  { name: 'Noir Lagoon Villas', city: 'Bora Bora', rating: 5, price: '$1,240/night', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80' },
  { name: 'Glassline Alpine Lodge', city: 'Zermatt', rating: 4, price: '$540/night', img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80' },
  { name: 'Celestial Medina', city: 'Marrakech', rating: 5, price: '$410/night', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80' }
];
const blogs = [
  { title: 'The Rise of Quiet Luxury Travel', cat: 'Trends', img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80' },
  { title: 'How to Design a Jet-Lag-Proof Itinerary', cat: 'Planning', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80' },
  { title: 'Private Islands That Still Feel Wild', cat: 'Destinations', img: destinations[5].img },
  { title: 'A Concierge Guide to Kyoto After Dark', cat: 'Culture', img: destinations[1].img }
];

function initShell(){
  setTimeout(() => $('.loader')?.classList.add('hide'), 450);
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === path));
  $('.hamburger')?.addEventListener('click', () => $('.nav-links')?.classList.toggle('open'));
  const savedTheme = localStorage.getItem('te-theme') || 'dark';
  document.documentElement.dataset.theme = savedTheme;
  $('#themeToggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next; localStorage.setItem('te-theme', next);
  });
  const top = $('.back-top');
  addEventListener('scroll', () => top?.classList.toggle('show', scrollY > 650));
  top?.addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));
  const io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')), {threshold:.12});
  $$('.reveal').forEach(el => io.observe(el));
  initCounters(); initFaq(); initSlider(); initForms(); initNewsletter(); initWeather(); initCurrency(); initBooking(); initCheckout();
}
function cardTemplate(item, type='destination'){
  return `<article class="card glass ${type==='destination'?'image-card':''} ${type==='blog'?'blog-card':''}" style="--img:url('${item.img}')">
    ${type==='destination'?`<span class="tag">${item.region}</span><button class="icon-btn heart" data-wish="${item.name}" aria-label="Save ${item.name}">♡</button><div><span class="chip">${item.mood}</span><h3>${item.name}</h3><p class="meta">From ${item.price} · ${item.desc}</p><button class="btn" data-modal='${JSON.stringify(item)}'>Explore details</button></div>`:''}
    ${type==='package'?`<div class="package-thumb" style="--img:url('${item.img}')"></div><span class="chip">${item.cat}</span><h3>${item.name}</h3><p class="meta">${item.days} · private concierge · flexible departures</p><p class="price">${item.price}</p><a class="btn primary" href="booking.html">Book package</a>`:''}
    ${type==='hotel'?`<div class="hotel-thumb" style="--img:url('${item.img}')"></div><span class="stars">${'★'.repeat(item.rating)}${'☆'.repeat(5-item.rating)}</span><h3>${item.name}</h3><p class="meta">${item.city} · ${item.price}</p><button class="btn" data-modal='${JSON.stringify({...item, desc:'Signature suites, priority spa access, airport transfers and a TravelEase preferred guest upgrade path.'})}'>View hotel</button>`:''}
    ${type==='blog'?`<div class="thumb" style="--img:url('${item.img}')"></div><span class="chip">${item.cat}</span><h3>${item.title}</h3><p class="meta">Editorial insight for travelers who value time, design and memorable access.</p><a class="btn" href="#">Read article</a>`:''}
  </article>`;
}
function renderCards(list, target, type){ const el = $(target); if(el) el.innerHTML = list.map(x => cardTemplate(x,type)).join(''); bindDynamic(); }
function bindDynamic(){
  $$('[data-modal]').forEach(btn => btn.onclick = () => openModal(JSON.parse(btn.dataset.modal)));
  $$('[data-wish]').forEach(btn => btn.onclick = () => toggleWish(btn.dataset.wish, btn)); refreshWishButtons();
}
function openModal(item){
  const modal = $('#detailModal'); if(!modal) return;
  $('#modalContent').innerHTML = `<button class="icon-btn close" onclick="document.getElementById('detailModal').classList.remove('show')">×</button><div class="modal-hero" style="--img:url('${item.img}')"></div><span class="chip">${item.region || item.city || 'TravelEase Select'}</span><h2 class="section-title" style="font-size:2.5rem">${item.name}</h2><p class="lead">${item.desc || 'A curated luxury experience with flexible dates, private transfers and human concierge support.'}</p><div class="pill-row"><span class="chip">${item.price}</span><span class="chip">VIP transfers</span><span class="chip">24/7 concierge</span></div><a class="btn primary" href="booking.html" style="margin-top:18px">Reserve this experience</a>`;
  modal.classList.add('show');
}
function toggleWish(name, btn){ const set = new Set(JSON.parse(localStorage.getItem('te-wishlist')||'[]')); set.has(name)?set.delete(name):set.add(name); localStorage.setItem('te-wishlist', JSON.stringify([...set])); if(btn) btn.textContent=set.has(name)?'♥':'♡'; renderWishlist(); }
function refreshWishButtons(){ const set = new Set(JSON.parse(localStorage.getItem('te-wishlist')||'[]')); $$('[data-wish]').forEach(b => b.textContent = set.has(b.dataset.wish)?'♥':'♡'); }
function renderWishlist(){ const el = $('#wishlist'); if(!el) return; const list = JSON.parse(localStorage.getItem('te-wishlist')||'[]'); el.innerHTML = list.length ? list.map(n=>`<span class="chip">${n}</span>`).join('') : '<p class="meta">No saved destinations yet. Add favorites from the Destinations page.</p>'; }
function initCounters(){ const nums = $$('.counter'); if(!nums.length) return; const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ const el=e.target, end=+el.dataset.count; let n=0; const step=Math.max(1, Math.ceil(end/70)); const t=setInterval(()=>{n+=step; el.textContent=n>=end?end:n; if(n>=end) clearInterval(t)},22); io.unobserve(el);} }), {threshold:.5}); nums.forEach(n=>io.observe(n)); }
function initFaq(){ $$('.faq-q').forEach(q => q.addEventListener('click', () => q.parentElement.classList.toggle('open'))); }
function initSlider(){ const s=$('.slides'); if(!s) return; let i=0; setInterval(()=>{i=(i+1)%s.children.length; s.style.transform=`translateX(-${i*100}%)`;},3600); }
function initForms(){ $$('form[data-validate]').forEach(form => form.addEventListener('submit', e => { e.preventDefault(); const bad=[...form.querySelectorAll('[required]')].find(x=>!x.value.trim()); const note=form.querySelector('.notice'); if(bad){bad.focus(); if(note) note.textContent='Please complete all required fields.'; return;} if(note) note.textContent='Success — your request has been saved for this demo.'; })); }
function initNewsletter(){ $('#newsletterForm')?.addEventListener('submit', e => { e.preventDefault(); localStorage.setItem('te-newsletter', $('#newsletterEmail').value); $('#newsletterNote').textContent='Welcome aboard. Premium travel drops are now unlocked.'; }); }
function initWeather(){ const w=$('#weatherWidget'); if(w) w.innerHTML = '<strong>Dubai</strong><span class="meta"> 31°C · clear evening · ideal rooftop dining</span>'; }
function initCurrency(){ const c=$('#currencyConverter'); if(!c) return; c.addEventListener('input', () => { const usd=+$('#usd').value||0; $('#eur').value=(usd*.92).toFixed(2); $('#jpy').value=(usd*157).toFixed(0); }); }

function money(value){ return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(value); }
function getBookingPayload(){ return JSON.parse(localStorage.getItem('te-booking') || 'null'); }
function setBookingPayload(payload){ localStorage.setItem('te-booking', JSON.stringify(payload)); }
function calculateBooking(){
  const trip = $('#bookingTrip'); if(!trip) return null;
  const selected = trip.selectedOptions[0];
  const base = Number(selected.dataset.price || 0);
  const travelers = Number($('#bookingTravelers')?.value || 1);
  const cabin = Number($('#bookingCabin')?.value || 0);
  const extras = Number($('#bookingExtras')?.value || 0);
  const subtotal = (base * travelers) + cabin;
  const total = subtotal + extras;
  return {
    trip: trip.value,
    meta: selected.dataset.meta,
    base,
    travelers,
    cabin,
    extras,
    subtotal,
    total,
    date: $('#bookingDate')?.value || 'Flexible',
    name: $('#bookingName')?.value || 'Guest traveler',
    email: $('#bookingEmail')?.value || '',
    phone: $('#bookingPhone')?.value || '',
    notes: $('#bookingNotes')?.value || ''
  };
}
function updateBookingSummary(){
  const data = calculateBooking(); if(!data) return;
  $('#bookingTripName').textContent = data.trip;
  $('#bookingTripMeta').textContent = data.meta;
  $('#summaryBase').textContent = money(data.base);
  $('#summaryTravelers').textContent = data.travelers;
  $('#summaryExtras').textContent = money(data.extras + data.cabin);
  $('#summaryTotal').textContent = money(data.total);
}
function initBooking(){
  const form = $('#bookingForm'); if(!form) return;
  form.addEventListener('input', updateBookingSummary);
  form.addEventListener('change', updateBookingSummary);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = [...form.querySelectorAll('[required]')].find(x => !x.value.trim());
    const note = form.querySelector('.notice');
    if(bad){ bad.focus(); if(note) note.textContent = 'Please complete every required booking detail.'; return; }
    const payload = calculateBooking(); setBookingPayload(payload);
    if(note) note.textContent = 'Booking saved. Opening secure checkout…';
    setTimeout(() => { location.href = 'checkout.html'; }, 450);
  });
  updateBookingSummary();
}
function initCheckout(){
  const card = $('.checkout-card'); if(!card) return;
  const data = getBookingPayload() || { trip:'Maldives Nocturne', meta:'7 nights · private transfers · island concierge', travelers:2, subtotal:12400, extras:650, total:13050, date:'Flexible', name:'Guest traveler', email:'' };
  const service = Math.round(data.total * 0.03);
  $('#checkoutTripName').textContent = data.trip;
  $('#checkoutMeta').textContent = data.meta;
  $('#checkoutGuest').textContent = data.name;
  $('#checkoutDate').textContent = data.date || 'Flexible';
  $('#checkoutTravelers').textContent = data.travelers;
  $('#checkoutSubtotal').textContent = money(data.subtotal);
  $('#checkoutExtras').textContent = money(data.extras + (data.cabin || 0));
  $('#checkoutService').textContent = money(service);
  $('#checkoutTotal').textContent = money(data.total + service);
  if(data.email && $('#checkoutEmail')) $('#checkoutEmail').value = data.email;
  $('#checkoutForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.currentTarget;
    const bad = [...form.querySelectorAll('[required]')].find(x => x.type === 'checkbox' ? !x.checked : !x.value.trim());
    const note = form.querySelector('.notice');
    if(bad){ bad.focus(); if(note) note.textContent = 'Please complete payment details and accept the concierge hold.'; return; }
    localStorage.setItem('te-last-checkout', new Date().toISOString());
    if(note) note.textContent = 'Checkout complete. A TravelEase designer will confirm the final itinerary shortly.';
  });
}

function filterPage(data, grid, type){
  const q=($('#searchInput')?.value||'').toLowerCase(), cat=$('#categoryFilter')?.value||'all';
  renderCards(data.filter(x => (cat==='all'||x.region===cat||x.mood===cat||x.cat===cat||x.city===cat||x.cat===cat) && JSON.stringify(x).toLowerCase().includes(q)), grid, type);
}

document.addEventListener('DOMContentLoaded', () => {
  initShell();
  renderCards(destinations.slice(0,3), '#featuredDestinations', 'destination');
  renderCards(packages.slice(0,3), '#popularPackages', 'package');
  renderCards(destinations, '#destinationGrid', 'destination');
  renderCards(packages, '#packageGrid', 'package');
  renderCards(hotels, '#hotelGrid', 'hotel');
  renderCards(blogs, '#blogGrid', 'blog');
  renderWishlist();
  $('#searchInput')?.addEventListener('input', () => { if($('#destinationGrid')) filterPage(destinations,'#destinationGrid','destination'); if($('#packageGrid')) filterPage(packages,'#packageGrid','package'); if($('#hotelGrid')) filterPage(hotels,'#hotelGrid','hotel'); if($('#blogGrid')) filterPage(blogs,'#blogGrid','blog'); });
  $('#categoryFilter')?.addEventListener('change', () => { if($('#destinationGrid')) filterPage(destinations,'#destinationGrid','destination'); if($('#packageGrid')) filterPage(packages,'#packageGrid','package'); if($('#hotelGrid')) filterPage(hotels,'#hotelGrid','hotel'); if($('#blogGrid')) filterPage(blogs,'#blogGrid','blog'); });
  $('#detailModal')?.addEventListener('click', e => { if(e.target.id==='detailModal') e.currentTarget.classList.remove('show'); });
});
