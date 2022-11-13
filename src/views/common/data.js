export const source = [
    {
        id: '72f29b4f-e7c5-4107-8447-d3a7f778e16c',
        max: -1,
        name: '电子邮件',
        icon: 'el-icon-message',
        type: 'MESSAGE',
        style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
        rules: [{ id: 'be1aa742-84c2-441f-88c6-0fa93f9bd474', max: 2, type: 'info', content: '' }],
        connect: ['MESSAGE', 'CPU', 'CLOCK', 'PRESENT']
    },
    {
        id: '8a1dab33-e4ab-4830-a6ac-10aa2d86e7d2',
        max: -1,
        name: '触发器',
        icon: 'el-icon-cpu',
        type: 'CPU',
        style: { backgroundColor: '#ffe1e1', color: '#F78C88' },
        rules: [
            { id: '8650db59-8fff-4246-ba0a-e1b0b198d4c3', max: 1, type: 'danger', content: 'NO' },
            { id: '790f973f-e407-4d49-ba95-784a052bfc65', max: 1, type: 'success', content: 'YES' }
        ],
        connect: ['MESSAGE', 'CLOCK', 'PRESENT']
    },
    {
        id: 'f7ff1dcb-cde7-4f83-b33d-b14f913160a4',
        max: -1,
        name: '延时',
        icon: 'el-icon-alarm-clock',
        type: 'CLOCK',
        style: { backgroundColor: '#fbf1bd', color: '#EDB342' },
        rules: [{ id: 'db2deb1a-5f3d-4458-9c34-4f55d9d53788', max: 1, type: 'info', content: '' }],
        connect: ['MESSAGE', 'CPU', 'CLOCK', 'PRESENT']
    },
    {
        id: 'f4074fc3-b4ef-4b14-8cf9-32b00b32037e',
        max: -1,
        name: '目标',
        icon: 'el-icon-present',
        type: 'PRESENT',
        style: { backgroundColor: '#e6e0ff', color: '#8E72F7' },
        rules: [],
        connect: ['MESSAGE', 'CPU', 'CLOCK', 'PRESENT']
    }
]

