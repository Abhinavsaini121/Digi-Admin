

import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, message, Avatar, Modal } from 'antd';
import { UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

// Import the new controller functions
import { getPendingBusinesses, verifyBusiness } from '../../auth/adminLogin'; 

const PendingBusinessTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Changed to object to track which specific button (approve/reject) is loading for which row
    // Format: { id: "business_id", action: "approve" | "reject" }
    const [actionLoading, setActionLoading] = useState({ id: null, action: null }); 

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getPendingBusinesses();
            
            if (result.success && Array.isArray(result.businesses)) {
                setData(result.businesses);
            } else {
                setData([]);
                // Optional: message.warning("No pending businesses found");
            }
        } catch (error) {
            // Error is already logged in controller
            message.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLE APPROVE / REJECT ---
    const handleDecision = async (id, actionType) => {
        // Set loading for specific ID and Action Type
        setActionLoading({ id: id, action: actionType }); 

        try {
            // Call API with ID and Action ('approve' or 'reject')
            // This sends payload: { "action": "approve" } or { "action": "reject" }
            const response = await verifyBusiness(id, actionType);
            
            if (response.success) {
                message.success(`Business ${actionType === 'approve' ? 'Approved' : 'Rejected'} Successfully!`);
                // Remove the item from the list instantly (Optimistic UI)
                setData((prevData) => prevData.filter((item) => item._id !== id));
            } else {
                message.error(response.message || `Failed to ${actionType}`);
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Operation Failed");
        } finally {
            // Stop loading
            setActionLoading({ id: null, action: null }); 
        }
    };

    const columns = [
        {
            title: 'Owner',
            key: 'owner',
            render: (_, record) => (
                <Space>
                    <Avatar src={record.ownerImage} icon={<UserOutlined />} />
                    <div className="flex flex-col">
                        <span className="font-semibold">{record.ownerName}</span>
                        <span className="text-xs text-gray-500">{record.mobileNumber}</span>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Business Name',
            dataIndex: 'businessName',
            key: 'businessName',
            render: (text) => <span className="font-bold text-blue-600">{text}</span>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color="gold">{status ? status.toUpperCase() : 'PENDING'}</Tag>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="primary" 
                        size="small" 
                        icon={<CheckCircleOutlined />}
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                        // Check if this row is loading AND the action was 'approve'
                        loading={actionLoading.id === record._id && actionLoading.action === 'approve'} 
                        disabled={actionLoading.id === record._id} // Disable both buttons if processing
                        onClick={() => handleDecision(record._id, 'approve')}
                    >
                        Approve
                    </Button>
                    <Button 
                        danger 
                        size="small"
                        icon={<CloseCircleOutlined />}
                        // Check if this row is loading AND the action was 'reject'
                        loading={actionLoading.id === record._id && actionLoading.action === 'reject'}
                        disabled={actionLoading.id === record._id} // Disable both buttons if processing
                        onClick={() => {
                            Modal.confirm({
                                title: 'Reject Business',
                                content: 'Are you sure you want to reject this business?',
                                onOk: () => handleDecision(record._id, 'reject')
                            });
                        }}
                    >
                        Reject
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Pending Verifications</h2>
            <Table 
                columns={columns} 
                dataSource={data} 
                loading={loading} 
                rowKey="_id" 
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default PendingBusinessTable;


