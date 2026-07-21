import { StrictMode, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './supabase'
import './styles.css'

const fallbackMenuItems = [
  { id: 'kopi', name: 'Signature Kopi', description: 'Our house blend, brewed traditional-style—bold, aromatic, and smooth.', price: 2.8 },
  { id: 'toast', name: 'Kaya Toast Set', description: 'Crisp toast with house-made kaya and butter, served with soft-boiled eggs.', price: 4.2 },
  { id: 'laksa', name: "Uncle's Laksa", description: 'Rich, creamy coconut laksa with prawns, fishcake, tau pok and egg.', price: 8.5 },
]

const money = (value) => `$${value.toFixed(2)}`
const route = () => window.location.hash.replace(/^#\/?/, '') || 'home'
const toMenuItem = (row) => ({ ...row, id: row.id, price: Number(row.price) })

async function loadProfile(authUser) {
  const { data, error } = await supabase.from('profiles').select('full_name, role').eq('id', authUser.id).single()
  if (error) throw error
  return { id: authUser.id, email: authUser.email, name: data.full_name, role: data.role }
}

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span> }

function Header({ user, cartCount, onSignOut }) {
  const go = (to) => { window.location.hash = to }
  return <header className="site-header">
    <a className="brand" href="#home">Kopi <span>&amp;</span> Co.</a>
    <nav aria-label="Main navigation">
      <a href="#home">Home</a><a href="#menu">Menu</a><a href="#about">About</a><a href="#contact">Contact</a>
      {user && <><a href="#order">Order</a><a href="#bookings">Book</a><a href="#game">Catch</a></>}
      {user?.role === 'staff' && <a href="#admin">Admin</a>}
    </nav>
    <div className="header-actions">
      {user ? <button className="text-button" onClick={onSignOut}>Hi, {user.name.split(' ')[0]} · Sign out</button> : <button className="text-button" onClick={() => go('auth')}>Sign in</button>}
      {user && <a className="cart-button" href="#order" aria-label={`Cart with ${cartCount} items`}><Icon>◌</Icon>{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</a>}
    </div>
  </header>
}

function Button({ href, children, secondary = false, onClick }) {
  const props = onClick ? { onClick } : { href }
  return <a className={`button ${secondary ? 'button-secondary' : ''}`} {...props}>{children}<span aria-hidden="true">→</span></a>
}

function SectionHeading({ kicker, children }) { return <div className="section-heading"><p className="kicker">{kicker}</p><h2>{children}</h2></div> }

function MenuCard({ item, onAdd }) {
  const imageClass = item.name === 'Kaya Toast Set' ? 'image-toast' : item.name === "Uncle's Laksa" ? 'image-laksa' : 'image-kopi'
  return <article className="menu-card">
    <div className={`menu-image ${imageClass}`} role="img" aria-label={`${item.name} photo`} />
    <div className="menu-card-body"><h3>{item.name}</h3><p>{item.description}</p><div className="menu-card-foot"><strong>{money(item.price)}</strong><button className="add-button" onClick={() => onAdd(item)}>Add <span aria-hidden="true">+</span></button></div></div>
  </article>
}

function Home({ onAdd, menuItems }) {
  const [contact, setContact] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const submit = (e) => { e.preventDefault(); const next = {}; if (!contact.name.trim()) next.name = 'Please add your name.'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) next.email = 'Enter a valid email address.'; if (!contact.message.trim()) next.message = 'Tell us a little more.'; setErrors(next); if (!Object.keys(next).length) setSent(true) }
  return <main>
    <section className="hero section-shell" id="home">
      <div className="hero-copy"><p className="kicker">Tiong Bahru · Singapore</p><h1>Slow mornings.<br /><em>Strong kopi.</em></h1><p className="hero-lede">A little neighbourhood café for the first sip, the last page, and everything in between.</p><Button href="#menu">See the menu</Button></div>
      <div className="hero-media"><img src="/kopi-still-life.png" alt="Kopi and kaya toast on a wooden café table" /></div>
    </section>
    <section className="about section-shell" id="about"><div className="about-media"><img src="/kopi-still-life.png" alt="Fresh kopi and kaya toast at Kopi & Co." /></div><div className="about-copy"><SectionHeading kicker="Our story">Kopi, heritage<br />&amp; heart.</SectionHeading><p>Kopi &amp; Co. is a little café born from a love for Singapore’s kopi and the simple joys of everyday moments.</p><p>We brew our kopi the traditional way, serve honest local flavours, and welcome everyone like family.</p><p>Come for the kopi, stay for the conversations.</p><a className="inline-link" href="#contact">Learn more about us <span>→</span></a><div className="stats"><div><strong>12</strong><span>years brewing</span></div><div><strong>18k</strong><span>cups shared</span></div></div></div></section>
    <section className="menu-section section-shell" id="menu"><SectionHeading kicker="Menu preview">Local favourites, made with care.</SectionHeading><div className="menu-grid">{menuItems.map((item) => <MenuCard key={item.id} item={item} onAdd={onAdd} />)}</div><div className="center-action"><Button href="#order" secondary>See the full menu</Button></div></section>
    <section className="contact section-shell" id="contact"><div className="contact-intro"><SectionHeading kicker="Contact">We’d love to<br />see you.</SectionHeading><p>Drop by for a kopi and a chat. We can’t wait to welcome you.</p></div><div className="contact-details"><div><Icon>⌖</Icon><p className="label">Address</p><p>16 Yong Siak Street<br />Tiong Bahru<br />Singapore 168650</p><a className="inline-link" href="https://maps.google.com/?q=16+Yong+Siak+Street" target="_blank" rel="noreferrer">View on Google Maps →</a></div><div><Icon>◷</Icon><p className="label">Opening hours</p><p>Mon – Fri &nbsp; 7:00am – 5:00pm<br />Sat – Sun &nbsp; 7:30am – 5:30pm<br />Public Holidays &nbsp; 8:00am – 4:00pm</p><p className="small">Last order 30 mins before closing.</p></div></div><form className="contact-form" onSubmit={submit} noValidate><h3>Say hello</h3>{sent && <p className="success" role="status">Thanks — we’ll be in touch soon.</p>}<label>Name<input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />{errors.name && <span className="error">{errors.name}</span>}</label><label>Email<input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />{errors.email && <span className="error">{errors.email}</span>}</label><label>Message<textarea rows="3" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} />{errors.message && <span className="error">{errors.message}</span>}</label><button className="button" type="submit">Send message <span>→</span></button></form></section>
  </main>
}

