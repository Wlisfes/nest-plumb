import Vue from 'vue'
import { v4 as only } from 'uuid'
import { initMounte, done } from '@/utils/utils-common'

export function fetchColumn(props) {
    return new Promise(resolve => {
        const Component = Vue.extend({
            name: 'FetchColumn',
            data() {
                return {
                    visible: false,
                    form: {
                        content: props.content ?? '',
                        rules: props.rules ?? []
                    },
                    rules: {}
                }
            },
            mounted() {
                initMounte().then(() => {
                    this.visible = true
                })
            },
            methods: {
                /**添加节点**/
                initNode() {
                    this.form.rules.push({ id: only(), type: undefined, content: '' })
                },
                onClose() {
                    this.visible = false
                    this.$emit('close', { done: delay => done(this.$el, delay ?? 500) })
                },
                onSubmit() {
                    this.$refs.formRef.validate(valid => {
                        this.$emit('submit', {
                            done: delay => done(this.$el, delay ?? 500),
                            form: this.form
                        })
                        this.visible = false
                    })
                }
            },
            render() {
                const { form, rules } = this

                return (
                    <el-drawer
                        size="640px"
                        title={props.name}
                        visible={this.visible}
                        destroy-on-close
                        onClose={this.onClose}
                    >
                        <el-form
                            ref="formRef"
                            label-width="80px"
                            style={{ margin: '0 20px' }}
                            {...{ props: { model: form, rules } }}
                        >
                            <el-form-item label="节点内容">
                                <el-input v-model={form.content} placeholder="节点内容"></el-input>
                            </el-form-item>
                            <el-form-item label="规则列表">
                                {form.rules.map(x => (
                                    <div style={{ display: 'flex', margin: '0 0 10px', alignItems: 'center' }}>
                                        <el-select v-model={x.type} placeholder="请选择" style={{ width: '150px' }}>
                                            <el-option label="success" value="success"></el-option>
                                            <el-option label="info" value="info"></el-option>
                                            <el-option label="danger" value="danger"></el-option>
                                        </el-select>
                                        <el-input
                                            v-model={x.content}
                                            placeholder="规则内容"
                                            style={{ width: '280px', margin: '0 10px' }}
                                        ></el-input>
                                        <i
                                            class="el-icon-delete"
                                            title="删除"
                                            style={{ fontSize: '22px', cursor: 'pointer', color: 'red' }}
                                        ></i>
                                    </div>
                                ))}
                                <el-button onClick={this.initNode}>添加节点</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button onClick={this.onClose}>取消</el-button>
                                <el-button type="primary" onClick={this.onSubmit}>
                                    保存
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-drawer>
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
