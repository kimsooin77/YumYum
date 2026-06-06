import { CategoriesRepository } from './categories.repository';
export declare class CategoriesService {
    private readonly categoriesRepository;
    constructor(categoriesRepository: CategoriesRepository);
    findAll(): Promise<{
        id: number;
        name: string;
    }[]>;
}
