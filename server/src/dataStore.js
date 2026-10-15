import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initialReviews } from '../../client/src/data/resortData.js'

const serverDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataFile = process.env.DATA_FILE || path.join(serverDirectory, 'data', 'site-data.json')
let initialization
let pendingWrite = Promise.resolve()

function createInitialData() {
  return {
    reviews: initialReviews,
    inquiries: [],
    bookings: [],
    feedback: [],
  }
}

async function ensureStore() {
  if (!initialization) {
    initialization = (async () => {
      await mkdir(path.dirname(dataFile), { recursive: true })
      try {
        await readFile(dataFile, 'utf8')
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
        await writeFile(dataFile, JSON.stringify(createInitialData(), null, 2), 'utf8')
      }
    })()
  }
  await initialization
}

async function readStore() {
  await ensureStore()
  return JSON.parse(await readFile(dataFile, 'utf8'))
}

async function updateStore(update) {
  const operation = pendingWrite.then(async () => {
    const store = await readStore()
    const result = update(store)
    const temporaryFile = `${dataFile}.tmp`
    await writeFile(temporaryFile, JSON.stringify(store, null, 2), 'utf8')
    await rename(temporaryFile, dataFile)
    return result
  })
  pendingWrite = operation.catch(() => {})
  return operation
}

export { readStore, updateStore }
