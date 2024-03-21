import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
    constructor() {}
    async create() {
        return 'create order';
    }
}
