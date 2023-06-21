import NotFoundResult from '~/components/NotFoundResult'

const NotFound = () => (
    <NotFoundResult
        subtitle="Sorry, this content does not exist."
        link="/admin/contents"
        buttonText="Go to contents"
    />
)

export const revalidate = 'force-cache'

export default NotFound
