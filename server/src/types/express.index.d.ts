export { }
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
                name: string;
                email: string;
                profileImage: string
            }
        }
    }
}