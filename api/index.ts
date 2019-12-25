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
  const ltsVersions: { [lts: string]: string[] } = Object.create(null)
  dist.forEach(({ version, lts }) => {
    if (lts === false) return
    const ltsLowerCase = lts.toLowerCase()
    if (!(ltsLowerCase in ltsVersions)) {
      ltsVersions[ltsLowerCase] = [version]
    } else {
      ltsVersions[ltsLowerCase].push(version)
    }
  })
  res.json(ltsVersions)
}