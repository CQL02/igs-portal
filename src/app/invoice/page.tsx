"use client"

import React, {useEffect, useState} from "react";
import {CustomerModel} from "@/models/customer.model";
import {Button, Form, Input, Modal, Row, Select, Space, Table} from "antd";
import CustomerService from "@/services/customer.service";
import {DeleteOutlined, DownloadOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {NamePath} from "rc-field-form/es/interface";
import PageLayout from "@/app/page";
import {InvoiceModel} from "@/models/invoice.model";
import InvoiceService from "@/services/invoice.service";
import {TaxModel} from "@/models/tax.model";
import {DiscountModel} from "@/models/discount.model";
import {MerchantModel} from "@/models/merchant.model";
import {ProductModel} from "@/models/product.model";
import ProductService from "@/services/product.service";
import MerchantService from "@/services/merchant.service";
import ComplianceService from "@/services/compliance.service";
import {InvoiceItemModel} from "@/models/invoice-item.model";

interface SelectOptions {
    label: any;
    value: any;
    data?: any;
}

interface ProductRow {
    productId: string;
    quantity: number;
    description: string;
}

const columns = [
    {key: "id", title: "Invoice", dataIndex: "id", width: "80%"},
    {key: "createdOn", title: "Created On", dataIndex: "createdOn", width: "11%"},
    {key: "action", title: "Action(s)", dataIndex: "action", width: "9%"},
]

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formMode, setFormMode] = useState<"add" | "edit">("add");
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceModel | null>(null);
    const [form] = Form.useForm();
    const [formLoading, setFormLoading] = useState<boolean>(false);
    const [taxOptions, setTaxOptions] = useState<SelectOptions[] | undefined>([]);
    const [discountOptions, setDiscountOptions] = useState<SelectOptions[] | undefined>([]);
    const [merchantOptions, setMerchantOptions] = useState<SelectOptions[] | undefined>([]);
    const [customerOptions, setCustomerOptions] = useState<SelectOptions[] | undefined>([]);
    const [productOptions, setProductOptions] = useState<SelectOptions[] | undefined>([]);
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItemModel[]>([]);

    const [isPreviewModelVisible, setIsPreviewModelVisible] = useState<boolean>(false);
    const [pdfBase64, setPdfBase64] = useState<string>("");

    const getAllInvoices = async () => {
        try {
            setLoading(true);
            const response = await InvoiceService.getAllInvoices();
            setInvoices(response);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllInvoices().then()
    }, []);

    const getAllOptions = async () => {
        setLoading(true);
        try {
            const [merchants, customers, discounts, taxes, products] = await Promise.all([
                MerchantService.getAllMerchants(),
                CustomerService.getAllCustomers(),
                ComplianceService.getAllDiscounts(),
                ComplianceService.getAllTaxes(),
                ProductService.getAllProducts()
            ]);
            setMerchantOptions(merchants.map((m: MerchantModel): SelectOptions => {
                const addressParts = [
                    m.addrLine1,
                    m.addrLine2 ? `\n${m.addrLine2}` : "",
                    `${m.postcode} ${m.city}`,
                    `${m.state}, ${m.country}`
                ].filter(Boolean).join("<br>");
                return {value: m.id, label: m.companyName, data: addressParts};
            }));
            setCustomerOptions(customers.map((c: CustomerModel): SelectOptions => {
                const addressParts = [
                    c.companyName,
                    c.addrLine1,
                    c.addrLine2 ? `\n${c.addrLine2}` : "",
                    `${c.postcode} ${c.city}`,
                    `${c.state}, ${c.country}`
                ].filter(Boolean).join("<br />");
                return {value: c.id, label: c.pic, data: addressParts};
            }));
            setDiscountOptions(discounts.map((d: DiscountModel): SelectOptions => ({
                value: d.id,
                label: d.discountName
            })));
            setTaxOptions(taxes.map((t: TaxModel): SelectOptions => ({value: t.id, label: t.taxName})));
            setProductOptions(products.map((p: ProductModel): SelectOptions => ({value: p.id, label: p.productName})));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllOptions().then();
    }, []);

    const showModal = async (mode: "add" | "edit", invoice?: InvoiceModel) => {
        setFormMode(mode);
        if (mode === "edit" && invoice) {
            try{
                const response = await InvoiceService.getInvoiceItemsById(invoice.id!)
                invoice.invoiceItemModelList = response
            } catch (error) {
                console.error(error);
            }
            setSelectedInvoice(invoice);
            form.setFieldsValue(invoice);
        } else {
            setSelectedInvoice(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handlePreview = async (values: InvoiceModel) => {
        try {
            setFormLoading(true);
            if(formMode === "edit") {
                values.id = selectedInvoice?.id;
            }
            const preview = await InvoiceService.previewInvoice(values);
            setPdfBase64(preview.pdf!);
            setIsPreviewModelVisible(true);
        } catch (error) {
            console.error("Error submitting form: ", error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleSubmit = async (values: InvoiceModel) => {
        try {
            setFormLoading(true);
            if(formMode === "add"){
                await InvoiceService.addInvoice(values)
            } else if (formMode === "edit" && selectedInvoice){
                await InvoiceService.updateInvoice(selectedInvoice.id!, {...selectedInvoice, ...values});
            }
            setIsModalVisible(false);
            setIsPreviewModelVisible(false);
            await getAllInvoices().then();
        } catch (error) {
            console.error("Error submitting form: ", error);
        } finally {
            setFormLoading(false);
        }
    }

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            await InvoiceService.deleteInvoice(id);
            await getAllInvoices().then();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDownload = async (id: string) => {
        try{
            setLoading(true);
            await InvoiceService.downloadInvoice(id);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const TABLE_HEADER = columns.map((column) => {
        switch (column.key) {
            case 'createdOn':
                return {
                    ...column,
                    render: (text, record) => {
                        const date = new Date(record.createdOn);
                        const formatter = new Intl.DateTimeFormat("en-GB", {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })
                        return formatter.format(date);
                    }
                };
            case 'action':
                return {
                    ...column,
                    render: (text: any, record: any) => (
                        <Row justify={"space-around"}>
                            <Button icon={<EditOutlined/>} onClick={() => showModal("edit", record)}/>
                            <Button icon={<DeleteOutlined/>} onClick={() => handleDelete(record.id)}/>
                            <Button icon={<DownloadOutlined/>} onClick={() => handleDownload(record.id)}/>
                        </Row>
                    ),
                };
            default:
                return column;
        }
    });

    const renderCustomOption = (menu: React.ReactNode) => (
        <div>
            {menu}
        </div>
    );

    const renderFormItem = (
        label: string,
        name: keyof InvoiceModel,
        selectData: SelectOptions[],
        placeholder: string,
        required: boolean = false,
    ) => (
        <Form.Item<CustomerModel>
            label={label}
            name={name as NamePath}
            labelCol={{span: 10}}
            labelAlign={"left"}
            className={"mb-2"}
            rules={required ? [{required: true, message: `Please enter the ${label.toLowerCase()}`}] : []}
        >
            <Select
                placeholder={`Select ${label}`}
                style={{ width: "100%" }}
                dropdownRender={(menu) => renderCustomOption(menu)}
                optionLabelProp={"label"}
                allowClear
            >
                {selectData.map((option) => (
                    <Select.Option key={option.value} value={option.value} label={option.label} >
                        <div>
                            <div>{option.label}</div>
                            <div className={"text-sm text-gray-400"}
                                 dangerouslySetInnerHTML={{ __html: option.data }}/>
                        </div>
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    );

    return (
        <PageLayout>
            <div className={"text-3xl font-bold pt-6"}>Invoice</div>
            <div className={"justify-end w-full flex my-3"}>
                <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => showModal("add")}>Add Customer</Button>
            </div>
            <Table columns={TABLE_HEADER}
                   dataSource={invoices?.map((invoice) => ({...invoice, key: invoice.id})) || []}
                   pagination={{
                       defaultPageSize: 10,
                       showSizeChanger: true,
                       pageSizeOptions: [10, 20, 50, 100],
                   }}
                   loading={loading}
            />
            <Modal
                title={formMode === "add" ? "Add Invoice" : "Edit Invoice"}
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okButtonProps={{loading: formLoading}}
                okText={"Preview"}
                centered
            >
                <Form form={form} name="InvoiceForm" onFinish={handlePreview} className={"max-h-[500px] overflow-y-auto"}>
                    {renderFormItem("Merchant", "merId", merchantOptions!, "Merchant",true)}
                    {renderFormItem("Customer", "cusId", customerOptions!, "Customer",true)}
                    {renderFormItem("Discount", "disId", discountOptions!, "Discount")}
                    {renderFormItem("Tax", "taxId", taxOptions!, "Tax")}
                    <div className="mb-2 ">Products:</div>
                    <Form.List name="invoiceItemModelList" initialValue={[{}]}>
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name}) => (
                                    <Space key={key} className={"flex mb-4"} align="baseline">
                                        <Row>
                                            <Row className={"w-full space-x-2 mb-2"}>
                                                <Form.Item
                                                    name={[name, 'proId'] as NamePath}
                                                    rules={[{required: true, message: 'Please select a product'}]}
                                                    className={"w-40 mb-0"}
                                                >
                                                    <Select placeholder="Product" options={productOptions} allowClear/>
                                                </Form.Item>
                                                <Form.Item
                                                    name={[name, 'quantity'] as NamePath}
                                                    rules={[{required: true, message: 'Enter quantity'}]}
                                                    className={"w-24 mb-0"}
                                                >
                                                    <Input type="number" placeholder="Quantity" min={1}/>
                                                </Form.Item>
                                            </Row>

                                            <Form.Item name={[name, 'description'] as NamePath}
                                                       className={"w-full mb-0"}>
                                                <Input.TextArea placeholder="Description" rows={2}/>
                                            </Form.Item>
                                        </Row>
                                        <Button icon={<DeleteOutlined/>} onClick={() => remove(name)} disabled={fields.length===1}/>
                                    </Space>
                                ))}
                                <Button type="primary" onClick={() => add()} block icon={<PlusOutlined/>}>
                                    Add Product
                                </Button>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>

            <Modal
                title="Invoice Preview"
                open={isPreviewModelVisible}
                onCancel={() => setIsPreviewModelVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsPreviewModelVisible(false)}>
                        Close
                    </Button>,
                    <Button key="close" onClick={() => handleSubmit(form.getFieldsValue())} type="primary">
                        {formMode === "add" ? "Add Invoice" : "Save Invoice"}
                    </Button>,
                ]}
                width={800}
                centered
            >
                {pdfBase64 && (
                    <iframe
                        src={`data:application/pdf;base64,${pdfBase64}#toolbar=0&view=FitH`}
                        title="Invoice Preview"
                        width="100%"
                        height="500px"
                    />
                )}
            </Modal>
        </PageLayout>
    )
}

export default Invoice;