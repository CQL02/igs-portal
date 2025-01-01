import {HttpService} from "@/services/http.service";
import {APIConstants} from "@/constants/api.constant";
import {ProductModel} from "@/models/product.model";

export default class ProductService {
    static addProduct = async (productModel: ProductModel): Promise<boolean> => {
        try{
            return await HttpService.post(
                APIConstants.CREATE_PRODUCT,
                productModel
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static updateProduct = async (id: number, productModel: ProductModel): Promise<boolean> => {
        try{
            const param = {id}
            return await HttpService.put(
                APIConstants.UPDATE_PRODUCT,
                productModel,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static deleteProduct = async (id: number): Promise<boolean> => {
        try{
            const param = {id}
            return await HttpService.delete(
                APIConstants.DELETE_PRODUCT,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static getAllProducts = async (): Promise<ProductModel[]> => {
        try{
            return await HttpService.get(
                APIConstants.GET_ALL_PRODUCTS,
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}