import { CodeLanguage } from '@prisma/client'
import OthersNotFound from '../../OthersNotFound'

const NotFoundZh = async () => <OthersNotFound lang={CodeLanguage.ZH} />

export const revalidate = Infinity

export default NotFoundZh
