import {HttpService} from "@/services/http.service";
import {APIConstants} from "@/constants/api.constant";
import {InvoiceModel} from "@/models/invoice.model";
import {InvoiceItemModel} from "@/models/invoice-item.model";

export default class InvoiceService {
    static addInvoice = async (invoiceModel: InvoiceModel): Promise<boolean> => {
        try{
            return await HttpService.post(
                APIConstants.CREATE_INVOICE,
                invoiceModel
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static updateInvoice = async (id: string, invoiceModel: InvoiceModel): Promise<boolean> => {
        try{
            const param = {id}
            return await HttpService.put(
                APIConstants.UPDATE_INVOICE,
                invoiceModel,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static deleteInvoice = async (id: string): Promise<boolean> => {
        try{
            const param = {id}
            return await HttpService.delete(
                APIConstants.DELETE_INVOICE,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static getAllInvoices = async (): Promise<InvoiceModel[]> => {
        try{
            return await HttpService.get(
                APIConstants.GET_ALL_INVOICES,
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static readonly previewInvoice = async (invoiceModel: InvoiceModel): Promise<Map<string, string>> => {
        try{
            return await HttpService.post(
                APIConstants.PREVIEW_INVOICE,
                invoiceModel
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static readonly downloadInvoice = async (id: string): Promise<void> => {
        try{
            const queryParams = new URLSearchParams({ id }).toString();
            const url = `${APIConstants.DOWNLOAD_INVOICE}?${queryParams}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to download invoice. Status: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();

            const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static getInvoiceItemsById = async (id: string): Promise<InvoiceItemModel[]> => {
        try{
            const param = {id}
            return await HttpService.get(
                APIConstants.GET_INVOICE_ITEMS_BY_INV_ID,
                param
            )
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}