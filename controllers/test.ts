import { Request, Response } from "express"

interface controllerTypes {
    (req: Request, res: Response): void;
}

export const testController: controllerTypes = (req, res) => {
    res.status(200).send({
        success: true,
        message: 'Everything works fine...'
    })
}