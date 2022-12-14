import Vue from 'vue'
import { initMounte, done } from '../utils/utils-common'
import { ClickOutside } from '../utils/utils-click-outside'
import css from '../less/fetch-notice.module.less'

export function fetchNotice(props) {
    const Component = Vue.extend({
        name: 'FetchNotice',
        directives: { ClickOutside },
        data() {
            return {
                visible: false,
                loading: false,
                message: props?.message ?? ''
            }
        },
        mounted() {
            initMounte().then(() => {
                this.visible = true
            })
        },
        methods: {
            /**关闭事件**/
            onClose() {
                this.visible = false
                this.$emit('close', { done: delay => done(this.$el, delay ?? 500) })
            },
            /**删除事件**/
            onSubmit() {
                this.$emit('submit', {
                    setState: loading => (this.loading = loading),
                    done: delay => {
                        this.visible = false
                        done(this.$el, delay ?? 500)
                    }
                })
            },
            /**动态修改message**/
            async fetchUpdate(message) {
                return (this.message = message)
            }
        },
        render() {
            return (
                <transition name="el-fade-in" appear>
                    {this.visible && (
                        <div
                            class={css['fetch-notice']}
                            style={{ left: props.left + 'px', top: props.top - 25 + 'px' }}
                            v-click-outside={{ handler: this.onClose, option: { catch: true } }}
                        >
                            <div class={css['fetch-notice-content']}>
                                <div class={css['fetch-notice-text']}>
                                    <i class="el-icon-warning"></i>
                                    <span>{this.message}</span>
                                </div>
                                <div class={css['fetch-notice-arrow']}></div>
                            </div>
                        </div>
                    )}
                </transition>
            )
        }
    })

    return new Promise(resolve => {
        const instance = new Component().$mount(document.createElement('div'))
        if (props?.container) {
            props.container?.appendChild?.(instance.$el)
        } else {
            document.body.appendChild(instance.$el)
        }

        resolve({ instance })
    })
}
