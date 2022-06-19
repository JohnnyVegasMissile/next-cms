import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const elements = async (req: NextApiRequest, res: NextApiResponse) => {
    const pages = await prisma.page.findMany()

    switch (req.method) {
        case 'GET':
            return res.status(200).json({ message: 'GET request successfull' })
        case 'POST':
            return res.status(200).json({ message: 'POST request successfull' })
        case 'PUT':
            return res.status(200).json({ message: 'PUT request successfull' })
        case 'DELETE':
            return res
                .status(200)
                .json({ message: 'DELETE request successfull' })

        default:
            return res.status(405).json({ error: 'Method not allowed' })
    }
}

export default elements
