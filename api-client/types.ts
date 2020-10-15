import { AggregateField } from './swagger';

export class CatalogAttributesRequest {
    public skip?: number
    public take?: number
}
export class CatalogCategoryRequest {
    public levels?: Array<number>
    public active?: boolean
    public skip?: number
    public take?: number
    public parentId?: string
    public slug?: string
    public id?: Array<string>
    public urlPath?: string
    public sort?: string
    public filter?: string
}

export class CatalogProductRequest {
    public visibility?: Array<number>
    public status?: Array<number>
    public categoryId?: Array<string>
    public filter?: string
    public skip?: number
    public take?: number
    public urlpath?: string
    public sort?: string
    public sku?: Array<string>
    public categoryKeywords?: Array<string>
    public propertyFilters?: { [key: string]: Array<string> }
    public aggregates?: Array<AggregateField>
    public configurableChildren?: Array<string>
}

export class CatalogReviewRequest {
    public productId?: string
    public take?: number
    public skip?: number
}
