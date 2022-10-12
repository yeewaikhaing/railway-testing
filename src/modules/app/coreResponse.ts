import { MedusaError } from "medusa-core-utils";

export function core_response(code: string, data: any){

    let res = new Array();
    let status = 500;
    if(code == MedusaError.Types.INVALID_DATA) {
        status = 400;
    }
    else if(code == MedusaError.Types.DUPLICATE_ERROR) {
        status = 401;
    }
    else if(code == MedusaError.Types.NOT_ALLOWED) {
        status = 403;
    }

    res['code'] = status;
    res['body'] = data;

    return res;
}