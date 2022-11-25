<script>
import { command } from '../utils/utils-store'
import { fetchNotice } from '../hook/fetch-notice'

export default {
    name: 'NMatic',
    props: {
        node: { type: Object },
        instance: { type: Object },
        observer: { type: Object },
        draggable: { type: Boolean }
    },
    mounted() {
        this.$nextTick(() => {
            const uninstall = [
                this.observer.on(command.validator, ({ node, done }) => {
                    this.fetchValidator(node)
                    done()
                })
            ]
            this.$once('hook:beforeDestroy', () => {
                uninstall.map(fn => fn())
            })
        })
    },
    methods: {
        /**监听参数验证订阅事件**/
        fetchValidator(response) {
            if (response.uid === this.node.uid) {
                if (this.notice) {
                    /**存在notice表示当前提示组件已经存在**/
                    this.notice.fetchUpdate('猪头').then(() => {
                        setTimeout(() => this.notice.onClose(), 1000)
                    })
                } else {
                    const container = this.$refs.content.parentNode
                    fetchNotice({
                        container,
                        top: 0,
                        left: container.clientWidth / 2,
                        message: <div style={{ whiteSpace: 'nowrap', color: '#ff0000' }}>{response.message}</div>
                    }).then(response => {
                        this.notice = response.instance
                        response.instance.$once('close', ({ done }) => {
                            this.notice = undefined
                            done()
                        })
                        response.instance.$once('submit', ({ done }) => {
                            this.notice = undefined
                            done()
                        })
                    })
                }
            }
        }
    },
    render() {
        return (
            <div ref="content" class="n-common__content">
                <div class="n-matic">
                    <div class="n-matic__notice">将右边的元素拖拽至该营销编辑窗口并将其连接，以创建邮件发送工作流</div>
                    <div class="n-matic__content">
                        <div class="n-label">邮件主题：</div>
                        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
                            <div class="n-content">{this.content}</div>
                        </div>
                    </div>
                </div>
                {this.$slots.default}
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-matic {
    padding: 0 20px;
    &__notice {
        font-size: 12px;
        color: #6b6c72;
        line-height: 20px;
    }
    &__content {
        height: 28px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        .n-label {
            font-size: 14px;
            color: #6b6c72;
        }
        .n-content {
            font-size: 14px;
            color: #6aa2d5;
            line-height: 28px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background-color: #f7f7f7;
            border-radius: 14px;
            padding: 0 10px;
        }
    }
}
</style>
