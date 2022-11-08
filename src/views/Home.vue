<script>
import { v4 } from 'uuid'
// import { NAside, NChart, NContainer } from '@/views/common'
import { Better, Container } from '@/bower'

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
                            top: '400px',
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
                            top: '650px',
                            left: '200px'
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