function Auth({ onAuth }) {
  const [mode, setMode] = useState('signin'); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setError(''); setNotice('')
    if (!email || password.length < 6 || (mode === 'signup' && !name.trim())) return setError('Please complete the form. Passwords need 6+ characters.')
    setBusy(true)
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name.trim() } } })
        if (signUpError) throw signUpError
        if (!data.session) { setNotice('Check your email to confirm your account, then sign in.'); return }
        await onAuth(data.user)
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        await onAuth(data.user)
      }
      window.location.hash = 'home'
    } catch (nextError) { setError(nextError.message || 'We could not sign you in.') } finally { setBusy(false) }
  }
  return <main className="narrow-page"><div className="auth-card"><p className="kicker">Welcome in</p><h1>{mode === 'signin' ? 'Good to see you.' : 'Join the table.'}</h1><p className="muted">{mode === 'signin' ? 'Sign in to order, book, and play Kopi Catch.' : 'Create an account for the full Kopi & Co. experience.'}</p><form onSubmit={submit} noValidate>{mode === 'signup' && <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>}<label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error && <p className="error">{error}</p>}{notice && <p className="success" role="status">{notice}</p>}<button className="button" type="submit" disabled={busy}>{busy ? 'Please wait' : mode === 'signin' ? 'Sign in' : 'Create account'} <span>→</span></button></form><button className="switch-button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setNotice('') }}>{mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}</button></div></main>
}

