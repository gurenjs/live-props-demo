// Drives the kitchen board in one window while a customer's tracking page is
// open in another, and records both. Run against a dev server:
//   node record.mjs http://localhost:3333
import { chromium } from 'playwright'
import { mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'

const origin = process.argv[2] ?? 'http://localhost:3333'
const ORDER_ID = 2
const size = { width: 900, height: 700 }
const out = new URL('./out/', import.meta.url).pathname
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

const cursorScript = () => {
  const install = () => {
    const cursor = document.createElement('div')
    cursor.style.cssText =
      'position:fixed;z-index:2147483647;left:0;top:0;width:28px;height:28px;pointer-events:none;translate:-100px -100px'
    cursor.innerHTML =
      '<svg viewBox="0 0 24 24" width="28" height="28"><path d="M4 2l15 9.5-6.6 1.3 4 7.6-2.7 1.4-4-7.6L5 19z" fill="#1a1212" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>'
    document.documentElement.appendChild(cursor)
    const style = document.createElement('style')
    style.textContent =
      '@keyframes __ripple{from{opacity:.55;scale:.3}to{opacity:0;scale:1.6}}.__ripple{position:fixed;z-index:2147483646;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;background:#db1b1b;pointer-events:none;animation:__ripple .5s ease-out forwards}'
    document.documentElement.appendChild(style)
    addEventListener('mousemove', (e) => (cursor.style.translate = `${e.clientX}px ${e.clientY}px`), true)
    addEventListener(
      'mousedown',
      (e) => {
        const ripple = document.createElement('div')
        ripple.className = '__ripple'
        ripple.style.left = `${e.clientX}px`
        ripple.style.top = `${e.clientY}px`
        document.documentElement.appendChild(ripple)
        setTimeout(() => ripple.remove(), 600)
      },
      true,
    )
  }
  if (document.body) install()
  else addEventListener('DOMContentLoaded', install)
}

const browser = await chromium.launch()

// Start from the seeded state, outside the recording.
const setup = await browser.newPage()
await setup.goto(origin)
await setup.getByRole('button', { name: 'Reset' }).click()
await setup.waitForFunction((id) => document.querySelector(`[data-order="${id}"]`)?.textContent?.includes('Received'), ORDER_ID)
await setup.close()

const open = async (path, withCursor) => {
  const context = await browser.newContext({ viewport: size, recordVideo: { dir: out, size }, colorScheme: 'light' })
  if (withCursor) await context.addInitScript(cursorScript)
  const page = await context.newPage()
  const startedAt = Date.now()
  await page.goto(origin + path)
  // The layout is rem-based, so a larger root font fills the recorded window.
  await page.addStyleTag({ content: 'html{font-size:130%}' })
  await page.waitForLoadState('networkidle')
  return { context, page, startedAt }
}

const kitchen = await open('/', true)
const customer = await open(`/orders/${ORDER_ID}`, false)
// Let both sockets subscribe before anything is broadcast.
await kitchen.page.waitForTimeout(1500)

let position = { x: 800, y: 640 }
await kitchen.page.mouse.move(position.x, position.y)

const glideTo = async (x, y, ms = 650) => {
  const from = position
  const frames = Math.round(ms / 16)
  for (let i = 1; i <= frames; i++) {
    const t = i / frames
    const eased = 1 - Math.pow(1 - t, 3)
    await kitchen.page.mouse.move(from.x + (x - from.x) * eased, from.y + (y - from.y) * eased)
    await kitchen.page.waitForTimeout(16)
  }
  position = { x, y }
}

const marks = []
const step = async (button, headline) => {
  const target = kitchen.page.locator(`[data-order="${ORDER_ID}"]`).getByRole('button', { name: button })
  const box = await target.boundingBox()
  await glideTo(box.x + box.width / 2, box.y + box.height / 2)
  await kitchen.page.waitForTimeout(350)
  const clickedAt = Date.now()
  await kitchen.page.mouse.down()
  await kitchen.page.waitForTimeout(70)
  await kitchen.page.mouse.up()
  // The customer's page is never touched: only the broadcast can change it.
  await customer.page.waitForFunction((text) => document.querySelector('[data-headline]')?.textContent === text, headline, { timeout: 5000 })
  marks.push({ button, headline, clickedAt, updatedAfterMs: Date.now() - clickedAt })
  await kitchen.page.waitForTimeout(1500)
}

await step('Start cooking', 'Your order is on the stove.')
await step('Mark ready', 'Ready for pickup!')
await step('Hand over', 'Enjoy your meal.')
await glideTo(800, 640, 500)
await kitchen.page.waitForTimeout(600)

const kitchenVideo = await kitchen.page.video().path()
const customerVideo = await customer.page.video().path()
await kitchen.context.close()
await customer.context.close()
await browser.close()

renameSync(kitchenVideo, `${out}kitchen.webm`)
renameSync(customerVideo, `${out}customer.webm`)
const timeline = {
  size,
  // Seconds from each video's first frame to each click.
  kitchen: marks.map((m) => ({ ...m, at: (m.clickedAt - kitchen.startedAt) / 1000 })),
  customer: marks.map((m) => ({ ...m, at: (m.clickedAt - customer.startedAt) / 1000 })),
}
writeFileSync(`${out}timeline.json`, JSON.stringify(timeline, null, 2))
console.log(JSON.stringify(timeline, null, 2))
