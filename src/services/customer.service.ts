import {HttpService} from "@/services/http.service";
import {APIConstants} from "@/constants/api.constant";
import {CustomerModel} from "@/models/customer.model";

export default class CustomerService {

    static addCustomer = async (customerModel: CustomerModel): Promise<boolean> => {
        try{
            return await HttpService.post(
                APIConstants.CREATE_CUSTOMER,
                customerModel
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static updateCustomer = async (id: number, customerModel: CustomerModel): Promise<boolean> => {
        try{
            const param = {id}
            return await HttpService.put(
                APIConstants.UPDATE_CUSTOMER,
                customerModel,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static deleteCustomer = async (id: number): Promise<boolean> => {
        try{
            const param = {id}
            return await HttpService.delete(
                APIConstants.DELETE_CUSTOMER,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static getAllCustomers = async (): Promise<CustomerModel[]> => {
        try{
            return await HttpService.get(
                APIConstants.GET_ALL_CUSTOMERS,
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}