function Order({ user, cart, setCart, menuItems }) {
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  if (!user) return <main className="narrow-page"><div className="empty-state"><p className="kicker">Order online</p><h1>One more step.</h1><p>Sign in to build a cart and place your order.</p><Button href="#auth">Sign in to order</Button></div></main>
  const total = cart.reduce((sum, row) => sum + row.item.price * row.qty, 0)
  const update = (id, delta) => setCart(cart.map((row) => row.item.id === id ? { ...row, qty: Math.max(0, row.qty + delta) } : row).filter((row) => row.qty))
  const place = async () => {
    if (!cart.length) return
    setError(''); setBusy(true)
    const { error: orderError } = await supabase.from('orders').insert({ user_id: user.id, customer_name: user.name, items: cart.map(({ item, qty }) => ({ id: item.id, name: item.name, price: item.price, quantity: qty })), total_price: total, status: 'pending' })
    setBusy(false)
    if (orderError) return setError(orderError.message)
    setCart([]); window.location.hash = 'confirmation'
  }
  return <main className="narrow-page order-page"><SectionHeading kicker="Order online">Your table, wherever you are.</SectionHeading><div className="order-layout"><div className="order-menu">{menuItems.map((item) => <MenuCard key={item.id} item={item} onAdd={(next) => setCart([...cart.filter((r) => r.item.id !== next.id), { item: next, qty: (cart.find((r) => r.item.id === next.id)?.qty || 0) + 1 }])} />)}</div><aside className="cart-panel"><h2>Your cart</h2>{!cart.length ? <p className="muted">Your cart is ready for something good.</p> : <>{cart.map((row) => <div className="cart-row" key={row.item.id}><div><strong>{row.item.name}</strong><span>{money(row.item.price)} each</span></div><div className="qty"><button onClick={() => update(row.item.id, -1)} aria-label="Decrease quantity">−</button><span>{row.qty}</span><button onClick={() => update(row.item.id, 1)} aria-label="Increase quantity">+</button></div></div>)}<div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div>{error && <p className="error">{error}</p>}<button className="button full" onClick={place} disabled={busy}>{busy ? 'Placing order' : 'Place order'} <span>→</span></button></>}</aside></div></main>
}

function Bookings({ user }) {
  const [form, setForm] = useState({ name: user?.name || '', party: '2', date: '', time: '', phone: '' }); const [done, setDone] = useState(false); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  if (!user) return <main className="narrow-page"><div className="empty-state"><h1>Book with an account.</h1><p>Sign in to send a booking request.</p><Button href="#auth">Sign in to book</Button></div></main>
  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (Object.values(form).some((v) => !v)) return setError('Please complete every field.')
    setBusy(true)
    const { error: bookingError } = await supabase.from('bookings').insert({ user_id: user.id, name: form.name.trim(), party_size: Number(form.party), preferred_at: `${form.date}T${form.time}:00+08:00`, contact_number: form.phone.trim(), status: 'requested' })
    setBusy(false)
    if (bookingError) return setError(bookingError.message)
    setDone(true)
  }
  return <main className="narrow-page"><div className="form-page"><p className="kicker">A seat for you</p><h1>Book a table.</h1><p className="muted">Send a request and we’ll confirm it manually. No real-time availability needed.</p>{done ? <div className="confirmation"><span>✓</span><h2>Request received.</h2><p>We’ll be in touch shortly to confirm your table.</p><Button href="#home">Back home</Button></div> : <form onSubmit={submit}><label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label><label>Party size<select value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })}>{[1,2,3,4,5,6,7,8].map((n) => <option key={n}>{n}</option>)}</select></label><div className="form-row"><label>Preferred date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label><label>Time<input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required /></label></div><label>Contact number<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></label>{error && <p className="error">{error}</p>}<button className="button" type="submit" disabled={busy}>{busy ? 'Sending request' : 'Request booking'} <span>→</span></button></form>}</div></main>
}

