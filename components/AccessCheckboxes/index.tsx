import { getRoles } from '../../network/roles'
import { Role } from '@prisma/client'
import { Checkbox, Col, Row } from 'antd'
import { useQuery, UseQueryResult } from 'react-query'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'

const AccessCheckboxes = ({
    value,
    onChange,
}: {
    value: string[]
    onChange(e: CheckboxValueType[]): void
}) => {
    const roles: UseQueryResult<Role[], Error> = useQuery<Role[], Error>(['roles', {}], () => getRoles())

    return (
        <Checkbox.Group value={value} style={{ width: 350 }} onChange={onChange}>
            <Row>
                {roles?.data
                    ?.filter((e) => e.id !== 'super-admin')
                    ?.map((role) => (
                        <Col key={role.id} span={8}>
                            <Checkbox value={role.id}>{role.name}</Checkbox>
                        </Col>
                    ))}
            </Row>
        </Checkbox.Group>
    )
}

export default AccessCheckboxes
