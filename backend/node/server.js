import express from 'express'
import cors from 'cors'
import pg from 'pg'

const app = express()
app.use(cors())
app.use(express.json())

const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST || 'postgres',
  port: Number(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || 'spare_parts_db',
  user: process.env.POSTGRES_USER || 'spare_user',
  password: process.env.POSTGRES_PASSWORD || 'spare_password'
})

const q = (text, params = []) => pool.query(text, params)

app.get('/health', (_req, res) => res.json({ ok: true }))

app.get('/api/plants', async (req, res) => {
  const { id } = req.query
  const result = id
    ? await q('select * from plants where id = $1', [id])
    : await q('select * from plants order by name')
  res.json(result.rows)
})

app.get('/api/parts', async (req, res) => {
  const { plant_id: plantId } = req.query
  const result = plantId
    ? await q('select * from spare_parts where plant_id = $1 order by part_number', [plantId])
    : await q('select * from spare_parts order by part_number')
  res.json(result.rows)
})

app.post('/api/parts', async (req, res) => {
  const b = req.body
  await q(
    'insert into spare_parts (part_number, name, description, category, unit_price, reorder_point, quantity_on_hand, plant_id) values ($1,$2,$3,$4,$5,$6,$7,$8)',
    [b.part_number, b.name, b.description ?? null, b.category, b.unit_price ?? 0, b.reorder_point ?? 0, b.quantity_on_hand ?? 0, b.plant_id ?? null]
  )
  res.status(201).json({ success: true })
})

app.put('/api/parts/:id', async (req, res) => {
  const b = req.body
  await q(
    'update spare_parts set part_number=$1,name=$2,description=$3,category=$4,unit_price=$5,reorder_point=$6,quantity_on_hand=$7 where id=$8',
    [b.part_number, b.name, b.description ?? null, b.category, b.unit_price ?? 0, b.reorder_point ?? 0, b.quantity_on_hand ?? 0, req.params.id]
  )
  res.json({ success: true })
})

app.delete('/api/parts/:id', async (req, res) => {
  await q('delete from spare_parts where id = $1', [req.params.id])
  res.json({ success: true })
})

app.get('/api/transactions', async (req, res) => {
  const { plant_id: plantId, days } = req.query
  const params = []
  let sql = 'select * from inventory_transactions where 1=1'
  if (plantId) {
    params.push(plantId)
    sql += ` and plant_id = $${params.length}`
  }
  if (days) {
    params.push(Number(days))
    sql += ` and created_at >= now() - ($${params.length} || ' days')::interval`
  }
  sql += ' order by created_at desc'
  const result = await q(sql, params)
  res.json(result.rows)
})

app.post('/api/transactions', async (req, res) => {
  const client = await pool.connect()
  try {
    const b = req.body
    await client.query('begin')
    const current = await client.query('select quantity_on_hand from spare_parts where id = $1 for update', [b.part_id])
    const qty = Number(current.rows[0]?.quantity_on_hand ?? 0)
    const n = Number(b.quantity)
    const newQty = b.transaction_type === 'in' ? qty + n : b.transaction_type === 'out' ? Math.max(0, qty - n) : Math.max(0, n)
    await client.query('update spare_parts set quantity_on_hand = $1 where id = $2', [newQty, b.part_id])
    await client.query(
      'insert into inventory_transactions (part_id, transaction_type, quantity, notes, plant_id) values ($1,$2,$3,$4,$5)',
      [b.part_id, b.transaction_type, n, b.notes ?? null, b.plant_id ?? null]
    )
    await client.query('commit')
    res.status(201).json({ success: true })
  } catch (error) {
    await client.query('rollback')
    res.status(500).json({ error: error.message })
  } finally {
    client.release()
  }
})

app.get('/api/analytics', async (req, res) => {
  const { event_type: eventType } = req.query
  const result = eventType
    ? await q('select * from analytics_events where event_type = $1 order by created_at desc', [eventType])
    : await q('select * from analytics_events order by created_at desc')
  res.json(result.rows)
})

app.post('/api/analytics', async (req, res) => {
  const b = req.body
  await q('insert into analytics_events (event_type, event_data, session_id, user_id) values ($1,$2::jsonb,$3,$4)', [b.event_type, JSON.stringify(b.event_data ?? null), b.session_id ?? null, b.user_id ?? null])
  res.status(201).json({ success: true })
})

app.get('/api/recommendations', async (req, res) => {
  const { plant_id: plantId } = req.query
  const result = plantId
    ? await q('select * from ai_recommendations where plant_id = $1 order by created_at desc', [plantId])
    : await q('select * from ai_recommendations order by created_at desc')
  res.json(result.rows)
})

app.get('/api/kraljic', async (req, res) => {
  const { plant_id: plantId } = req.query
  const result = plantId
    ? await q('select * from kraljic_analysis where plant_id = $1 order by updated_at desc', [plantId])
    : await q('select * from kraljic_analysis order by updated_at desc')
  res.json(result.rows)
})

app.get('/api/eoq', async (req, res) => {
  const { plant_id: plantId } = req.query
  const result = plantId
    ? await q('select * from eoq_analysis where plant_id = $1 order by updated_at desc', [plantId])
    : await q('select * from eoq_analysis order by updated_at desc')
  res.json(result.rows)
})

app.use((error, _req, res, _next) => {
  res.status(500).json({ error: error.message })
})

const port = Number(process.env.PORT || 3000)
app.listen(port, () => console.log(`API running on ${port}`))