function Admin({ user }) {
  const [orders, setOrders] = useState([]); const [bookings, setBookings] = useState([]); const [error, setError] = useState('')
  const load = async () => {
    const [{ data: orderRows, error: orderError }, { data: bookingRows, error: bookingError }] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('preferred_at', { ascending: true }),
    ])
    if (orderError || bookingError) return setError(orderError?.message || bookingError?.message || 'Could not load the counter.')
    setOrders(orderRows); setBookings(bookingRows)
  }
  useEffect(() => { if (user?.role === 'staff') load() }, [user?.id, user?.role])
  const update = async (table, id, status) => { const { error: updateError } = await supabase.from(table).update({ status }).eq('id', id); if (updateError) return setError(updateError.message); load() }
  if (user?.role !== 'staff') return <main className="narrow-page"><div className="empty-state"><h1>Staff only.</h1><p>Ask the café administrator to mark your account as staff.</p><Button href="#home">Back home</Button></div></main>
  return <main className="admin-page"><div className="admin-head"><div><p className="kicker">Counter view</p><h1>Good morning, team.</h1></div><span className="staff-badge">Staff mode</span></div>{error && <p className="error">{error}</p>}<div className="admin-grid"><section><h2>Today’s orders <span>{orders.length}</span></h2>{orders.length ? orders.map((row) => <article className="admin-row" key={row.id}><div><strong>{row.customer_name}</strong><p>{row.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}</p></div><div className="row-action"><span className="status">{row.status}</span>{row.status !== 'fulfilled' && <button onClick={() => update('orders', row.id, 'fulfilled')}>Fulfil</button>}</div></article>) : <p className="muted">No orders yet.</p>}</section><section><h2>Today’s bookings <span>{bookings.length}</span></h2>{bookings.length ? bookings.map((row) => <article className="admin-row" key={row.id}><div><strong>{row.name}</strong><p>Party of {row.party_size} · {new Date(row.preferred_at).toLocaleString('en-SG', { dateStyle: 'medium', timeStyle: 'short' })}</p></div><div className="row-action"><span className="status">{row.status}</span>{row.status !== 'confirmed' && <button onClick={() => update('bookings', row.id, 'confirmed')}>Confirm</button>}</div></article>) : <p className="muted">No bookings yet.</p>}</section></div></main>
}

function Confirmation() { return <main className="narrow-page"><div className="confirmation"><span>✓</span><p className="kicker">Order received</p><h1>That’s the good stuff.</h1><p>Your order is now with the café team. We’ll have it ready soon.</p><Button href="#home">Back home</Button></div></main> }

