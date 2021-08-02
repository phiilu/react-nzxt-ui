// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import shelljs from "shelljs"

import {Config, ApiMessage} from '../../types/liquidctl-ui'


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Config | ApiMessage>
) {
  const hasLiquidCtl = shelljs.which("liquidctl")

  if(!hasLiquidCtl) {
    res.status(400).json({ message: 'liquidctl not installed' })
    return;
  }

  const color = req.query.color as string
  const device = req.query.device as string
  const led = req.query.led as string

  console.log(led)

  const command = `liquidctl --match "${device}" set ${led ?? 'sync'} color fixed ${color}`

  const success = shelljs.exec(command)
  console.debug('exec: ', command)
  if(success) {
    res.status(200).json({ message: `Color changed to ${color}` })
  } else {
    res.status(200).json({ message: 'Could not change color' })

  }

}
