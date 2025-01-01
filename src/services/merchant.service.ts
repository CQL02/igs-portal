import {HttpService} from "@/services/http.service";
import {APIConstants} from "@/constants/api.constant";
import {MerchantModel} from "@/models/merchant.model";

export default class MerchantService {
    static addMerchant = async (merchantModel: MerchantModel): Promise<boolean> => {
        try{
            return await HttpService.post(
                APIConstants.CREATE_MERCHANT,
                merchantModel
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static updateMerchant = async (id: number, merchantModel: MerchantModel): Promise<boolean> => {
        try{
            const param = {id}
            return await HttpService.put(
                APIConstants.UPDATE_MERCHANT,
                merchantModel,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static deleteMerchant = async (id: number): Promise<boolean> => {
        try{
            const param = {id}
            return await HttpService.delete(
                APIConstants.DELETE_MERCHANT,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static getAllMerchants = async (): Promise<MerchantModel[]> => {
        try{
            return await HttpService.get(
                APIConstants.GET_ALL_MERCHANTS,
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}