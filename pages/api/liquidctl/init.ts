import type { NextApiRequest, NextApiResponse } from "next";
import shelljs from "shelljs";

type Data = {
  message?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const hasLiquidCtl = shelljs.which("liquidctl");

  if (!hasLiquidCtl) {
    res.status(400).json({ message: "liquidctl not installed" });
    return;
  }

  const command = `liquidctl initialize all --json`;

  return new Promise(resolve => {
    shelljs.exec(command, { async: true }, (code, stdout, stderr) => {
      if (stderr) {
        res.status(400).json({ message: stderr });
        resolve(false);
      }
  
      if (stdout) {
        res.status(200).json(JSON.parse(stdout));
        resolve(true);
      }
    });
  })

}
