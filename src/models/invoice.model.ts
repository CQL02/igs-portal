import {InvoiceItemModel} from "@/models/invoice-item.model";

export class InvoiceModel {
    id?: string;
    merId?: number;
    cusId?: number;
    disId?: number;
    taxId?: number;
    createdOn?: Date;
    subtotal?: number;
    totalDiscount?: number;
    totalTax?: number;
    totalPrice?: number;
    invoiceItemModelList: Array<InvoiceItemModel>;
}