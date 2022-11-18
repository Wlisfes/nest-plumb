import { v4 } from 'uuid'

export const better = [
    {
        id: '72f29b4f-e7c5-4107-8447-d3a7f778e16c',
        max: -1,
        name: '电子邮件',
        icon: 'https://oss.lisfes.cn/cloud/avatar/2022-11/1668564053455.png',
        type: 'MESSAGE',
        style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
        rules: [{ id: 'be1aa742-84c2-441f-88c6-0fa93f9bd474', max: 1, visible: 0, content: '' }],
        connect: ['BINDTASK', 'MESSAGE', 'CPU', 'PRESENT']
    },
    {
        id: '8a1dab33-e4ab-4830-a6ac-10aa2d86e7d2',
        max: -1,
        name: '触发器',
        icon: 'https://oss.lisfes.cn/cloud/avatar/2022-11/1668564061586.png',
        type: 'CPU',
        style: { backgroundColor: '#ffe1e1', color: '#F78C88' },
        rules: [
            { id: '8650db59-8fff-4246-ba0a-e1b0b198d4c3', max: 1, visible: 1, content: 'NO' },
            { id: '790f973f-e407-4d49-ba95-784a052bfc65', max: 1, visible: 1, content: 'YES' }
        ],
        connect: ['MESSAGE', 'PRESENT']
    },
    {
        id: 'f4074fc3-b4ef-4b14-8cf9-32b00b32037e',
        max: -1,
        name: '目标',
        icon: 'https://oss.lisfes.cn/cloud/avatar/2022-11/1668564070318.png',
        type: 'PRESENT',
        style: { backgroundColor: '#e6e0ff', color: '#8E72F7' },
        rules: [],
        connect: ['MESSAGE', 'CPU', 'PRESENT']
    }
]
