<script>
import { command } from '../utils/utils-store'
import { fetchNotice } from '../hook/fetch-notice'

export default {
    name: 'NEmail',
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
                <div class="n-email">
                    <div class="n-email__notice">请设置邮件内容</div>
                </div>
                {this.$slots.default}
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-email {
    padding: 0 20px;
    &__notice {
        font-size: 12px;
        color: #6b6c72;
        line-height: 20px;
    }
}
</style>
