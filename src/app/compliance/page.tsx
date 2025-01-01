"use client"

import React, {useEffect, useState} from "react";
import {Button, Form, Input, Modal, Row, Table} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {NamePath} from "rc-field-form/es/interface";
import PageLayout from "@/app/page";
import {TaxModel} from "@/models/tax.model";
import ComplianceService from "@/services/compliance.service";
import {DiscountModel} from "@/models/discount.model";

const taxColumns = [
    {key: "taxName", title: "Tax Name", dataIndex: "taxName", width: "50%"},
    {key: "rate", title: "Rate (%)", dataIndex: "pic", width: "41%"},
    {key: "action", title: "Action(s)", dataIndex: "action", width: "9%"},
]

const discountColumns = [
    {key: "discountName", title: "Discount Name", dataIndex: "discountName", width: "50%"},
    {key: "rate", title: "Rate (%)", dataIndex: "pic", width: "41%"},
    {key: "action", title: "Action(s)", dataIndex: "action", width: "9%"},
]

const Compliance = () => {
    const [taxes, setTaxes] = useState([]);
    const [taxLoading, setTaxLoading] = useState(false);
    const [isTaxModalVisible, setIsTaxModalVisible] = useState(false);
    const [taxFormMode, setTaxFormMode] = useState<"add" | "edit">("add");
    const [selectedTax, setSelectedTax] = useState<TaxModel | null>(null);
    const [taxForm] = Form.useForm();
    const [taxFormLoading, setTaxFormLoading] = useState<boolean>(false);

    const [discounts, setDiscounts] = useState([]);
    const [discountLoading, setDiscountLoading] = useState(false);
    const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);
    const [discountFormMode, setDiscountFormMode] = useState<"add" | "edit">("add");
    const [selectedDiscount, setSelectedDiscount] = useState<DiscountModel | null>(null);
    const [discountForm] = Form.useForm();
    const [discountFormLoading, setDiscountFormLoading] = useState<boolean>(false);

    const getAllTax = async () => {
        try {
            setTaxLoading(true);
            const response = await ComplianceService.getAllTaxes();
            setTaxes(response);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setTaxLoading(false)
        }
    }

    const getAllDiscount = async () => {
        try {
            setDiscountLoading(true);
            const response = await ComplianceService.getAllDiscounts();
            setDiscounts(response);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setDiscountLoading(false)
        }
    }

    useEffect(() => {
        getAllTax().then()
        getAllDiscount().then()
    }, []);

    const showTaxModal = (mode: "add" | "edit", tax?: TaxModel) => {
        setTaxFormMode(mode);
        if (mode === "edit" && tax) {
            setSelectedTax(tax);
            taxForm.setFieldsValue(tax);
        } else {
            setSelectedTax(null);
            taxForm.resetFields();
        }
        setIsTaxModalVisible(true);
    };

    const showDiscountModal = (mode: "add" | "edit", discount?: DiscountModel) => {
        setDiscountFormMode(mode);
        if (mode === "edit" && discount) {
            setSelectedDiscount(discount);
            discountForm.setFieldsValue(discount);
        } else {
            setSelectedDiscount(null);
            discountForm.resetFields();
        }
        setIsDiscountModalVisible(true);
    };

    const handleTaxCancel = () => {
        setIsTaxModalVisible(false);
    };

    const handleDiscountCancel = () => {
        setIsDiscountModalVisible(false);
    };

    const handleTaxSubmit = async (values: TaxModel) => {
        try {
            setTaxFormLoading(true);
            if (taxFormMode === "add") {
                await ComplianceService.addTax(values)
            } else if (taxFormMode === "edit" && selectedTax) {
                await ComplianceService.updateTax( selectedTax.id!, { ...selectedTax, ...values })
            }
            setIsTaxModalVisible(false);
            await getAllTax().then();
        } catch (error) {
            console.error("Error submitting form: ", error);
        } finally {
            setTaxFormLoading(false);
        }
    };

    const handleDiscountSubmit = async (values: DiscountModel) => {
        try {
            setDiscountFormLoading(true);
            if (discountFormMode === "add") {
                await ComplianceService.addDiscount(values)
            } else if (discountFormMode === "edit" && selectedDiscount) {
                await ComplianceService.updateDiscount( selectedDiscount.id!, { ...selectedDiscount, ...values })
            }
            setIsDiscountModalVisible(false);
            await getAllDiscount().then();
        } catch (error) {
            console.error("Error submitting form: ", error);
        } finally {
            setDiscountFormLoading(false);
        }
    };

    const handleTaxDelete = async (id: number) => {
        try{
            setTaxLoading(true);
            await ComplianceService.deleteTax(id);
            await getAllTax().then();
        } catch (error) {
            console.error(error);
        }
    }

    const handleDiscountDelete = async (id: number) => {
        try{
            setDiscountLoading(true);
            await ComplianceService.deleteDiscount(id);
            await getAllDiscount().then();
        } catch (error) {
            console.error(error);
        }
    }

    const TAX_TABLE_HEADER = taxColumns.map((column) => {
        switch (column.key) {
            case 'rate':
                return {
                    ...column,
                    render: (text, record) => Number(record.rate).toFixed(2)
                };
            case 'action':
                return {
                    ...column,
                    render: (text: any, record: any) => (
                        <Row justify={"space-around"}>
                            <Button icon={<EditOutlined />} onClick={() => showTaxModal("edit", record)}/>
                            <Button icon={<DeleteOutlined/>} onClick={() => handleTaxDelete(record.id)}/>
                        </Row>
                    ),
                };
            default:
                return column;
        }
    });

    const DISCOUNT_TABLE_HEADER = discountColumns.map((column) => {
        switch (column.key) {
            case 'rate':
                return {
                    ...column,
                    render: (text, record) => Number(record.rate).toFixed(2)
                };
            case 'action':
                return {
                    ...column,
                    render: (text: any, record: any) => (
                        <Row justify={"space-around"}>
                            <Button icon={<EditOutlined />} onClick={() => showDiscountModal("edit", record)}/>
                            <Button icon={<DeleteOutlined/>} onClick={() => handleDiscountDelete(record.id)}/>
                        </Row>
                    ),
                };
            default:
                return column;
        }
    });

    const renderTaxFormItem = (
        label: string,
        name: keyof TaxModel,
        required: boolean = false,
    ) => (
        <Form.Item<TaxModel>
            label={label}
            name={name as NamePath}
            labelCol={{ span: 10 }}
            labelAlign={"left"}
            className={"mb-2"}
            rules={required ? [{ required: true, message: `Please enter the ${label.toLowerCase()}` }] : []}
        >
            <Input name={name}/>
        </Form.Item>
    );

    const renderDiscountFormItem = (
        label: string,
        name: keyof DiscountModel,
        required: boolean = false,
    ) => (
        <Form.Item<DiscountModel>
            label={label}
            name={name as NamePath}
            labelCol={{ span: 10 }}
            labelAlign={"left"}
            className={"mb-2"}
            rules={required ? [{ required: true, message: `Please enter the ${label.toLowerCase()}` }] : []}
        >
            <Input name={name}/>
        </Form.Item>
    );

    return (
        <PageLayout>
            <div className={"text-3xl font-bold pt-6"}>Tax</div>
            <div className={"justify-end w-full flex my-3"}>
                <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => showTaxModal("add")}>Add Tax</Button>
            </div>
            <Table columns={TAX_TABLE_HEADER}
                   dataSource={taxes?.map((tax) => ({...tax, key: tax.id})) || []}
                   pagination={{
                       defaultPageSize: 10,
                       showSizeChanger: true,
                       pageSizeOptions: [10, 20, 50, 100],
                   }}
                   loading={taxLoading}
            />
            <Modal
                title={taxFormMode === "add" ? "Add Tax" : "Edit Tax"}
                open={isTaxModalVisible}
                onCancel={handleTaxCancel}
                onOk={() => taxForm.submit()}
                okButtonProps={{loading: taxFormLoading}}
                okText={taxFormMode === "add" ? "Submit" : "Save"}
            >
                <Form form={taxForm} name="TaxForm" onFinish={handleTaxSubmit}>
                    {renderTaxFormItem("Tax Name", "taxName", true)}
                    {renderTaxFormItem("Rate (%)", "rate", true)}
                </Form>
            </Modal>

            <div className={"text-3xl font-bold pt-6"}>Discount</div>
            <div className={"justify-end w-full flex my-3"}>
                <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => showDiscountModal("add")}>Add Discount</Button>
            </div>
            <Table columns={DISCOUNT_TABLE_HEADER}
                   dataSource={discounts?.map((discount) => ({...discount, key: discount.id})) || []}
                   pagination={{
                       defaultPageSize: 10,
                       showSizeChanger: true,
                       pageSizeOptions: [10, 20, 50, 100],
                   }}
                   loading={discountLoading}
            />
            <Modal
                title={discountFormMode === "add" ? "Add Discount" : "Edit Discount"}
                open={isDiscountModalVisible}
                onCancel={handleDiscountCancel}
                onOk={() => discountForm.submit()}
                okButtonProps={{loading: discountFormLoading}}
                okText={discountFormMode === "add" ? "Submit" : "Save"}
            >
                <Form form={discountForm} name="TaxForm" onFinish={handleDiscountSubmit}>
                    {renderDiscountFormItem("Discount Name", "discountName", true)}
                    {renderDiscountFormItem("Rate (%)", "rate", true)}
                </Form>
            </Modal>
        </PageLayout>
    )
}

export default Compliance;