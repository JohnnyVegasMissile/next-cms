import INSTANCE from './api'
import { Setting } from '@prisma/client'
import SettingsCreation from '~/types/settingsCreation'

export const getSettings = (): Promise<Setting[]> =>
    INSTANCE({
        method: 'GET',
        url: `/api/settings`,
        headers: {
            'Content-Type': 'application/json',
        },
    })

export const updateSettings = (data: SettingsCreation): Promise<Setting[]> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/settings`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })
