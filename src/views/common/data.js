import { v4 } from 'uuid'

export const better = [
    {
        id: '8e8a9c60-8d22-4538-aa55-e79c07facdf5',
        max: 0,
        name: '绑定发送任务',
        // icon: 'https://oss.lisfes.cn/cloud/avatar/2022-11/1668565939464.png',
        icon: 'https://oss.lisfes.cn/cloud/avatar/2021-09/1632984086053.png',
        type: 'BIND_TASK',
        style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
        rules: [{ id: 'e7375f64-c3a0-4222-9e1f-8369f637545d', max: 1, visible: 1, content: 'Yes' }],
        connect: []
    },
    {
        id: '1088a06a-8f4f-49d4-a415-bcb575330a29',
        max: 0,
        name: '自动营销',
        icon: 'https://oss.lisfes.cn/cloud/avatar/2021-09/1632981240071.png',
        type: 'AUTO_MATIC',
        style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
        rules: [{ id: 'caaf0878-7a97-4ebe-99b2-87ec243dd6c9', max: 1, visible: 0, content: '' }],
        connect: []
    },
    {
        id: '9a0f0226-76fd-4b6a-ad52-bc0e566f3cf4',
        max: 0,
        name: '创建触发器',
        icon: 'https://oss.lisfes.cn/cloud/avatar/2021-09/1632984770213.png',
        type: 'CREATE_TRIGGER',
        style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
        rules: [{ id: '32f7ade7-f490-40d4-baff-3b49a98591e8', max: 1, visible: 0, content: '' }],
        connect: []
    },
    {
        id: '72f29b4f-e7c5-4107-8447-d3a7f778e16c',
        max: -1,
        name: '电子邮件',
        icon: 'https://oss.lisfes.cn/cloud/avatar/2022-11/1668564053455.png',
        type: 'EMAIL',
        style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
        rules: [{ id: 'be1aa742-84c2-441f-88c6-0fa93f9bd474', max: 1, visible: 0, content: '' }],
        connect: ['BIND_TASK', 'EMAIL', 'TRIGGER']
    },
    {
        id: '8a1dab33-e4ab-4830-a6ac-10aa2d86e7d2',
        max: -1,
        name: '触发器',
        icon: 'https://oss.lisfes.cn/cloud/avatar/2022-11/1668564061586.png',
        type: 'TRIGGER',
        style: { backgroundColor: '#ffe1e1', color: '#F78C88' },
        rules: [
            { id: '8650db59-8fff-4246-ba0a-e1b0b198d4c3', max: 1, visible: 1, content: 'NO' },
            { id: '790f973f-e407-4d49-ba95-784a052bfc65', max: 1, visible: 1, content: 'YES' }
        ],
        connect: ['EMAIL', 'AUTO_MATIC']
    },
    {
        id: 'f4074fc3-b4ef-4b14-8cf9-32b00b32037e',
        max: -1,
        name: '目标',
        icon: 'https://oss.lisfes.cn/cloud/avatar/2022-11/1668564070318.png',
        type: 'TARGET',
        style: { backgroundColor: '#e6e0ff', color: '#8E72F7' },
        rules: [],
        connect: ['EMAIL', 'TRIGGER']
    }
]
