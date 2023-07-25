import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomeZh = async () => <PagesDisplays.Page lang={CodeLanguage.ZH} slug={['zh']} />

export const revalidate = Infinity

export default HomeZh