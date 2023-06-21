import NotFoundResult from '~/components/NotFoundResult'

const NotFound = () => (
    <NotFoundResult
        subtitle="Sorry, this role does not exist."
        link="/admin/users/roles"
        buttonText="Go to roles"
    />
)

export const revalidate = 'force-cache'

export default NotFound
