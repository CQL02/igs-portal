"use client"

import React, {useEffect, useState} from "react";
import {Button, Form, Input, Modal, Row, Table} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {NamePath} from "rc-field-form/es/interface";
import PageLayout from "@/app/page";
import CustomerService from "@/services/customer.service";
import {CustomerModel} from "@/models/customer.model";

const columns = [
    {key: "companyName", title: "Company Name", dataIndex: "companyName", width: "20%"},
    {key: "pic", title: "Person In Charge", dataIndex: "pic", width: "11%"},
    {key: "addrLine1", title: "Address", dataIndex: "addrLine1", width: "30%"},
    {key: "tel", title: "Tel. No.", dataIndex: "tel", width: "10%"},
    {key: "fax", title: "Fax No.", dataIndex: "fax", width: "10%"},
    {key: "email", title: "Email", dataIndex: "email", width: "10%"},
    {key: "action", title: "Action(s)", dataIndex: "action", width: "9%"},
]

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formMode, setFormMode] = useState<"add" | "edit">("add");
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerModel | null>(null);
    const [form] = Form.useForm();
    const [formLoading, setFormLoading] = useState<boolean>(false);

    const getAllCustomer = async () => {
        try {
            setLoading(true);
            const response = await CustomerService.getAllCustomers();
            setCustomers(response);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllCustomer().then()
    }, []);

    const showModal = (mode: "add" | "edit", customer?: CustomerModel) => {
        setFormMode(mode);
        if (mode === "edit" && customer) {
            setSelectedCustomer(customer);
            form.setFieldsValue(customer);
        } else {
            setSelectedCustomer(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = async (values: CustomerModel) => {
        try {
            setFormLoading(true);
            if (formMode === "add") {
                await CustomerService.addCustomer(values)
            } else if (formMode === "edit" && selectedCustomer) {
                await CustomerService.updateCustomer( selectedCustomer.id!, { ...selectedCustomer, ...values })
            }
            setIsModalVisible(false);
            await getAllCustomer().then();
        } catch (error) {
            console.error("Error submitting form: ", error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try{
            setLoading(true);
            await CustomerService.deleteCustomer(id);
            await getAllCustomer().then();
        } catch (error) {
            console.error(error);
        }
    }

    const TABLE_HEADER = columns.map((column) => {
        switch (column.key) {
            case 'addrLine1':
                return {
                    ...column,
                    render: (text, record) => {
                        const {addrLine1, addrLine2, postcode, city, state, country} = record;
                        const addressParts = [addrLine1, addrLine2, postcode, city, state, country].filter(Boolean);
                        return addressParts.join(", ");
                    }
                };
            case 'action':
                return {
                    ...column,
                    render: (text: any, record: any) => (
                        <Row justify={"space-around"}>
                            <Button icon={<EditOutlined />} onClick={() => showModal("edit", record)}/>
                            <Button icon={<DeleteOutlined/>} onClick={() => handleDelete(record.id)}/>
                        </Row>
                    ),
                };
            default:
                return column;
        }
    });

    const renderFormItem = (
        label: string,
        name: keyof CustomerModel,
        required: boolean = false,
    ) => (
        <Form.Item<CustomerModel>
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
            <div className={"text-3xl font-bold pt-6"}>Customer</div>
            <div className={"justify-end w-full flex my-3"}>
                <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => showModal("add")}>Add Customer</Button>
            </div>
            <Table columns={TABLE_HEADER}
                   dataSource={customers?.map((customer) => ({...customer, key: customer.id})) || []}
                   pagination={{
                       defaultPageSize: 10,
                       showSizeChanger: true,
                       pageSizeOptions: [10, 20, 50, 100],
                   }}
                   loading={loading}
            />
            <Modal
                title={formMode === "add" ? "Add Customer" : "Edit Customer"}
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okButtonProps={{loading: formLoading}}
                okText={formMode === "add" ? "Submit" : "Save"}
            >
                <Form form={form} name="CustomerForm" onFinish={handleSubmit}>
                    {renderFormItem("Company Name", "companyName", true)}
                    {renderFormItem("Person In Charge", "pic", true)}
                    {renderFormItem("Address Line 1", "addrLine1", true)}
                    {renderFormItem("Address Line 2", "addrLine2")}
                    {renderFormItem("Postcode", "postcode", true)}
                    {renderFormItem("City", "city", true)}
                    {renderFormItem("State", "state", true)}
                    {renderFormItem("Country", "country", true)}
                    {renderFormItem("Tel. No.", "tel")}
                    {renderFormItem("Fax No.", "fax")}
                    {renderFormItem("Email", "email")}
                </Form>
            </Modal>
        </PageLayout>
    )
}

export default Customer;