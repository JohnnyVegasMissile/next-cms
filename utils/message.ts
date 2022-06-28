import { message } from 'antd'

export const success = (text: string, time: number = 3) =>
    message.success(text, time)

export const error = (text: string, time: number = 3) =>
    message.error(text, time)

export const warning = (text: string, time: number = 3) =>
    message.warning(text, time)
