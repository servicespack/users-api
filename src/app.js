import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import routers from './routers/index.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(helmet())

app.use('/api', routers.root)
app.use('/api/users', routers.users)
app.use('/api/tokens', routers.tokens)
app.use('/api/verifications', routers.verifications)

import('./listeners/index.js')

export default app
