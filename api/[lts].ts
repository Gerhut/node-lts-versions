import { NowRequest, NowResponse } from '@now/node'
import fetch from 'node-fetch'

interface Dist {
  version: string
  lts: false | string
}

export default async (req: NowRequest, res: NowResponse) => {
  const response = await fetch('https://nodejs.org/dist/index.json')
  if (!response.ok) {
    res.status(response.status)
    res.send(response.statusText)
    return
  }

  const dist: Dist[] = await response.json()
  const { lts: requestLts } = req.query
  const requestLtsLowerCase = typeof requestLts === 'string'
    ? requestLts.toLowerCase()
    : requestLts[0].toLowerCase()
  const versions = dist
    .filter(({ lts }) => lts !== false && lts.toLowerCase() === requestLtsLowerCase)
    .map(({ version }) => version)
  res.json(versions)
}
