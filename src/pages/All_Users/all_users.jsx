

import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, message, Avatar, Modal } from 'antd';
import { 
    UserOutlined, 
    EditOutlined, 
    LockOutlined, 
    UnlockOutlined, 
    DeleteOutlined,
    SearchOutlined,
    PlusOutlined
} from '@ant-design/icons';

// *** IMPORT THE NEW CONTROLLER FUNCTIONS ***
import { 
    getAllUsersAPI, 
    updateUserStatusAPI 
} from '../../auth/adminLogin'; // Adjust path as necessary

// *** ADDED: Import the default image ***
// IMPORTANT: Adjust the path below if your assets folder is structured differently!
import defaultUserImage from "../../assets/manimage.png";

const AllUsersContent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading, ] = useState(false);
    // actionLoading is still useful for disabling the button during API call
    const [actionLoading, setActionLoading] = useState({ id: null, action: null }); 
const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getAllUsersAPI(); 
            
            if (result && result.success && Array.isArray(result.data)) {
                setData(result.data); // Correctly using result.data
            } 
            else if (Array.isArray(result)) { 
                setData(result);
            }
            else {
                // Show warning if structure is unexpected (This is what was showing before)
                setData([]);
                message.warning(result.message || "No users found or incorrect API response format.");
            }
        } catch (error) {
            message.error(error.message || "Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLE BLOCK / UNBLOCK (Consolidated) ---
    const handleStatusToggle = async (id, newStatus) => {
        const actionType = newStatus === 'Blocked' ? 'block' : 'unblock';
        setActionLoading({ id: id, action: actionType }); 

        try {
            // PATCH call to /api/admin/user-status/:id
            const response = await updateUserStatusAPI(id, newStatus); 
            
            if (response.success) {
                message.success(`User ${actionType === 'block' ? 'Blocked' : 'Unblocked'} Successfully!`);
                
                // Optimistic UI Update
                setData((prevData) => 
                    prevData.map((user) => 
                        user._id === id 
                            ? { ...user, status: newStatus } 
                            : user
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

    const columns = [
        {
         title: 'S.NO',
    key: 'serial',
    width: 70,
    render: (_, __, index) => {
        // Page 1: (1-1)*10 + 0 + 1 = 1
        // Page 2: (2-1)*10 + 0 + 1 = 11
        return (pagination.current - 1) * pagination.pageSize + index + 1;
        },
        },
        {
            title: 'USER NAME',
            key: 'name',
            render: (_, record) => (
                <Space>
                    {/* *** MODIFIED SECTION FOR PROFILE IMAGE *** */}
                    <Avatar 
                        size="large" // Made Avatar slightly larger for better profile look
                        src={defaultUserImage} // Use the imported image here
                        icon={!defaultUserImage && <UserOutlined />} // Fallback to icon if image import fails
                    />
                    {/* *** END MODIFIED SECTION *** */}
                    <div className="flex flex-col"> 
                        {/* API uses fullName, not name */}
                        <span className="font-semibold">{record.fullName}</span> 
                        <span className="text-xs text-gray-500">{record.email || record.mobile}</span> {/* API uses mobile for contact */}
                    </div>
                </Space>
            ),
        },
        {
            title: 'EMAIL',
            dataIndex: 'email', // This field might be null/missing based on your sample data
            key: 'email_mobile',
            render: (email, record) => email || record.mobile, // Show email or mobile if email is missing
        },
        {
            title: 'USER TYPE',
            dataIndex: 'role', // API uses 'role' instead of 'type'
            key: 'role',
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const isBlocked = status === 'Blocked';
                return (
                    <Tag color={isBlocked ? "red" : "green"}>
                        {status ? status.toUpperCase() : 'UNKNOWN'}
                    </Tag>
                );
            },
        },
        {
            title: 'ACTIONS',
            key: 'action',
            width: 150,
            render: (_, record) => {
                const isBlocked = record.status === 'Blocked';
                const isLoading = actionLoading.id === record._id;
                
                // Determine next status and icon based on current status
                const nextStatus = isBlocked ? 'Active' : 'Blocked';
                const IconComponent = isBlocked ? UnlockOutlined : LockOutlined;
                const iconColor = isBlocked ? { color: '#28a745' } : { color: '#ffc107' };
                const actionTypeText = isBlocked ? 'Unblock' : 'Block';

                return (
                    <Space size="middle">
                        <Button 
                            type="text" 
                            size="small" 
                            icon={<EditOutlined />}
                            onClick={() => message.info(`Editing User ${record._id}`)}
                        />
                        
                        {/* Confirmation Modal Logic (Kept from previous step) */}
                        <Button 
                            type="text"
                            size="small"
                            icon={<IconComponent />}
                            style={iconColor}
                            loading={isLoading && actionLoading.action === actionTypeText.toLowerCase()} 
                            disabled={isLoading}
                            onClick={() => {
                                Modal.confirm({
                                    title: `${actionTypeText} User Confirmation`,
                                    content: (
                                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                            <div style={{ fontSize: '48px', lineHeight: '48px', margin: '0 0 20px 0' }}>
                                                {isBlocked ? (
                                                    <LockOutlined style={{ color: '#dc3545' }} />
                                                ) : (
                                                    <UnlockOutlined style={{ color: '#28a745' }} />
                                                )}
                                            </div>
                                            <p style={{ fontSize: '16px', margin: 0 }}>
                                                Are you sure you want to **{actionTypeText.toUpperCase()}** user **{record.fullName}**?
                                            </p>
                                        </div>
                                    ),
                                    okText: actionTypeText, 
                                    cancelText: "Cancel",
                                    onOk: () => handleStatusToggle(record._id, nextStatus),
                                    style: { borderRadius: '8px', textAlign: 'center' }, 
                                    centered: true,
                                });
                            }} 
                        >
                        </Button>

                        <Button 
                            type="text" 
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                Modal.confirm({
                                    title: 'Delete User',
                                    content: `Are you sure you want to permanently delete user ${record.fullName}?`,
                                    onOk: () => message.info(`Delete functionality for ${record._id} not yet implemented.`)
                                });
                            }}
                        />
                    </Space>
                );
            },
        },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto mb-8 mt-1.5 "> 
            <h1 className="text-2xl font-bold mb-1">All Users</h1>
            <p className="text-gray-500 mb-4">Manage all registered users on the platform.</p>
            
            {/* Tab Controls */}
            <Space style={{ marginBottom: 20 }}>
                <Button type="primary" size="middle" style={{ borderRadius: 20, border: '1px solid #4a69bd', background: '#4a69bd' }}>All Users</Button>
                <Button size="middle" style={{ borderRadius: 20 }}>Service Providers</Button>
                <Button size="middle" style={{ borderRadius: 20 }}>Customers</Button>
            </Space>

            {/* Action Bar: Search and Add User */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <Space>
                    <Button icon={<SearchOutlined />} style={{ border: '1px solid #ccc' }}>
                        Search Users...
                    </Button>
                </Space>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add User
                </Button>
            </div>

            {/* The Main Table */}
           <Table 
    columns={columns} 
    dataSource={data} 
    loading={loading} 
    rowKey="_id" 
    pagination={{ 
        current: pagination.current, 
        pageSize: pagination.pageSize,
        onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize: pageSize });
        }
    }}
/>
        </div>
    );
};

export default AllUsersContent;