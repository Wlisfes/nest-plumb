import Vue from 'vue'
import { initMounte, done } from '@/utils/utils-common'
import { ClickOutside } from '@/utils/utils-click-outside'
import css from '@/core/less/fetch-tooltip.module.less'

export function fetchTooltip(props) {
    return new Promise(resolve => {
        const Component = Vue.extend({
            name: 'FetchTooltip',
            directives: { ClickOutside },
            data() {
                return {
                    visible: false,
                    loading: false
                }
            },
            mounted() {
                initMounte().then(() => {
                    this.visible = true
                })
            },
            methods: {
                onSelecter(e) {
                    console.log(e)
                },
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
                }
            },
            render() {
                return (
                    <transition name="el-fade-in" appear>
                        {this.visible && (
                            <div
                                class={css['n-tooltip']}
                                style={{ left: props.left + 'px', top: props.top - 25 + 'px' }}
                                v-click-outside={this.onClose}
                            >
                                <div class={css['n-tooltip-content']}>
                                    <div class={css['n-tooltip-text']}>
                                        <i class="el-icon-warning"></i>
                                        <span>确定要删除连接吗?</span>
                                    </div>
                                    <div class={css['n-tooltip-footer']}>
                                        <el-button
                                            size="mini"
                                            type="primary"
                                            loading={this.loading}
                                            onClick={this.onSubmit}
                                        >
                                            删除
                                        </el-button>
                                    </div>
                                    <div class={css['n-tooltip-arrow']}></div>
                                </div>
                            </div>
                        )}
                    </transition>
                )
            }
        })

        const instance = new Component().$mount(document.createElement('div'))

        if (props?.container) {
            props.container?.appendChild?.(instance.$el)
        } else {
            document.body.appendChild(instance.$el)
        }

        resolve({ instance })
    })
}
