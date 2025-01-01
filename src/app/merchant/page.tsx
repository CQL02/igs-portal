"use client"

import React, {useEffect, useState} from "react";
import PageLayout from "@/app/page";
import {Button, Form, Input, Modal, Row, Table} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import MerchantService from "@/services/merchant.service";
import {MerchantModel} from "@/models/merchant.model";
import {NamePath} from "rc-field-form/es/interface";


const columns = [
    {key: "companyName", title: "Company Name", dataIndex: "companyName", width: "15%"},
    {key: "registrationNo", title: "Registration No.", dataIndex: "registrationNo", width: "10%"},
    {key: "addrLine1", title: "Address", dataIndex: "addrLine1", width: "20%"},
    {key: "tel", title: "Tel. No.", dataIndex: "tel", width: "8%"},
    {key: "fax", title: "Fax No.", dataIndex: "fax", width: "8%"},
    {key: "email", title: "Email", dataIndex: "email", width: "10%"},
    {key: "bankName", title: "Bank Name", dataIndex: "bankName", width: "10%"},
    {key: "bankAccNo", title: "Bank Acc No.", dataIndex: "bankAccNo", width: "10%"},
    {key: "action", title: "Action(s)", dataIndex: "action", width: "9%"},
]

const Merchant = () => {
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formMode, setFormMode] = useState<"add" | "edit">("add");
    const [selectedMerchant, setSelectedMerchant] = useState<MerchantModel | null>(null);
    const [form] = Form.useForm();
    const [formLoading, setFormLoading] = useState<boolean>(false);

    const getAllMerchant = async () => {
        try {
            setLoading(true);
            const response = await MerchantService.getAllMerchants();
            setMerchants(response);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllMerchant().then()
    }, []);

    const showModal = (mode: "add" | "edit", merchant?: MerchantModel) => {
        setFormMode(mode);
        if (mode === "edit" && merchant) {
            setSelectedMerchant(merchant);
            form.setFieldsValue(merchant);
        } else {
            setSelectedMerchant(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = async (values: MerchantModel) => {
        try {
            setFormLoading(true);
            if (formMode === "add") {
                await MerchantService.addMerchant(values)
            } else if (formMode === "edit" && selectedMerchant) {
                await MerchantService.updateMerchant( selectedMerchant.id!, { ...selectedMerchant, ...values })
            }
            setIsModalVisible(false);
            await getAllMerchant().then();
        } catch (error) {
            console.error("Error submitting form: ", error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try{
            setLoading(true);
            await MerchantService.deleteMerchant(id);
            await getAllMerchant().then();
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
        name: keyof MerchantModel,
        required: boolean = false,
    ) => (
        <Form.Item<MerchantModel>
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
            <div className={"text-3xl font-bold pt-6"}>Merchant</div>
            <div className={"justify-end w-full flex my-3"}>
                <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => showModal("add")}>Add Merchant</Button>
            </div>
            <Table columns={TABLE_HEADER}
                   dataSource={merchants?.map((merchant) => ({...merchant, key: merchant.id})) || []}
                   pagination={{
                       defaultPageSize: 10,
                       showSizeChanger: true,
                       pageSizeOptions: [10, 20, 50, 100],
                   }}
                   loading={loading}
            />
            <Modal
                title={formMode === "add" ? "Add Merchant" : "Edit Merchant"}
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okButtonProps={{loading: formLoading}}
                okText={formMode === "add" ? "Submit" : "Save"}
            >
                <Form form={form} name="MerchantForm" onFinish={handleSubmit}>
                    {renderFormItem("Company Name", "companyName", true)}
                    {renderFormItem("Registration No.", "registrationNo", true)}
                    {renderFormItem("Address Line 1", "addrLine1", true)}
                    {renderFormItem("Address Line 2", "addrLine2")}
                    {renderFormItem("Postcode", "postcode", true)}
                    {renderFormItem("City", "city", true)}
                    {renderFormItem("State", "state", true)}
                    {renderFormItem("Country", "country", true)}
                    {renderFormItem("Tel. No.", "tel")}
                    {renderFormItem("Fax No.", "fax")}
                    {renderFormItem("Email", "email")}
                    {renderFormItem("Bank Name", "bankName")}
                    {renderFormItem("Bank Account No.", "bankAccNo")}
                </Form>
            </Modal>
        </PageLayout>
    )
}

export default Merchant