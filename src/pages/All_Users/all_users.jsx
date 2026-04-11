import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, message, Avatar, Modal, Input } from 'antd';
import {
    UserOutlined,
    EditOutlined,
    LockOutlined,
    UnlockOutlined,
    DeleteOutlined,
    SearchOutlined,
    PlusOutlined
} from '@ant-design/icons';
// deleteUserAPI को import करें
import { getAllUsersAPI, updateUserStatusAPI, searchUsersByNameAPI } from '../../auth/adminLogin';
import { deleteUserAPI } from '../../auth/apiAddUser';
import defaultUserImage from "../../assets/dummy.png";
import AddUserFormModal from './AddUserFormModal';
import EditUserFormModal from './EditUserFormModal';

const AllUsersContent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState({ id: null, action: null });
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState(null); // null = All, 'SERVICE_PROVIDER' = Providers, 'GENERAL_USER' = Customers

    const handleSearch = async (value) => {
        setSearchText(value);

        if (value.trim() === '') {
            fetchData();
            return;
        }

        setLoading(true);
        try {
            const result = await searchUsersByNameAPI(value);
            if (result && result.status && Array.isArray(result.data)) {
                setData(result.data);
            } else {
                setData([]);
            }
        } catch (error) {
            message.error(error.message || "Search failed");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData(1); // Page 1 load karega
    }, []);

    // Purana fetchData replace karein isse:
    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            // API ko page number bhej rahe hain
            const result = await getAllUsersAPI(page);

            if (result && result.success && Array.isArray(result.data)) {
                setData(result.data);
                // Agar backend se total count aa raha hai (e.g. result.total), 
                // to yahan set karein (Optional but recommended)
            } else if (Array.isArray(result)) {
                setData(result);
            } else {
                setData([]);
            }

            // Pagination state ko update karein taaki UI pe sahi page dikhe
            setPagination(prev => ({ ...prev, current: page }));

        } catch (error) {
            message.error(error.message || "Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (id, newStatus) => {
        const actionType = newStatus === 'Blocked' ? 'block' : 'unblock';
        setActionLoading({ id: id, action: actionType });
        try {
            const response = await updateUserStatusAPI(id, newStatus);
            if (response.success) {
                message.success(`User ${actionType === 'block' ? 'Blocked' : 'Unblocked'} Successfully!`);
                setData((prevData) =>
                    prevData.map((user) =>
                        user._id === id ? { ...user, status: newStatus } : user
                    )
                );
            } else {
                message.error(response.message || `Failed to ${actionType}`);
            }
        } catch (error) {
            message.error(error.message || "Operation Failed");
        } finally {
            setActionLoading({ id: null, action: null });
        }
    };

    // --- नया Delete Handler ---
    const handleDeleteUser = async (userId) => {
        try {
            const response = await deleteUserAPI(userId);
            if (response && response.success) {
                message.success('User deleted successfully!');

                fetchData();
            } else {
                message.error(response.message || 'Failed to delete user.');
            }
        } catch (error) {
            message.error(error.message || 'An error occurred while deleting the user.');
        }
    };

    const handleEdit = (record) => {
        setSelectedUser(record);
        setIsEditModalVisible(true);
    };

    const handleAddNew = () => {
        setSelectedUser(null);
        setIsAddModalVisible(true);
    };

    const columns = [
        {
            title: 'S.NO',
            key: 'serial',
            width: 70,
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'USER NAME',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <Avatar
                        size="large"
                        src={record.profilePhoto || defaultUserImage}
                        icon={<UserOutlined />}
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold">{record.fullName}</span>
                        <span className="text-xs text-gray-500">{record.email || record.mobile}</span>
                    </div>
                </Space>
            ),
        },
        {
            title: 'EMAIL/MOBILE',
            key: 'contact',
            render: (_, record) => record.email || record.mobile,
        },
        {
            title: 'USER TYPE',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Blocked' ? "red" : "green"}>
                    {(status || 'UNKNOWN').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'ACTIONS',
            key: 'action',
            width: 150,
            render: (_, record) => {
                const isBlocked = record.status === 'Blocked';
                const isLoading = actionLoading.id === record._id;
                const nextStatus = isBlocked ? 'Active' : 'Blocked';
                const IconComponent = isBlocked ? UnlockOutlined : LockOutlined;
                const actionTypeText = isBlocked ? 'Unblock' : 'Block';

                return (
                    <Space size="middle">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                        <Button
                            type="text"
                            size="small"
                            icon={<IconComponent />}
                            style={isBlocked ? { color: '#28a745' } : { color: '#ffc107' }}
                            loading={isLoading && actionLoading.action === actionTypeText.toLowerCase()}
                            disabled={isLoading}
                            onClick={() => {
                                Modal.confirm({
                                    title: `${actionTypeText} User`,
                                    content: `Are you sure you want to ${actionTypeText} ${record.fullName}?`,
                                    okText: actionTypeText,
                                    cancelText: "Cancel",
                                    centered: true,
                                    onOk: () => handleStatusToggle(record._id, nextStatus),
                                });
                            }}
                        />
                        {/* --- अपडेट किया गया Delete Button --- */}
                        <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => {
                                Modal.confirm({
                                    title: 'Delete User',
                                    content: `Are you sure you want to delete ${record.fullName}? This action cannot be undone.`,
                                    okText: 'Delete',
                                    okType: 'danger',
                                    cancelText: 'Cancel',
                                    onOk: () => handleDeleteUser(record._id), // यहाँ नया handler कॉल करें
                                });
                            }}
                        />
                    </Space>
                );
            },
        },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto mb-8 mt-1.5">
            <h1 className="text-2xl font-bold mb-1">All Users</h1>
            <p className="text-gray-500 mb-4">Manage all registered users on the platform.</p>

            <Space style={{ marginBottom: 20 }}>
                <Button
                    type={roleFilter === null ? "primary" : "default"}
                    onClick={() => setRoleFilter(null)}
                    style={{ borderRadius: 20, background: roleFilter === null ? '#4a69bd' : '' }}
                >
                    All Users
                </Button>                <Button
                    type={roleFilter === 'SERVICE_PROVIDER' ? "primary" : "default"}
                    onClick={() => setRoleFilter('SERVICE_PROVIDER')}
                    style={{ borderRadius: 20, background: roleFilter === 'SERVICE_PROVIDER' ? '#4a69bd' : '' }}
                >
                    Service Providers
                </Button>
                <Button
                    type={roleFilter === 'GENERAL_USER' ? "primary" : "default"}
                    onClick={() => setRoleFilter('GENERAL_USER')}
                    style={{ borderRadius: 20, background: roleFilter === 'GENERAL_USER' ? '#4a69bd' : '' }}
                >
                    Customers
                </Button>            </Space>

            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <Space>
                    <Input
                        placeholder="Search Users by name..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 250, borderRadius: 6 }}
                        allowClear
                    />
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddNew}
                >
                    Add User
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={roleFilter ? data.filter(user => user.role === roleFilter) : data}
                loading={loading}
                rowKey="_id"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    onChange: (page) => {
                        fetchData(page); // Naya page fetch karega
                    }
                }}
            />
            <AddUserFormModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onSuccess={fetchData}
            />

            <EditUserFormModal
                visible={isEditModalVisible}
                onClose={() => {
                    setIsEditModalVisible(false);
                    setSelectedUser(null);
                }}
                onSuccess={fetchData}
                user={selectedUser}
            />
        </div>
    );
};

export default AllUsersContent;