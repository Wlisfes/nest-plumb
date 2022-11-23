import Vue from 'vue'
import { v4 as only } from 'uuid'
import { initMounte, done } from '@/utils/utils-common'

export function fetchSource(props) {
    return new Promise(resolve => {
        const Component = Vue.extend({
            name: 'FecthSource',
            data() {
                return {
                    visible: false,
                    loading: true,
                    form: {
                        name: undefined,
                        icon: undefined,
                        type: undefined,
                        connect: [],
                        delete: 1,
                        root: 1,
                        rules: []
                    },
                    rules: {
                        name: { required: true, message: '请输入节点名称', trigger: 'blur' },
                        icon: { required: true, message: '上传节点图标', trigger: 'blur' },
                        type: { required: true, message: '请选择节点类型', trigger: 'blur' },
                        connect: { required: true, message: '请选择节点连接类型', trigger: 'blur' }
                        // rules: { required: true, message: '上传节点图标', trigger: 'blur' }
                    },
                    column: [
                        { label: '绑定发送任务', value: 'BIND_TASK' },
                        { label: '自动营销', value: 'AUTO_MATIC' },
                        { label: '创建触发器', value: 'CREATE_TRIGGER' },
                        { label: '电子邮件', value: 'EMAIL' },
                        { label: '触发器', value: 'TRIGGER' },
                        { label: '目标', value: 'TARGET' }
                    ]
                }
            },
            mounted() {
                initMounte().finally(() => {
                    this.visible = true
                    const done = this.$watch('$route', () => this.onClose())
                    this.$once('hook:beforeDestroy', () => done())
                })
            },
            methods: {
                onClose() {
                    this.visible = false
                    this.$emit('close', { done: delay => done(this.$el, delay ?? 500) })
                },
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
                const { form, rules } = this

                return (
                    <el-dialog
                        width="840px"
                        class="el-customize"
                        destroy-on-close
                        title={props?.title ?? '创建节点'}
                        visible={this.visible}
                        onClose={this.onClose}
                    >
                        <el-scrollbar class="el-customize">
                            <el-form
                                ref="formRef"
                                style={{ margin: '20px 20px 0' }}
                                {...{ props: { model: form, rules, labelPosition: 'right', labelWidth: '110px' } }}
                            >
                                <el-row gutter={20}>
                                    <el-col span={12}>
                                        <el-form-item label="节点名称" prop="name">
                                            <el-input v-model={form.name} placeholder="请输入节点名称"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={12}>
                                        <el-form-item label="节点图标" prop="icon">
                                            <el-input v-model={form.icon} placeholder="请上传节点图标"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={12}>
                                        <el-form-item label="节点类型" prop="type">
                                            <el-select
                                                v-model={form.type}
                                                placeholder="请选择节点类型"
                                                style={{ width: '100%' }}
                                            >
                                                {this.column.map(x => (
                                                    <el-option
                                                        key={x.value}
                                                        label={x.label}
                                                        value={x.value}
                                                    ></el-option>
                                                ))}
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={12}>
                                        <el-form-item label="节点连接类型" prop="connect">
                                            <el-select
                                                v-model={form.connect}
                                                multiple
                                                collapse-tags
                                                placeholder="请选择节点连接类型"
                                                style={{ width: '100%' }}
                                            >
                                                {this.column.map(x => (
                                                    <el-option
                                                        key={x.value}
                                                        label={x.label}
                                                        value={x.value}
                                                    ></el-option>
                                                ))}
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={12}>
                                        <el-form-item label="删除开关" required>
                                            <el-select
                                                v-model={form.delete}
                                                placeholder="删除开关"
                                                style={{ width: '100%' }}
                                            >
                                                <el-option label="开启" value={1}></el-option>
                                                <el-option label="关闭" value={0}></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={12}>
                                        <el-form-item label="节点层级" required>
                                            <el-select
                                                v-model={form.root}
                                                placeholder="节点层级"
                                                style={{ width: '100%' }}
                                            >
                                                <el-option label="顶层节点" value={1}></el-option>
                                                <el-option label="普通节点" value={0}></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={24}>
                                        <el-form-item label="规则列表">
                                            <el-row gutter={16}>
                                                <el-col span={6} style={{ paddingLeft: 0 }}>
                                                    <el-form-item>
                                                        <el-input v-model={form.icon} placeholder="规则名称"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col span={6}>
                                                    <el-form-item>
                                                        <el-input-number
                                                            min={-1}
                                                            step-strictly
                                                            placeholder="最大连接数"
                                                            style={{ width: '100%' }}
                                                        ></el-input-number>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col span={6}>
                                                    <el-form-item>
                                                        <el-select
                                                            v-model={form.root}
                                                            placeholder="规则状态"
                                                            style={{ width: '100%' }}
                                                        >
                                                            <el-option label="显示" value={1}></el-option>
                                                            <el-option label="隐藏" value={0}></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col span={5}>
                                                    <el-button
                                                        type="danger"
                                                        icon="el-icon-delete"
                                                        style={{ width: '40px', padding: '10px 0' }}
                                                    ></el-button>
                                                    <el-button
                                                        type="success"
                                                        icon="el-icon-plus"
                                                        style={{ width: '40px', padding: '10px 0' }}
                                                    ></el-button>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-scrollbar>
                        <div slot="footer">
                            <el-button onClick={this.onClose}>取消</el-button>
                            <el-button type="primary" onClick={this.onSubmit}>
                                保存
                            </el-button>
                        </div>
                    </el-dialog>
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
