export class APIConstants {
    static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
    static readonly SUFFIX = "/";
    static readonly HOST_PREFIX = this.BASE_URL + this.SUFFIX;
    static readonly CREATE = "create";
    static readonly UPDATE = "update";
    static readonly DELETE = "delete";


    static readonly MERCHANT_PREFIX = this.HOST_PREFIX + "merchant" + this.SUFFIX;
    static readonly CUSTOMER_PREFIX = this.HOST_PREFIX + "customer" + this.SUFFIX;
    static readonly PRODUCT_PREFIX = this.HOST_PREFIX + "product" + this.SUFFIX;
    static readonly COMPLIANCE_PREFIX = this.HOST_PREFIX + "compliance" + this.SUFFIX;
    static readonly TAX_PREFIX = this.COMPLIANCE_PREFIX + "tax" + this.SUFFIX;
    static readonly DISCOUNT_PREFIX = this.COMPLIANCE_PREFIX + "discount" + this.SUFFIX;
    static readonly INVOICE_PREFIX = this.HOST_PREFIX + "invoice" + this.SUFFIX;

    // Merchant
    static readonly CREATE_MERCHANT = this.MERCHANT_PREFIX + this.CREATE;
    static readonly UPDATE_MERCHANT = this.MERCHANT_PREFIX + this.UPDATE;
    static readonly DELETE_MERCHANT = this.MERCHANT_PREFIX + this.DELETE;
    static readonly GET_MERCHANT_BY_ID = this.MERCHANT_PREFIX + "get-merchant-by-id";
    static readonly GET_ALL_MERCHANTS = this.MERCHANT_PREFIX + "get-all-merchants";

    // Customer
    static readonly CREATE_CUSTOMER = this.CUSTOMER_PREFIX + this.CREATE;
    static readonly UPDATE_CUSTOMER = this.CUSTOMER_PREFIX + this.UPDATE;
    static readonly DELETE_CUSTOMER = this.CUSTOMER_PREFIX + this.DELETE;
    static readonly GET_CUSTOMER_BY_ID = this.CUSTOMER_PREFIX + "get-customer-by-id";
    static readonly GET_ALL_CUSTOMERS = this.CUSTOMER_PREFIX + "get-all-customers";

    // Product
    static readonly CREATE_PRODUCT = this.PRODUCT_PREFIX + this.CREATE;
    static readonly UPDATE_PRODUCT = this.PRODUCT_PREFIX + this.UPDATE;
    static readonly DELETE_PRODUCT = this.PRODUCT_PREFIX + this.DELETE;
    static readonly GET_PRODUCT_BY_ID = this.PRODUCT_PREFIX + "get-product-by-id";
    static readonly GET_ALL_PRODUCTS = this.PRODUCT_PREFIX + "get-all-products";

    // Compliance
    static readonly CREATE_TAX = this.TAX_PREFIX + this.CREATE;
    static readonly UPDATE_TAX = this.TAX_PREFIX + this.UPDATE;
    static readonly DELETE_TAX = this.TAX_PREFIX + this.DELETE;
    static readonly GET_TAX_BY_ID = this.TAX_PREFIX + "get-tax-by-id";
    static readonly GET_ALL_TAXES = this.TAX_PREFIX + "get-all-taxes";
    static readonly CREATE_DISCOUNT = this.DISCOUNT_PREFIX + this.CREATE;
    static readonly UPDATE_DISCOUNT = this.DISCOUNT_PREFIX + this.UPDATE;
    static readonly DELETE_DISCOUNT = this.DISCOUNT_PREFIX + this.DELETE;
    static readonly GET_DISCOUNT_BY_ID = this.DISCOUNT_PREFIX + "get-discount-by-id";
    static readonly GET_ALL_DISCOUNTS = this.DISCOUNT_PREFIX + "get-all-discounts";

    // Invoice
    static readonly CREATE_INVOICE = this.INVOICE_PREFIX + this.CREATE;
    static readonly UPDATE_INVOICE = this.INVOICE_PREFIX + this.UPDATE;
    static readonly DELETE_INVOICE = this.INVOICE_PREFIX + this.DELETE;
    static readonly GET_INVOICE_BY_ID = this.INVOICE_PREFIX + "get-invoice-by-id";
    static readonly GET_ALL_INVOICES = this.INVOICE_PREFIX + "get-all-invoices";
    static readonly PREVIEW_INVOICE = this.INVOICE_PREFIX + "preview-invoice";
    static readonly DOWNLOAD_INVOICE = this.INVOICE_PREFIX + "download-invoice";
    static readonly GET_INVOICE_ITEMS_BY_INV_ID = this.INVOICE_PREFIX + "get-invoice-items-by-inv-id";



}