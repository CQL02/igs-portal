import {HttpService} from "@/services/http.service";
import {APIConstants} from "@/constants/api.constant";
import {TaxModel} from "@/models/tax.model";
import {DiscountModel} from "@/models/discount.model";

export default class ComplianceService {
    static addTax = async (taxModel: TaxModel): Promise<boolean> => {
        try{
            return await HttpService.post(
                APIConstants.CREATE_TAX,
                taxModel
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static updateTax = async (id: number, taxModel: TaxModel): Promise<boolean> => {
        try{
            const param = {id}
            return await HttpService.put(
                APIConstants.UPDATE_TAX,
                taxModel,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static deleteTax = async (id: number): Promise<boolean> => {
        try{
            const param = {id}
            return await HttpService.delete(
                APIConstants.DELETE_TAX,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static getAllTaxes = async (): Promise<TaxModel[]> => {
        try{
            return await HttpService.get(
                APIConstants.GET_ALL_TAXES,
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static addDiscount = async (discountModel: DiscountModel): Promise<boolean> => {
        try{
            return await HttpService.post(
                APIConstants.CREATE_DISCOUNT,
                discountModel
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static updateDiscount = async (id: number, discountModel: DiscountModel): Promise<boolean> => {
        try{
            const param = {id}
            return await HttpService.put(
                APIConstants.UPDATE_DISCOUNT,
                discountModel,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static deleteDiscount = async (id: number): Promise<boolean> => {
        try{
            const param = {id}
            return await HttpService.delete(
                APIConstants.DELETE_DISCOUNT,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static getAllDiscounts = async (): Promise<DiscountModel[]> => {
        try{
            return await HttpService.get(
                APIConstants.GET_ALL_DISCOUNTS,
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}