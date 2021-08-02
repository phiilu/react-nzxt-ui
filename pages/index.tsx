import * as React from "react";
import { HuePicker, ColorResult } from "react-color";

import { Config } from "../types/liquidctl-ui";

function api<T>(
  input: RequestInfo,
  init?: RequestInit | undefined
): Promise<T> {
  return fetch(input, init).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((errorJson) => {
      throw new Error(errorJson.message);
    });
  });
}

function getLed({device, accessory}: {device: string, accessory: string}) {

  if(device.includes('NZXT Kraken X')) {
    if(accessory.includes('Logo')) return 'logo';
    if(accessory.includes('Ring')) return 'ring';
  }

  if(device.includes('NZXT Smart Device V2')) {
    const [, number] = accessory.split(' ');
    return `led${number}`
  }


  return 'unknown'
}

export default function Home() {
  const [colors, setColors] = React.useState<Record<string, string>>({});
  const [config, setConfig] = React.useState<Array<Config>>([]);

  function handleColorChange(led: string) {
    return (color: ColorResult) => {
      setColors({
        ...colors,
        [led]: color.hex,
      });
    };
  }

  function handleColorChangeComplete(device: string, led: string) {
    return async (color: ColorResult) => {
      
      const url = new URL("http://localhost:3000/api/liquidctl");
      url.searchParams.append("led", led)
      url.searchParams.append("device", device)
      url.searchParams.append("color", color.hex.replace("#", ""));

      try {
        const response = await api(url.toString());
        console.log(JSON.stringify(response, null, 2));
      } catch (error) {
        console.log(error);
      }
    };
  }

  React.useEffect(() => {
    async function init() {
      try {
        const newConfig = await api<Array<Config>>("/api/liquidctl/init");
        console.log(newConfig);
        setConfig(newConfig);
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, []);

  if (config.length < 1) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      <h1>RGB UI</h1>

      {config.map((c) => {
        const device = c.description;
        return (
          <div key={c.address}>
            <h2>{device}</h2>
            <ul>
              {c.status.map((cs) => {
                const led = getLed({device, accessory: cs.key});
                return (
                  <li key={cs.key}>
                    <div>
                      {cs.key} - {cs.value} {cs.unit}
                      {cs.key.includes('LED') && <HuePicker
                        color={colors[led] ?? "#ffffff"}
                        onChange={handleColorChange(led)}
                        onChangeComplete={handleColorChangeComplete(device, led)}
                      />}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