export const column = [
    {
        form: {
            id: '72f29b4f-e7c5-4107-8447-d3a7f778e16c',
            max: 0,
            name: '电子邮件',
            icon: 'el-icon-message',
            type: 'MESSAGE',
            style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
            rules: [{ id: 'be1aa742-84c2-441f-88c6-0fa93f9bd474', max: 2, type: 'info', content: '' }],
            connect: ['MESSAGE', 'CPU', 'CLOCK', 'PRESENT']
        },
        rules: [{ id: '824f65ff-ba00-425f-9942-e808466ed7a7', max: 2, type: 'info', content: '' }],
        id: 'c86f6f22-28e1-4c38-8db8-3d5fa99271e3',
        top: '45px',
        left: '645px'
    },
    {
        form: {
            id: '8a1dab33-e4ab-4830-a6ac-10aa2d86e7d2',
            max: -1,
            name: '触发器',
            icon: 'el-icon-cpu',
            type: 'CPU',
            style: { backgroundColor: '#ffe1e1', color: '#F78C88' },
            rules: [
                { id: '8650db59-8fff-4246-ba0a-e1b0b198d4c3', max: 1, type: 'danger', content: 'NO' },
                { id: '790f973f-e407-4d49-ba95-784a052bfc65', max: 1, type: 'success', content: 'YES' }
            ],
            connect: ['MESSAGE', 'CLOCK', 'PRESENT']
        },
        rules: [
            { id: '8344c059-3632-45f9-952f-4fa07671b9e2', max: 1, type: 'danger', content: 'NO' },
            { id: '4578bc01-25cb-4724-b92b-3455987db3ad', max: 1, type: 'success', content: 'YES' }
        ],
        id: '998529b4-e050-4702-abf6-726d12529def',
        top: '240px',
        left: '870px'
    },
    {
        form: {
            id: 'f7ff1dcb-cde7-4f83-b33d-b14f913160a4',
            max: -1,
            name: '延时',
            icon: 'el-icon-alarm-clock',
            type: 'CLOCK',
            style: { backgroundColor: '#fbf1bd', color: '#EDB342' },
            rules: [{ id: 'db2deb1a-5f3d-4458-9c34-4f55d9d53788', max: 1, type: 'info', content: '' }],
            connect: ['MESSAGE', 'CPU', 'CLOCK', 'PRESENT']
        },
        rules: [{ id: '3f8b2bca-a320-40e5-a73d-ac51d952db32', max: 1, type: 'info', content: '' }],
        id: 'da681bf8-b93d-4dcc-9e81-cbe13b34e1ea',
        top: '490px',
        left: '600px'
    },
    {
        form: {
            id: '72f29b4f-e7c5-4107-8447-d3a7f778e16c',
            max: -1,
            name: '电子邮件',
            icon: 'el-icon-message',
            type: 'MESSAGE',
            style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
            rules: [{ id: 'be1aa742-84c2-441f-88c6-0fa93f9bd474', max: 2, type: 'info', content: '' }],
            connect: ['MESSAGE', 'CPU', 'CLOCK', 'PRESENT']
        },
        rules: [{ id: 'be7fa609-74d1-4f75-ad8f-a4d34b64320e', max: 2, type: 'info', content: '' }],
        id: 'a57be178-99fb-4537-b519-bca5add27bbd',
        top: '490px',
        left: '1055px'
    },
    {
        form: {
            id: '8a1dab33-e4ab-4830-a6ac-10aa2d86e7d2',
            max: -1,
            name: '触发器',
            icon: 'el-icon-cpu',
            type: 'CPU',
            style: { backgroundColor: '#ffe1e1', color: '#F78C88' },
            rules: [
                { id: '8650db59-8fff-4246-ba0a-e1b0b198d4c3', max: 1, type: 'danger', content: 'NO' },
                { id: '790f973f-e407-4d49-ba95-784a052bfc65', max: 1, type: 'success', content: 'YES' }
            ],
            connect: ['MESSAGE', 'CLOCK', 'PRESENT']
        },
        rules: [
            { id: 'e97e7236-a38c-41dc-9187-1511d65a05ba', max: 1, type: 'danger', content: 'NO' },
            { id: 'ff61f6b9-4a80-415a-9d7a-d2020e8a991e', max: 1, type: 'success', content: 'YES' }
        ],
        id: 'aa812ab3-2066-4421-a0d7-f61da4f0c014',
        top: '695px',
        left: '925px'
    },
    {
        form: {
            id: '72f29b4f-e7c5-4107-8447-d3a7f778e16c',
            max: -1,
            name: '电子邮件',
            icon: 'el-icon-message',
            type: 'MESSAGE',
            style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
            rules: [{ id: 'be1aa742-84c2-441f-88c6-0fa93f9bd474', max: 2, type: 'info', content: '' }],
            connect: ['MESSAGE', 'CPU', 'CLOCK', 'PRESENT']
        },
        rules: [{ id: '91ea0846-bdb8-4b43-ad9a-5ef6bc36bbcc', max: 2, type: 'info', content: '' }],
        id: 'd47eca73-12eb-4627-b3d6-83437902c4bb',
        top: '730px',
        left: '435px'
    },
    {
        form: {
            id: 'f4074fc3-b4ef-4b14-8cf9-32b00b32037e',
            max: -1,
            name: '目标',
            icon: 'el-icon-present',
            type: 'PRESENT',
            style: { backgroundColor: '#e6e0ff', color: '#8E72F7' },
            connect: ['MESSAGE', 'CPU', 'CLOCK', 'PRESENT']
        },
        rules: [],
        id: '91907c25-d5a8-4a8d-bf48-9a5c18db1eff',
        top: '1020px',
        left: '215px'
    },
    {
        form: {
            id: '72f29b4f-e7c5-4107-8447-d3a7f778e16c',
            max: -1,
            name: '电子邮件',
            icon: 'el-icon-message',
            type: 'MESSAGE',
            style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
            rules: [],
            connect: ['MESSAGE', 'CPU', 'CLOCK', 'PRESENT']
        },
        rules: [],
        id: '9f676d77-d432-4d52-9c00-9baef041b38e',
        top: '980px',
        left: '1115px'
    },
    {
        form: {
            id: 'f4074fc3-b4ef-4b14-8cf9-32b00b32037e',
            max: -1,
            name: '目标',
            icon: 'el-icon-present',
            type: 'PRESENT',
            style: { backgroundColor: '#e6e0ff', color: '#8E72F7' },
            connect: ['MESSAGE', 'CPU', 'CLOCK', 'PRESENT']
        },
        rules: [],
        id: '7be2d223-3298-47b2-96b5-97c2bc409cf8',
        top: '955px',
        left: '660px'
    }
]

