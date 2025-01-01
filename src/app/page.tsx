import {Layout, Menu} from 'antd';
import {Header} from "antd/es/layout/layout";
import Link from "next/link";
import {usePathname} from "next/navigation";

const PageLayout = ({children}) => {
    const pathname = usePathname();

    const items = [
        { key: "/merchant", label: (<Link href={"/merchant"}>Merchant</Link>) },
        { key: "/customer", label: (<Link href={"/customer"}>Customer</Link>) },
        { key: "/product", label: (<Link href={"/product"}>Product</Link>) },
        { key: "/compliance", label: (<Link href={"/compliance"}>Compliance</Link>) },
        { key: "/invoice", label: (<Link href={"/invoice"}>Invoice</Link>) },
    ];

    return (
        <Layout>
            <Header className={"flex items-center bg-white justify-between border-b-2"}>
                <div className={"text-xl font-bold"}>Invoice Generator</div>
                <Menu
                    className="justify-end"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items}
                    style={{flex: 1, minWidth: 0}}
                    selectedKeys={[pathname]}
                />
            </Header>
            <main className={"bg-white px-12"}>
                {children}
            </main>
        </Layout>
    )
};

export default PageLayout;