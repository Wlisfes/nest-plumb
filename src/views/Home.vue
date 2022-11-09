<script>
import { v4 } from 'uuid'
// import { NAside, NChart, NContainer } from '@/views/common'
import { Better, Container, observer } from '@/bower'

const STYLE = {
    MESSAGE: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
    CPU: { backgroundColor: '#ffe1e1', color: '#F78C88' },
    CLOCK: { backgroundColor: '#fbf1bd', color: '#EDB342' },
    PRESENT: { backgroundColor: '#e6e0ff', color: '#8E72F7' }
}

export default {
    name: 'Home',
    // components: { NAside, NChart, NContainer },
    data() {
        return {
            current: null,
            dataSource: [
                {
                    id: v4(),
                    name: '电子邮件',
                    icon: 'el-icon-message',
                    type: 'MESSAGE',
                    style: STYLE.MESSAGE,
                    rules: [{ id: v4(), type: 'info', content: '' }]
                },
                {
                    id: v4(),
                    name: '触发器',
                    icon: 'el-icon-cpu',
                    type: 'CPU',
                    style: STYLE.CPU,
                    rules: [
                        { id: v4(), type: 'danger', content: 'NO' },
                        { id: v4(), type: 'success', content: 'YES' }
                    ]
                },
                {
                    id: v4(),
                    name: '延时',
                    icon: 'el-icon-alarm-clock',
                    type: 'CLOCK',
                    style: STYLE.CLOCK,
                    rules: [{ id: v4(), type: 'info', content: '' }]
                },
                {
                    id: v4(),
                    name: '目标',
                    icon: 'el-icon-present',
                    type: 'PRESENT',
                    style: STYLE.PRESENT
                }
            ]
        }
    },
    mounted() {
        setTimeout(() => {
            const column = [
                {
                    props: {
                        id: '4d872f9c-7f65-43fc-85ae-0c01eb7323f9',
                        name: '电子邮件',
                        icon: 'el-icon-message',
                        type: 'MESSAGE',
                        style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
                        rules: [{ id: 'ef713561-4659-406d-b165-38eca2f1cd95', type: 'info', content: '' }]
                    },
                    rules: [{ id: 'd65fe315-f62c-4e85-a5f2-629fa0170cd9', type: 'info', content: '' }],
                    id: '024247fb-2403-465a-abc0-7648873442bb',
                    top: '100px',
                    left: '300px'
                },
                {
                    props: {
                        id: '77cd0f97-7cc3-4554-855c-78ca230e6187',
                        name: '触发器',
                        icon: 'el-icon-cpu',
                        type: 'CPU',
                        style: { backgroundColor: '#ffe1e1', color: '#F78C88' },
                        rules: [
                            { id: '2233e175-b36b-4c94-9897-8806793a34b3', type: 'danger', content: 'NO' },
                            { id: '3aa44c05-e324-4f21-9c81-9bb7aca1f6f3', type: 'success', content: 'YES' }
                        ]
                    },
                    rules: [
                        { id: '68d1ddf6-c7c8-4abb-ae47-060e7f770193', type: 'danger', content: 'NO' },
                        { id: '43f9ffb1-8a69-4d12-9d87-ad16eb5016f4', type: 'success', content: 'YES' }
                    ],
                    id: '4e5d9cb5-65a9-4163-a723-3ed137fd9e5d',
                    top: '300px',
                    left: '500px'
                },
                {
                    props: {
                        id: '1c47b773-5cc9-4610-91de-b77979143008',
                        name: '延时',
                        icon: 'el-icon-alarm-clock',
                        type: 'CLOCK',
                        style: { backgroundColor: '#fbf1bd', color: '#EDB342' },
                        rules: [{ id: '5ee6271c-47e4-492d-a055-85be9b145556', type: 'info', content: '' }]
                    },
                    rules: [{ id: '96ebbf69-f544-4bea-ad7b-b513f0abca95', type: 'info', content: '' }],
                    id: 'c9736f2a-af8c-43f0-8d88-1c532b9c9707',
                    top: '560px',
                    left: '200px'
                },
                {
                    props: {
                        id: '1ffc5ba9-2c34-48bb-ac46-7f71cc39ee72',
                        name: '电子邮件',
                        icon: 'el-icon-message',
                        type: 'MESSAGE',
                        style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
                        rules: [{ id: 'd0e96ef2-968c-4ff6-b027-62dcaa8e3d6d', type: 'info', content: '' }]
                    },
                    rules: [{ id: '53603549-521f-445b-b8af-18547157c311', type: 'info', content: '' }],
                    id: '8473cca3-e9ce-42e4-9808-6f33e5e0199c',
                    top: '570px',
                    left: '715px'
                },
                {
                    props: {
                        id: '67084df0-a7c7-4bfe-aa61-7c213dfdc314',
                        name: '目标',
                        icon: 'el-icon-present',
                        type: 'PRESENT',
                        style: { backgroundColor: '#e6e0ff', color: '#8E72F7' }
                    },
                    rules: [],
                    id: 'c257d284-b163-41c4-af30-5f5fff819c7e',
                    top: '780px',
                    left: '470px'
                }
            ]

            const line = [
                {
                    id: 'ee05f469-aff7-4c12-bb80-cd34662a98df',
                    parent: '024247fb-2403-465a-abc0-7648873442bb',
                    source: 'd65fe315-f62c-4e85-a5f2-629fa0170cd9',
                    target: '4e5d9cb5-65a9-4163-a723-3ed137fd9e5d',
                    label: '猪头'
                },
                {
                    id: '2e429fe4-bf9c-4806-8e7b-0ad43181aaad',
                    parent: '4e5d9cb5-65a9-4163-a723-3ed137fd9e5d',
                    source: '68d1ddf6-c7c8-4abb-ae47-060e7f770193',
                    target: 'c9736f2a-af8c-43f0-8d88-1c532b9c9707',
                    label: '猪头'
                },
                {
                    id: '7d31d831-0219-41df-aca9-c4f3e5c2bcb8',
                    parent: '4e5d9cb5-65a9-4163-a723-3ed137fd9e5d',
                    source: '43f9ffb1-8a69-4d12-9d87-ad16eb5016f4',
                    target: '8473cca3-e9ce-42e4-9808-6f33e5e0199c',
                    label: '猪头'
                },
                {
                    id: '59a005ba-46f1-4f85-9a01-9aa8a8ec68d2',
                    parent: '8473cca3-e9ce-42e4-9808-6f33e5e0199c',
                    source: '53603549-521f-445b-b8af-18547157c311',
                    target: 'c257d284-b163-41c4-af30-5f5fff819c7e',
                    label: '猪头'
                },
                {
                    id: 'bfbb3dbe-ec3b-4573-bb49-81a0181dc00c',
                    parent: 'c9736f2a-af8c-43f0-8d88-1c532b9c9707',
                    source: '96ebbf69-f544-4bea-ad7b-b513f0abca95',
                    target: 'c257d284-b163-41c4-af30-5f5fff819c7e',
                    label: '猪头'
                }
            ]

            // observer.emit('reload', { column, line })
        }, 2000)
    },
    methods: {
        onSelecter(e) {
            this.current = e
        }
    },
    render() {
        return (
            <div class="n-naive" style={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
                <Better dataSource={this.dataSource} onSelecter={this.onSelecter}></Better>
                <Container
                    observer={observer}
                    current-props={this.current}
                    axis-props={{ x: true, y: true }}
                    core-props={{ width: '100%', height: '100%', scale: 1, offsetX: 0, offsetY: 0, x: 0, y: 0 }}
                    column-props={[
                        {
                            props: {
                                id: '4d872f9c-7f65-43fc-85ae-0c01eb7323f9',
                                name: '电子邮件',
                                icon: 'el-icon-message',
                                type: 'MESSAGE',
                                style: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
                                rules: [{ id: 'ef713561-4659-406d-b165-38eca2f1cd95', type: 'info', content: '' }]
                            },
                            rules: [{ id: 'd65fe315-f62c-4e85-a5f2-629fa0170cd9', type: 'info', content: '' }],
                            id: '024247fb-2403-465a-abc0-7648873442bb',
                            top: '100px',
                            left: '300px'
                        },
                        {
                            props: {
                                id: '77cd0f97-7cc3-4554-855c-78ca230e6187',
                                name: '触发器',
                                icon: 'el-icon-cpu',
                                type: 'CPU',
                                style: { backgroundColor: '#ffe1e1', color: '#F78C88' },
                                rules: [
                                    { id: '2233e175-b36b-4c94-9897-8806793a34b3', type: 'danger', content: 'NO' },
                                    { id: '3aa44c05-e324-4f21-9c81-9bb7aca1f6f3', type: 'success', content: 'YES' }
                                ]
                            },
                            rules: [
                                { id: '68d1ddf6-c7c8-4abb-ae47-060e7f770193', type: 'danger', content: 'NO' },
                                { id: '43f9ffb1-8a69-4d12-9d87-ad16eb5016f4', type: 'success', content: 'YES' }
                            ],
                            id: '4e5d9cb5-65a9-4163-a723-3ed137fd9e5d',
                            top: '300px',
                            left: '500px'
                        },
                        {
                            props: {
                                id: '1c47b773-5cc9-4610-91de-b77979143008',
                                name: '延时',
                                icon: 'el-icon-alarm-clock',
                                type: 'CLOCK',
                                style: { backgroundColor: '#fbf1bd', color: '#EDB342' },
                                rules: [{ id: '5ee6271c-47e4-492d-a055-85be9b145556', type: 'info', content: '' }]
                            },
                            rules: [{ id: '96ebbf69-f544-4bea-ad7b-b513f0abca95', type: 'info', content: '' }],
                            id: 'c9736f2a-af8c-43f0-8d88-1c532b9c9707',
                            top: '560px',
                            left: '200px'
                        },
                        {
                            props: {
                                id: 'a662ba7e-9be8-4c96-875d-c8020d77fb18',
                                name: '目标',
                                icon: 'el-icon-present',
                                type: 'PRESENT',
                                style: { backgroundColor: '#e6e0ff', color: '#8E72F7' }
                            },
                            rules: [],
                            id: '110c45b9-c62e-4d08-9fac-7e384bb22a0d',
                            top: '765px',
                            left: '545px'
                        }
                    ]}
                    line-props={[
                        {
                            id: 'ed0d77dd-9d9c-4c0a-8237-7a37381086bd',
                            parent: '024247fb-2403-465a-abc0-7648873442bb',
                            source: 'd65fe315-f62c-4e85-a5f2-629fa0170cd9',
                            target: '4e5d9cb5-65a9-4163-a723-3ed137fd9e5d',
                            label: '猪头'
                        },
                        {
                            id: 'af347a9f-2973-4d7c-9928-8c0666e83b33',
                            parent: '4e5d9cb5-65a9-4163-a723-3ed137fd9e5d',
                            source: '68d1ddf6-c7c8-4abb-ae47-060e7f770193',
                            target: 'c9736f2a-af8c-43f0-8d88-1c532b9c9707',
                            label: '猪头'
                        },
                        {
                            id: 'bc65841e-5af0-42a7-a66f-f1c640483286',
                            parent: '4e5d9cb5-65a9-4163-a723-3ed137fd9e5d',
                            source: '43f9ffb1-8a69-4d12-9d87-ad16eb5016f4',
                            target: 'c9736f2a-af8c-43f0-8d88-1c532b9c9707',
                            label: '猪头'
                        },
                        {
                            id: 'f27ec262-b0ce-418c-9b07-f40d3e1aca4e',
                            parent: 'c9736f2a-af8c-43f0-8d88-1c532b9c9707',
                            source: '96ebbf69-f544-4bea-ad7b-b513f0abca95',
                            target: '110c45b9-c62e-4d08-9fac-7e384bb22a0d',
                            label: '猪头'
                        }
                    ]}
                ></Container>
                {/**<n-aside data-column={this.dataSource} onSelecter={this.onSelecter}></n-aside>**/}
                {/**<n-container current={this.current}></n-container>**/}
                {/**<n-chart data-column={this.multiple}></n-chart>**/}
            </div>
        )
    }
}
</script>
