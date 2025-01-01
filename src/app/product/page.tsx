"use client"

import React, {useEffect, useState} from "react";
import {Button, Form, Input, Modal, Row, Table} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {CustomerModel} from "@/models/customer.model";
import {NamePath} from "rc-field-form/es/interface";
import PageLayout from "@/app/page";
import {ProductModel} from "@/models/product.model";
import ProductService from "@/services/product.service";

const columns = [
    {key: "productName", title: "Product Name", dataIndex: "productName", width: "50%"},
    {key: "unitPrice", title: "Unit Price", dataIndex: "unitPrice", width: "41%"},
    {key: "action", title: "Action(s)", dataIndex: "action", width: "9%"},
]

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formMode, setFormMode] = useState<"add" | "edit">("add");
    const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
    const [form] = Form.useForm();
    const [formLoading, setFormLoading] = useState<boolean>(false);

    const getAllProduct = async () => {
        try {
            setLoading(true);
            const response = await ProductService.getAllProducts();
            setProducts(response);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllProduct().then()
    }, []);

    const showModal = (mode: "add" | "edit", product?: ProductModel) => {
        setFormMode(mode);
        if (mode === "edit" && product) {
            setSelectedProduct(product);
            form.setFieldsValue(product);
        } else {
            setSelectedProduct(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = async (values: ProductModel) => {
        try {
            setFormLoading(true);
            if (formMode === "add") {
                await ProductService.addProduct(values);
            } else if (formMode === "edit" && selectedProduct) {
                await ProductService.updateProduct( selectedProduct.id!, { ...selectedProduct, ...values })
            }
            setIsModalVisible(false);
            await getAllProduct().then();
        } catch (error) {
            console.error("Error submitting form: ", error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try{
            setLoading(true);
            await ProductService.deleteProduct(id);
            await getAllProduct().then();
        } catch (error) {
            console.error(error);
        }
    }

    const TABLE_HEADER = columns.map((column) => {
        switch (column.key) {
            case 'unitPrice':
                return {
                    ...column,
                    render: (text, record) => Number(record.unitPrice).toFixed(2)
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
        name: keyof ProductModel,
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
            <Input name={name} />
        </Form.Item>
    );

    return (
        <PageLayout>
            <div className={"text-3xl font-bold pt-6"}>Product</div>
            <div className={"justify-end w-full flex my-3"}>
                <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => showModal("add")}>Add Product</Button>
            </div>
            <Table columns={TABLE_HEADER}
                   dataSource={products?.map((product) => ({...product, key: product.id})) || []}
                   pagination={{
                       defaultPageSize: 10,
                       showSizeChanger: true,
                       pageSizeOptions: [10, 20, 50, 100],
                   }}
                   loading={loading}
            />
            <Modal
                title={formMode === "add" ? "Add Product" : "Edit Product"}
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okButtonProps={{loading: formLoading}}
                okText={formMode === "add" ? "Submit" : "Save"}
            >
                <Form form={form} name="ProductForm" onFinish={handleSubmit}>
                    {renderFormItem("Product Name", "productName", true)}
                    {renderFormItem("Unit Price", "unitPrice", true)}
                </Form>
            </Modal>
        </PageLayout>
    )
}

export default Product;