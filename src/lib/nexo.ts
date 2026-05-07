import { create } from '@tiendanube/nexo'

const clientId = import.meta.env.VITE_CLIENT_ID ?? '31045'

export const nexo = create({ clientId, log: true })
