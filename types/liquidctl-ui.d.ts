export type ApiMessage = {
    message: string
}

export type ConfigStatus = {
    key: string,
    value: string,
    unit: string
  }
  
export type Config = {
    address: string,
    bus: string,
    description: string,
    status: [ConfigStatus]
  }
  