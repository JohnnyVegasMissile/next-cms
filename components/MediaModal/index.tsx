// import { ReactNode, useEffect, useMemo, useState } from 'react'
// import { Button, Modal, Image, Space, Typography, Table, Input } from 'antd'
// import { getMedias } from '../../network/medias'
// import { Media, RightType } from '@prisma/client'
// import get from 'lodash.get'
import {
    SelectOutlined,
    SearchOutlined,
    VideoCameraOutlined,
    FilePdfOutlined,
    WarningOutlined,
} from '@ant-design/icons'
import { Media, MediaType } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
// import UploadButton from '../../components/UploadButton'
// import { SizeType } from 'antd/lib/config-provider/SizeContext'

import {
    Button,
    Input,
    Modal,
    Table,
    TablePaginationConfig,
    Image,
    Space,
    Typography,
    Tooltip,
    Tag,
} from 'antd'
import { SorterResult } from 'antd/es/table/interface'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'
import { getMedias } from '~/network/medias'
import { PAGE_SIZE } from '~/utilities/constants'
import UploadButton from '../UploadButton'

dayjs.extend(relativeTime)

const { Text } = Typography

// interface Props {
//     value?: Media
//     onMediaSelected: (media: Media | undefined) => void
//     type?: Me
//     size?: SizeType
//     label?: string
//     icon?: ReactNode
//     primary?: boolean
//     children?: JSX.Element
//     withoutName?: boolean
//     shape?: 'circle' | 'default' | 'round' | undefined
//     // withoutLabel?: boolean
// }

// const MediaModal = ({
//     value,
//     onMediaSelected,
//     type = 'IMAGE',
//     size = 'middle',
//     label,
//     primary = true,
//     icon,
//     children,
//     withoutName = false,
//     shape,
// }: // withoutLabel = false,
// Props) => {
//     const { me } = useAuth()
//     const [visible, setVisible] = useState(false)
//     const [selected, setSelected] = useState<Media | null>(value || null)

//     const queryClient = useQueryClient()
//     const [q, setQ] = useState<string | undefined>()
//     const debouncedQ = useDebounce<string | undefined>(q, 750)

//     const queryKeys = [
//         'medias',
//         {
//             type,
//             q: trim(debouncedQ)?.toLocaleLowerCase() || undefined,
//         },
//     ]

//     const files: UseQueryResult<Media[], Error> = useQuery<Media[], Error>(queryKeys, () =>
//         getMedias(type, trim(debouncedQ)?.toLocaleLowerCase())
//     )

//     const addFile = (file: Media) => {
//         queryClient.invalidateQueries('medias')
//         // queryClient.setQueryData(queryKeys, (oldData: any) => {
//         //     // type error
//         //     return [file, ...oldData]
//         // })
//     }

//     useEffect(() => {
//         setSelected(value || null)
//     }, [value])

//     const handleOk = () => {
//         onMediaSelected(selected!)
//         setVisible(false)
//         setSelected(null)
//     }

//     const handleCancel = () => {
//         setVisible(false)
//         setSelected(null)
//     }

//     const isLongTag = !!value?.name && value?.name?.length > 37

//     const labelType = useMemo(() => {
//         if (!!label || label === '') return label

//         const defaultLabel = 'Choose a'

//         switch (type) {
//             case 'FILE':
//                 return `${defaultLabel} file`

//             case 'IMAGE':
//                 return `${defaultLabel}n image`

//             case 'VIDEO':
//                 return `${defaultLabel} video`
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [type])

//     return (
//         <>
//             <Space>
//                 <div onClick={() => setVisible(true)}>
//                     {children ? (
//                         children
//                     ) : (
//                         <Button shape={shape} icon={icon} size={size} type={primary ? 'primary' : undefined}>
//                             {labelType}
//                         </Button>
//                     )}
//                 </div>
//                 {value && !withoutName && (
//                     <>
//                         <Text>{isLongTag ? `${value?.name.slice(0, 37)}...` : value?.name}</Text>
//                         <Button
//                             shape={shape}
//                             danger
//                             size={size}
//                             type="primary"
//                             // shape="circle"
//                             icon={<CloseOutlined />}
//                             onClick={() => onMediaSelected(undefined)}
//                         />
//                     </>
//                 )}
//             </Space>
//             <Modal
//                 centered
//                 onOk={handleOk}
//                 visible={visible}
//                 onCancel={handleCancel}
//                 title="Choose a picture"
//                 width={'calc(100vw - 150px)'}
//                 okButtonProps={{ disabled: !selected }}
//                 bodyStyle={{ minHeight: 'calc(100vh - 155px)' }}
//             >
//                 <Space size="middle" direction="vertical" style={{ width: '100%' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <Input
//                             allowClear
//                             placeholder="Search by name"
//                             prefix={<SearchOutlined />}
//                             value={q}
//                             onChange={(e) => setQ(e.target.value)}
//                             style={{ width: 180 }}
//                         />
//                         {me?.rights.includes(RightType.CREATE_MEDIA) && (
//                             <UploadButton type={type} onFileRecieved={addFile} />
//                         )}
//                     </div>

//                     <Table
//                         // bordered={false}
//                         loading={files.isLoading}
//                         dataSource={get(files, 'data', [])}
//                         columns={columns}
//                         pagination={{
//                             hideOnSinglePage: true,
//                             pageSize: get(files, 'data', []).length,
//                         }}
//                         size="small"
//                         scroll={{ y: 'calc(100vh - 300px)' }}
//                         rowKey="id"
//                         rowSelection={{
//                             type: 'radio',
//                             selectedRowKeys: !!selected?.id ? [selected?.id] : [],
//                             onChange: (selectedRowKeys: React.Key[], selectedRows: Media[]) =>
//                                 setSelected(get(selectedRows, '0', undefined)),
//                         }}
//                     />
//                 </Space>
//             </Modal>
//         </>
//     )
// }

