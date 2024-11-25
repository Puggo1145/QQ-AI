export interface StandardResponse<T> {
    status: "ok" | string;
    retcode: number;
    data: T;
    message: string;
    wording: string;
}
