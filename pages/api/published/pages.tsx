import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    // const pages = await prisma.page.findMany()

    return res.status(200).json({ message: 'GET request successfull' })
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    // const pages = await prisma.page.findMany()

    return res.status(200).json({ message: 'POST request successfull' })
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    // const pages = await prisma.page.findMany()

    return res.status(200).json({ message: 'PUT request successfull' })
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    // const pages = await prisma.page.findMany()

    return res.status(200).json({ message: 'DELETE request successfull' })
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const pages = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET': {
            return await GET(req, res)
        }

        case 'POST': {
            return await POST(req, res)
        }

        case 'PUT': {
            return await PUT(req, res)
        }

        case 'DELETE': {
            return await DELETE(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default pages