function Game({ user }) {
  const [score, setScore] = useState(0); const [best, setBest] = useState(0); const [playing, setPlaying] = useState(false); const [time, setTime] = useState(60); const [cup, setCup] = useState(50); const [items, setItems] = useState([]); const [popups, setPopups] = useState([]); const [particles, setParticles] = useState([]); const [flash, setFlash] = useState(false); const frame = useRef(); const last = useRef(0); const elapsed = useRef(0); const velocity = useRef(0); const cupRef = useRef(50); const itemsRef = useRef([]); const keys = useRef({ left: false, right: false }); const stageRef = useRef(); const recorded = useRef(false)
  const moveCup = (next) => { const bounded = Math.max(8, Math.min(92, next)); cupRef.current = bounded; setCup(bounded) }
  const celebrate = (item) => { const id = `${item.id}-${Date.now()}`; const points = item.kind === 'laksa' ? 5 : 1; if (item.kind === 'spill') { setScore((s) => Math.max(0, s - 2)); setFlash(true); window.setTimeout(() => setFlash(false), 180) } else { setScore((s) => s + points); setPopups((rows) => [...rows, { id, x: item.x, value: `+${points}` }]); setParticles((rows) => [...rows, { id, x: item.x }]); window.setTimeout(() => { setPopups((rows) => rows.filter((row) => row.id !== id)); setParticles((rows) => rows.filter((row) => row.id !== id)) }, 600) } }
  useEffect(() => { if (!playing) return; const tick = (now) => { if (!last.current) last.current = now; const dt = Math.min(0.05, (now - last.current) / 1000); last.current = now; elapsed.current += dt; const direction = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0); velocity.current += direction * 110 * dt; if (!direction) velocity.current *= Math.pow(0.03, dt); velocity.current = Math.max(-72, Math.min(72, velocity.current)); moveCup(cupRef.current + velocity.current * dt); const nextTime = Math.max(0, 60 - elapsed.current); setTime(nextTime); if (nextTime <= 0) { setPlaying(false); return } const spawnRate = 1.15 + elapsed.current * 0.02; const rows = itemsRef.current.map((i) => ({ ...i, y: i.y + (120 + elapsed.current * 1.5) * dt })); const remaining = []; rows.forEach((item) => { if (item.y > 86) return; if (item.y > 72 && item.x > cupRef.current - 10 && item.x < cupRef.current + 10) return celebrate(item); remaining.push(item) }); if (Math.random() < dt * spawnRate) { const roll = Math.random(); remaining.push({ id: Math.random(), x: 8 + Math.random() * 84, y: -8, kind: roll < .08 ? 'laksa' : roll < .23 ? 'spill' : roll < .56 ? 'toast' : 'bean' }) } itemsRef.current = remaining; setItems(remaining); frame.current = requestAnimationFrame(tick) }; frame.current = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame.current) }, [playing])
  useEffect(() => { const down = (e) => { if (!playing || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return; e.preventDefault(); keys.current[e.key === 'ArrowLeft' ? 'left' : 'right'] = true }; const up = (e) => { if (e.key === 'ArrowLeft') keys.current.left = false; if (e.key === 'ArrowRight') keys.current.right = false }; window.addEventListener('keydown', down); window.addEventListener('keyup', up); return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) } }, [playing])
  useEffect(() => { if (!user?.id) return; supabase.from('game_scores').select('score').eq('user_id', user.id).order('score', { ascending: false }).limit(1).maybeSingle().then(({ data }) => setBest(data?.score || 0)) }, [user?.id])
  const start = () => { setScore(0); setTime(60); setItems([]); setPopups([]); setParticles([]); setPlaying(true); last.current = 0; elapsed.current = 0; velocity.current = 0; itemsRef.current = []; recorded.current = false; moveCup(50) }
  const drag = (event) => { if (!playing || !stageRef.current) return; const rect = stageRef.current.getBoundingClientRect(); moveCup(((event.clientX - rect.left) / rect.width) * 100) }
  useEffect(() => { if (!user?.id || playing || time !== 0 || recorded.current) return; recorded.current = true; const persist = async () => { const { error } = await supabase.from('game_scores').insert({ user_id: user.id, score }); if (!error) setBest((current) => Math.max(current, score)) }; persist() }, [playing, time, score, user?.id])
  if (!user) return <main className="narrow-page"><div className="empty-state"><h1>Kopi Catch is for members.</h1><Button href="#auth">Sign in to play</Button></div></main>
  return <main className="game-page"><div className="game-head"><div><p className="kicker">A tiny break</p><h1>Kopi Catch</h1><p>Move the cup. Catch beans and kaya toast. Watch for the spills.</p></div><div className="game-stats"><span>Score <strong>{score}</strong></span><span>Best <strong>{best}</strong></span><span>Time <strong>{Math.ceil(time)}s</strong></span></div></div><div ref={stageRef} className={`game-stage${flash ? ' penalty-flash' : ''}`} role="application" aria-label="Kopi Catch game" onPointerDown={drag} onPointerMove={(event) => event.buttons && drag(event)}><div className="game-items">{items.map((i) => <span className={`falling ${i.kind}`} style={{ left: `${i.x}%`, top: `${i.y}%` }} key={i.id}>{i.kind === 'laksa' ? '🍜' : i.kind === 'spill' ? '💧' : i.kind === 'toast' ? '🍞' : '🫘'}</span>)}{particles.map((p) => <span className="catch-particles" style={{ left: `${p.x}%` }} key={p.id}>✦</span>)}{popups.map((p) => <span className="score-popup" style={{ left: `${p.x}%` }} key={p.id}>{p.value}</span>)}</div><div className="player-cup" style={{ left: `${cup}%` }}>☕</div>{!playing && <div className="game-overlay"><p className="kicker">{time === 0 ? 'Time' : 'Ready?'}</p><h2>{time === 0 ? `You scored ${score}.` : 'Keep the kopi coming.'}</h2><p>{time === 0 ? `Personal best: ${best}` : 'Use the arrow keys or drag across the stage.'}</p><button className="button" onClick={start}>{time === 0 ? 'Play again' : 'Start game'} <span>→</span></button></div>}</div><div className="touch-controls"><button onPointerDown={() => { keys.current.left = true }} onPointerUp={() => { keys.current.left = false }}>←</button><button onPointerDown={() => { keys.current.right = true }} onPointerUp={() => { keys.current.right = false }}>→</button></div></main>
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(route()); const [user, setUser] = useState(null); const [cart, setCartState] = useState([]); const [menuItems, setMenuItems] = useState(fallbackMenuItems); const [menuError, setMenuError] = useState('')
  useEffect(() => { const onHash = () => setCurrentRoute(route()); window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash) }, [])
  useEffect(() => { supabase.from('menu_items').select('id, name, description, price, image_url').order('created_at', { ascending: true }).then(({ data, error }) => { if (error) setMenuError(error.message); else if (data?.length) setMenuItems(data.map(toMenuItem)) }) }, [])
  useEffect(() => {
    const setSessionUser = async (session) => { if (!session?.user) return setUser(null); try { setUser(await loadProfile(session.user)) } catch { setUser(null) } }
    supabase.auth.getSession().then(({ data }) => setSessionUser(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSessionUser(session))
    return () => listener.subscription.unsubscribe()
  }, [])
  const setCart = (next) => setCartState(next); const cartCount = useMemo(() => cart.reduce((sum, row) => sum + row.qty, 0), [cart]); const add = (item) => setCart([...cart.filter((r) => r.item.id !== item.id), { item, qty: (cart.find((r) => r.item.id === item.id)?.qty || 0) + 1 }])
  const signOut = async () => { await supabase.auth.signOut(); setUser(null); setCart([]); window.location.hash = 'home' }
  const onAuth = async (authUser) => setUser(await loadProfile(authUser))
  let page = <Home onAdd={add} menuItems={menuItems} />
  if (currentRoute === 'auth') page = <Auth onAuth={onAuth} />
  if (currentRoute === 'menu') page = <main className="narrow-page menu-page"><SectionHeading kicker="The menu">Local favourites, made with care.</SectionHeading>{menuError && <p className="error">{menuError}</p>}<div className="menu-grid">{menuItems.map((item) => <MenuCard key={item.id} item={item} onAdd={add} />)}</div></main>
  if (currentRoute === 'order') page = <Order user={user} cart={cart} setCart={setCart} menuItems={menuItems} />
  if (currentRoute === 'bookings') page = <Bookings user={user} />
  if (currentRoute === 'admin') page = <Admin user={user} />
  if (currentRoute === 'confirmation') page = <Confirmation />
  if (currentRoute === 'game') page = <Game user={user} />
  return <><Header user={user} cartCount={cartCount} onSignOut={signOut} />{menuError && currentRoute === 'home' && <p className="data-notice">The live menu is temporarily unavailable.</p>}{page}<footer><span>© 2025 Kopi &amp; Co.</span><span>Made for slow mornings.</span></footer></>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
