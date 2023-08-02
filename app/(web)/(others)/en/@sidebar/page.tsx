import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomeEN = async () => <PagesDisplays.Page lang={CodeLanguage.EN} sidebar />

export default HomeEN
