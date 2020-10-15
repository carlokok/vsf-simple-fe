import { Ref, ref } from '@vue/composition-api';
import { stockList, SearchStockItem } from '~/api-client';

export interface Stock {
    sku: string,
    stock: number
}

export interface UseStockFactoryParams {
    loadStock: (skus: string[]) => Promise<Stock[]>
}

export interface UseStock {
    loadingStock: Ref<boolean>,
    loadStockForSkus(skus: string[]): Promise<void>,
    getStock(sku: string): number
}

export function useStockFactory(params: UseStockFactoryParams) {
    return function useStock(): UseStock {
        var loading = ref(false);
        var stockdata: Stock[] = [];

        
        return {
            loadingStock: loading,
            loadStockForSkus: async (skus) =>{
                loading.value = true;
                try {
                    if (skus == null || !skus.length)
                        stockdata = [];
                    else
                        stockdata = await params.loadStock(skus);
                } catch {
                    stockdata = [];
                }
                loading.value = false;
            },
            getStock: (sku) => {
                let data = stockdata.find(e => e.sku == sku);
                return data?.stock || 0;
            }
        }
    }

    }
    const loading = ref(false);
;

const useStock: (id: string) => UseStock = useStockFactory({
    loadStock: async(skus) => (await stockList(skus.join(',')))!.data!.map((e: SearchStockItem) => ({
        sku: e.sku|| "",
        stock: e.stock || 0
    }))
});

export default useStock;