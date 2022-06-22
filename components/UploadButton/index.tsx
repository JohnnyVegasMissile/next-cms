import { useState } from 'react'
import { Button, Space, Typography } from 'antd'
import { UploadOutlined, CloseOutlined } from '@ant-design/icons'

import { uploadFile } from '../../network/admin'

// export const uploadFile = (file) =>
//     new Promise((resolve, reject) => {
//         const token = localStorage.getItem('token')

//         const data = new FormData()
//         data.append('file', file)

//         INSTANCE({
//             method: 'post',
//             url: `/files/page-image`,
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//             data,
//         })
//             .then(resolve)
//             .catch(reject)
//     })

// interface File

const UploadButton = () => {
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState<File | null>(null)

    const handleFiles = async (event: any) => {
        setLoading(true)
        const file = event.target.files[0]
        if (!file) return
        // if (file.size >= fileSize * 1024 * 1024) {
        //     return
        // }

        const res = await uploadFile(file)

        setLoading(false)
        setValue(res)
    }

    return (
        <Space>
            <Button
                icon={<UploadOutlined />}
                style={{ position: 'relative' }}
                loading={loading}
            >
                Upload
                <input
                    style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        fontSize: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        opacity: 0,
                        zIndex: 1,
                    }}
                    type="file"
                    name="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFiles}
                    // onChange={(e) => {
                    //     toggleModal()
                    //     handleFiles(e)
                    // }}
                    onClick={(event: any) => {
                        event.target.value = null
                    }}
                />
            </Button>
            {value && (
                <>
                    <Typography.Text underline>{value?.name}</Typography.Text>
                    <Button
                        onClick={() => setValue(null)}
                        shape="circle"
                        icon={<CloseOutlined />}
                    />
                </>
            )}
        </Space>
    )
}

export default UploadButton