export const line = [
    {
        id: 'ddbd3bdb-12ee-44f3-bd92-ce791c7d2502',
        parent: 'c86f6f22-28e1-4c38-8db8-3d5fa99271e3',
        source: '824f65ff-ba00-425f-9942-e808466ed7a7',
        target: '998529b4-e050-4702-abf6-726d12529def',
        label: '猪头'
    },
    {
        id: '704ca660-c7f9-4107-9e34-723099be4b29',
        parent: '998529b4-e050-4702-abf6-726d12529def',
        source: '8344c059-3632-45f9-952f-4fa07671b9e2',
        target: 'da681bf8-b93d-4dcc-9e81-cbe13b34e1ea',
        label: '猪头'
    },
    {
        id: 'c631ea19-fe72-4950-ac98-1a5e6d23c9cd',
        parent: '998529b4-e050-4702-abf6-726d12529def',
        source: '4578bc01-25cb-4724-b92b-3455987db3ad',
        target: 'a57be178-99fb-4537-b519-bca5add27bbd',
        label: '猪头'
    },
    {
        id: '74debb05-e1eb-46f5-9a35-6ba4ed9f8660',
        parent: 'a57be178-99fb-4537-b519-bca5add27bbd',
        source: 'be7fa609-74d1-4f75-ad8f-a4d34b64320e',
        target: 'aa812ab3-2066-4421-a0d7-f61da4f0c014',
        label: '猪头'
    },
    {
        id: 'c5f0b150-4c24-472a-acc6-00415126eeb2',
        parent: 'da681bf8-b93d-4dcc-9e81-cbe13b34e1ea',
        source: '3f8b2bca-a320-40e5-a73d-ac51d952db32',
        target: 'd47eca73-12eb-4627-b3d6-83437902c4bb',
        label: '猪头'
    },
    {
        id: 'cb319d8f-c9ba-4dda-a65b-7d63c1745b7a',
        parent: 'd47eca73-12eb-4627-b3d6-83437902c4bb',
        source: '91ea0846-bdb8-4b43-ad9a-5ef6bc36bbcc',
        target: '91907c25-d5a8-4a8d-bf48-9a5c18db1eff',
        label: '猪头'
    },
    {
        id: '3212ae44-9dfb-43a3-8153-306ceec5b649',
        parent: 'aa812ab3-2066-4421-a0d7-f61da4f0c014',
        source: 'ff61f6b9-4a80-415a-9d7a-d2020e8a991e',
        target: '9f676d77-d432-4d52-9c00-9baef041b38e',
        label: '猪头'
    },
    {
        id: '86eca0be-a6fc-4268-992f-c85004a04bba',
        parent: 'aa812ab3-2066-4421-a0d7-f61da4f0c014',
        source: 'e97e7236-a38c-41dc-9187-1511d65a05ba',
        target: '7be2d223-3298-47b2-96b5-97c2bc409cf8',
        label: '猪头'
    }
]
