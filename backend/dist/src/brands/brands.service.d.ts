import { BrandsRepository } from './brands.repository';
export declare class BrandsService {
    private readonly brandsRepository;
    constructor(brandsRepository: BrandsRepository);
    findAll(): Promise<{
        id: number;
        name: string;
    }[]>;
}
