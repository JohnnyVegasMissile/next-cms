import { CodeLanguage } from '@prisma/client'
import OthersNotFound from '../../OthersNotFound'

const NotFoundFr = async () => <OthersNotFound lang={CodeLanguage.FR} />

export const revalidate = Infinity

export default NotFoundFr