// const columns = [
//     {
//         width: 75,
//         render: (image: Media) => (
//             <Image width={50} height={50} src={`/storage/images/${image.uri}`} alt="" />
//         ),
//     },
//     {
//         title: 'Name',
//         // dataIndex: 'name',
//         render: (image: Media) => (
//             <a target="_blank" rel="noreferrer" href={`/storage/images/${image.uri}`}>
//                 {image.name}
//             </a>
//         ),
//     },
//     {
//         width: 150,
//         title: 'Upload Time',
//         dataIndex: 'uploadTime',
//         render: (e: Date) => moment(e).fromNow(),
//     },
// ]

const columns = [
    {
        sorter: true,
        title: 'Name',
        key: 'name',
        render: (
            media: Media & {
                _count: {
                    usedInSections: number
                }
            }
        ) => (
            <div>
                <Space align="center" size="large">
                    {media.type === MediaType.IMAGE && (
                        <Image
                            width={35}
                            style={{ height: 35, width: 35, objectFit: 'contain', objectPosition: 'center' }}
                            src={`/storage/${media.type.toLocaleLowerCase()}s/${media.uri}`}
                            alt={media.alt || ''}
                        />
                    )}
                    {media.type === MediaType.VIDEO && (
                        <VideoCameraOutlined
                            style={{ fontSize: 21, color: 'rgba(0,0,0,.45)' }}
                            rev={undefined}
                        />
                    )}
                    {media.type === MediaType.FILE && (
                        <FilePdfOutlined style={{ fontSize: 21, color: 'rgba(0,0,0,.45)' }} rev={undefined} />
                    )}
                    <Text>{media?.name}</Text>
                    {!media._count.usedInSections && (
                        <Tooltip title="This media is not used anywhere">
                            <Tag color="red" icon={<WarningOutlined rev={undefined} />}>
                                Unused
                            </Tag>
                        </Tooltip>
                    )}
                </Space>
            </div>
        ),
    },
    {
        sorter: true,
        title: 'Last updated',
        key: 'updatedAt',
        render: (media: Media) => dayjs(media.updatedAt).fromNow(),
    },
]

interface MediaModalProps {
    mediaType: MediaType
    value: Media | undefined
    onChange(e: Media | undefined): void
}

const MediaModal = ({ mediaType, value, onChange }: MediaModalProps) => {
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [q, setQ] = useState<string>('')
    const [sort, setSort] = useState<`${string},${'asc' | 'desc'}`>()
    const [selected, setSelected] = useState<Media | undefined>(value || undefined)

    const medias = useQuery(['medias', { page, q, sort, type: mediaType }], () =>
        getMedias(page, q, sort, { type: mediaType })
    )

    useEffect(() => {
        setSelected(value || undefined)
    }, [value])

    const handleOk = () => {
        onChange(selected)
        setOpen(false)
        setSelected(undefined)
    }

    const handleCancel = () => {
        setOpen(false)
        setSelected(undefined)
    }

    const handleTableChange = (
        pagination: TablePaginationConfig,
        _: any,
        sorter: SorterResult<any> | SorterResult<any>[]
    ) => {
        if (!Array.isArray(sorter) && !!sorter.columnKey && !!sorter.order) {
            setSort(`${sorter.columnKey},${sorter.order === 'ascend' ? 'asc' : 'desc'}`)
        } else {
            setSort(undefined)
        }

        setPage(pagination.current || 1)
    }

    let typeLabel = 'n image'
    if (mediaType === 'FILE') typeLabel = ' file'
    if (mediaType === 'VIDEO') typeLabel = ' video'

    return (
        <>
            <Button
                size="small"
                type="primary"
                icon={<SelectOutlined rev={undefined} />}
                onClick={() => setOpen(true)}
            >
                {`Select a${typeLabel}`}
            </Button>

            <Modal
                open={open}
                centered
                title={`Choose a${typeLabel}`}
                width={'calc(100vw - 1rem)'}
                // okButtonProps={{ disabled: !selected }}
                okButtonProps={{ size: 'small' }}
                onOk={handleOk}
                okText="Select"
                cancelButtonProps={{ size: 'small' }}
                onCancel={handleCancel}
                bodyStyle={{
                    minHeight: 'calc(100vh - 10rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <div
                    style={{
                        marginTop: '0.5rem',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Input
                        allowClear
                        size="small"
                        prefix={<SearchOutlined rev={undefined} />}
                        placeholder="Search by name"
                        style={{ width: 190 }}
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <UploadButton />
                </div>

                <Table
                    onChange={handleTableChange}
                    rowKey="id"
                    size="small"
                    loading={medias.isLoading}
                    columns={columns}
                    dataSource={medias.data?.results as object[]}
                    pagination={{
                        total: medias.data?.count,
                        pageSize: PAGE_SIZE,
                        showSizeChanger: false,
                        current: page,
                        showTotal: (total) =>
                            `${(page - 1) * PAGE_SIZE}-${
                                (page - 1) * PAGE_SIZE + (medias.data?.results.length || 0)
                            } of ${total}`,
                    }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: !!selected?.id ? [selected?.id] : [],
                        onChange: (_, media) => (!!media.length ? setSelected(media[0] as Media) : undefined),
                    }}
                    // scroll={{ y: 300 }}
                />
            </Modal>
        </>
    )
}

export default MediaModal
